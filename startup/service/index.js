const express = require('express');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const app = express();
const openai = require('openai');
const { MongoClient } = require('mongodb');

const port = process.argv.length > 2 ? process.argv[2] : 4000;
const config = require('./config.json');
const apiKey = config.OPENAI_API_KEY;
const dbConfig = require('./dbConfig.json');
const url = dbConfig.uri;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
const openaiClient = new openai.OpenAI({ apiKey: apiKey});
const dbClient = new MongoClient(url);
const db = dbClient.db('rappt');
const users = db.collection('users');
const doctors = db.collection('doctors');

const apiRouter = express.Router();
app.use('/api', apiRouter);

(async function testConnection() {
    try {
        await db.command({ping: 1});
        console.log('Database connected.');
    } catch (err) {
        console.error(err.message);
        process.exit(1)
    }
})();

users.insertOne({
    name: "James Howard",
    email: "james.howard@ihc.org",
    doctorStatus: "true",
    dateOfBirth: "1973-06-07",
    appointments: [],
    hashedPassword: "$2b$10$fMq04y1YKZWaaggHd6GMI.KmnKuMQXavmF.8d/kr1d9wx0NV5vP0m"
  });
doctors.insertOne({email: "james.howard@ihc.org", name: "James Howard"});

async function userExists(userName) {
    if(userName && await users.countDocuments({email: userName}) > 0) {
        return true;
    }
    return false;
}

async function getValue(userName,key) {
    try {
        const result = await users.findOne({email: userName},{_id: 0, [key]:1});
        return result[key];
    } catch {
        return undefined;
    }
    
}

function setValue(userName,key,value) {
    try {
        users[userName][key] = value;
    } catch {
        console.error(`Error setting value ${key}.`);
    }
    
}

function setCookies(res,userName) {
    const token = uuid.v4();
    setValue(userName, 'authToken', token)
    res.cookie('authToken', token, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 3600000
    })
    res.cookie('userName', userName, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 3600000
    })
}

const checkAuth = async (req,res,next) => {
    const userName = req.cookies.userName;
    const currentToken = req.cookies.authToken;
    if(userName && currentToken && await getValue(userName,'authToken')===currentToken) {
        next();
    } else {
        res.status(401).send({error: 'Authentication failed. Please log in again.'})
    }
}

function determineSchedulingClass(apptData) {
    const pain = +apptData.painLevel;
    const urgency = +apptData.urgencyLevel;
    const seriousness = +apptData.seriousness;
    return Math.ceil((pain+urgency+seriousness)/3);
}

async function getChatgptResponse(apptData) {
    query = `Given the symptoms: ${apptData.symptoms}, give a ranking of the probable severity of these symptoms from 1-10 with 1 being the lowest and 10 the highest, and give the most probably diagnosis. Give only one number separated from the diagnosis with a comma, and give only the number and condition, with no extra words or commentary. If there are commas in the condition, remove them.`
    const completion = await openaiClient.chat.completions.create({
        model: "gpt-4o",
        messages: [{
            role: "user",
            content: query,
        }],
    });
    const response = completion.choices[0].message.content.split(',');
    apptData.diagnosis = response[1];
    apptData.seriousness = response[0];
    return apptData;
}

apiRouter.post('/register', async (req, res) => {
    const userData = req.body;
    if(await userExists(userData.email)) {
        res.status(409).send({error: "That user already exists. Please log in instead."})
        return;
    }
    if(Object.values(userData).some(value => value==="")) {
        res.status(400).send({error: "One or more fields are empty. Please fill them in and resubmit."})
        return;
    }
    if(userData.doctorStatus) {
        doctors[userData.email] = userData.name;
    }
    try {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.hashedPassword = hashedPassword;
        delete userData.password;
    } catch (err) {
        console.error(`Error: ${err}`);
    }
    users[userData.email] = userData;
    setCookies(res,userData.email);
    res.status(201).send({userName: userData.email});
})

apiRouter.post('/login', async (req,res) => {
    const loginData = req.body;
    const exists = await userExists(loginData.email);
    if(!exists) {
        res.    status(404).send({error: "No user found with that email. Please create an account."});
        return;
    }
    const storedPassword = await getValue(loginData.email,'hashedPassword');
    let passwordsMatch = false;
    if(loginData.password && storedPassword) {
        passwordsMatch = await bcrypt.compare(loginData.password, storedPassword);
    }
    if(passwordsMatch) {
        setCookies(res,loginData.email);
        res.status(200).send({userName: loginData.email});
        return;
    } else {
        res.status(401).send({error: "Incorrect password."});
        return;
    }
})

apiRouter.delete('/logout', async (req,res) => {
    const userName = req.cookies.userName;
    setValue(userName,'authToken',null);
    res.clearCookie('authToken');
    res.clearCookie('userName');
    res.sendStatus(204);
})

apiRouter.delete('/appointments/delete', checkAuth, async (req,res) => {
    const userName = req.cookies.userName;
    let userAppointments = await getValue(userName,'appointments');
    let doctorAppointments = await getValue(req.body.doctor,'appointments');
    let newUserAppointments = [];
    let newDoctorAppointments = [];
    userAppointments.forEach(element => {
        if (Object.keys(element)[0] !== req.body.id) {
            newUserAppointments.push(element);
        }
    });
    doctorAppointments.forEach(element => {
        if (Object.keys(element)[0] !== req.body.id) {
            newDoctorAppointments.push(element);
        }
    });
    setValue(userName,'appointments',newUserAppointments);
    setValue(req.body.doctor,'appointments',newDoctorAppointments);
    res.status(200).send({'updatedAppointments': newUserAppointments});
})

apiRouter.get('/doctors/', checkAuth, async (_req,res) => {
    res.status(200).send(doctors);
})

apiRouter.get('/data/get/all', checkAuth, async (req,res) => {
    const userName = req.cookies.userName;
    const storedData = await users.findOne({email: userName}, {_id: 0, hashedPassword: 0, authToken: 0});
    res.status(200).send(storedData);
})

apiRouter.post('/data/get', checkAuth, async (req,res) => {
    const key = req.body.key;
    const userName = req.cookies.userName;
    let result = {};
    result[key] = await getValue(userName,key);
    res.send(result);
})

apiRouter.post('/appointments/create', checkAuth, async (req,res) => {
    let appointmentData = req.body.appointmentData;
    const userName = req.cookies.userName;
    if (Object.values(appointmentData).some((value) => (value === "" || value === undefined))) {
        res.status(400).send({error: 'One or more of the fields are empty. Please check your response and resubmit.'})
        return;
    }
    if (appointmentData.name===await getValue(userName,'name') && appointmentData.dateOfBirth===await getValue(userName,'dateOfBirth')) {
        setValue(userName,'gender',appointmentData.gender);
        setValue(userName,'phone',appointmentData.phone);
        setValue(userName,'address',appointmentData.address)
    }
    appointmentData = await getChatgptResponse(appointmentData);
    appointmentData.schedulingClass = determineSchedulingClass(appointmentData);
    let userAppointments = await getValue(userName,'appointments');
    userAppointments.push({[req.body.appointmentID]:appointmentData});
    setValue(userName,'appointments',userAppointments);
    res.status(200).send({apptData: appointmentData});
})

function* timeGenerator(suggestedDate) {
    suggestedDate.setSeconds(0);
    while(true) {
        if(suggestedDate.getHours() > 16) {
            suggestedDate.setHours(9);
            suggestedDate.setDate((suggestedDate.getDate()+1));
        } else if(suggestedDate.getHours() < 9) {
            suggestedDate.setHours(9);
        }
        if(!(1<=suggestedDate.getDay() && suggestedDate.getDay()<=5)) {
            suggestedDate.setDate((suggestedDate.getDate()+1));
        }
        if(1<=suggestedDate.getMinutes() && suggestedDate.getMinutes()<=29) {
            suggestedDate.setMinutes(30);
        } else if(31<=suggestedDate.getMinutes() && suggestedDate.getMinutes()<=59) {
            suggestedDate.setMinutes(60);
        }
        yield new Date(suggestedDate);
        suggestedDate.setMinutes((suggestedDate.getMinutes()+30));
    }
}

apiRouter.post('/appointments/schedule/getTimes', checkAuth, async (req,res) => {
    const classDateBindings = {10: 0, 9: 1, 8: 2, 7:3, 6:5, 5:7, 4:14, 3:30, 2:60, 1:180}
    const currentDay = new Date();
    const suggestedDate = new Date();
    const schedulingClass = req.body.schedulingClass;
    const dateOffset = classDateBindings[schedulingClass];
    suggestedDate.setDate((currentDay.getDate() + dateOffset));
    const generator = timeGenerator(suggestedDate);
    for(let i = 0; i < req.body.offset; i++) {
        generator.next();
    }
    const times = [generator.next().value,generator.next().value,generator.next().value]
    res.status(200).send({times: times});
})

apiRouter.post('/appoointments/schedule/setAppointment', checkAuth, async (req,res) => {
    const apptData = req.body.appointmentData;
    const userName = req.cookies.userName;
    const apptId = req.body.appointmentId;
    let userAppointments = await getValue(userName,'appointments');
    let doctorAppointments = await getValue(apptData.doctor,'appointments')
    userAppointments.forEach(item => {if(Object.keys(item)[0]===apptId) {item[apptId] = apptData}});
    doctorAppointments.push({[apptId]: apptData});
    setValue(userName,'appointments',userAppointments);
    setValue(apptData.doctor,'appointments',doctorAppointments);
    res.sendStatus(200);
})

app.use(function (err,_req,res,_next) {
    res.status(500).send({error: err.message})
})

app.use((_req,res) => {
    res.sendFile('index.html', {root: 'public'});
})

app.listen(port, () => {
    console.log("Webserver started.")
})

//TODO: Redo registration
//TODO: Set value
//TODO: Doctors endpoint
//TODO: Make sure everything is ok in users if email key is removed
//TODO: Check things that use doctors endpoint (appointments doctor vs patient name, create doctors list)