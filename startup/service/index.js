const express = require('express');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const app = express();
const openai = require('openai');

const port = process.argv.length > 2 ? process.argv[2] : 4000;
const config = require('./config.json');
const apiKey = config.OPENAI_API_KEY;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
const client = new openai.OpenAI({ apiKey: apiKey});

const apiRouter = express.Router();
app.use('/api', apiRouter);

let users = {};
let doctors = {"james.howard@ihc.org": "James Howard"};

function userExists(userName) {
    // Tested
    if(userName && userName in users) {
        return true;
    }
    return false;
}

function getValue(userName,key) {
    // Tested
    try {
        return users[userName][key];
    } catch {
        return undefined;
    }
    
}

function setValue(userName,key,value) {
    // Tested
    try {
        users[userName][key] = value;
    } catch {
        console.error(`Error setting value ${key}.`);
    }
    
}

function setCookies(res,userName) {
    // Tested
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
    // Tested
    const userName = req.cookies.userName;
    const currentToken = req.cookies.authToken;
    if(userName && currentToken && getValue(userName,'authToken')===currentToken) {
        next();
    } else {
        res.status(401).send({error: 'Authentication failed. Please log in again.'})
    }
}

function determineSchedulingClass(apptData) {
    const pain = +apptData.painLevel;
    // const urgency = +Object.values(apptData)[0].urgencyLevel;
    const urgency = +apptData.urgencyLevel;
    const seriousness = +apptData.seriousness;
    return Math.ceil((pain+urgency+seriousness)/3);
}

async function getChatgptResponse(apptData) {
    query = `Given the symptoms: ${apptData.symptoms}, give a ranking of the probable severity of these symptoms from 1-10 with 1 being the lowest and 10 the highest, and give the most probably diagnosis. Give only one number separated from the diagnosis with a comma, and give only the number and condition, with no extra words or commentary.`
    const completion = await client.chat.completions.create({
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
    // Tested
    const userData = req.body;
    if(userExists(userData.email)) {
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
    // Tested
    const loginData = req.body;
    const exists = userExists(loginData.email);
    if(!exists) {
        res.    status(404).send({error: "No user found with that email. Please create an account."});
        return;
    }
    const storedPassword = getValue(loginData.email,'hashedPassword');
    const passwordsMatch = await bcrypt.compare(loginData.password, storedPassword);
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
    // Tested
    const userName = req.cookies['userName'];
    setValue(userName,'authToken',undefined);
    res.clearCookie('authToken');
    res.clearCookie('userName');
    res.sendStatus(204);
})

apiRouter.delete('/appointments/delete', checkAuth, async (req,res) => {
    const userName = req.cookies['userName'];
    let userAppointments = getValue(userName,'appointments');
    let doctorAppointments = getValue(req.body.doctor,'appointments');
    let newUserAppointments = [];
    let newDoctorAppointments = [];
    userAppointments.forEach(element => {
        if (Object.keys(element)[0] !== id) {
            newUserAppointments.push(element);
        }
    });
    doctorAppointments.forEach(element => {
        if (Object.keys(element)[0] !== id) {
            newDoctorAppointments.push(element);
        }
    });
    setValue(userName,'appointments',newUserAppointments);
    setValue(req.body.doctor,'appointments',newDoctorAppointments);
    res.status(200).send({'updatedAppointments': newUserAppointments});
})

apiRouter.get('/doctors/', checkAuth, async (_req,res) => {
    // Tested
    res.status(200).send(doctors);
})

apiRouter.get('/data/get/all', checkAuth, async (req,res) => {
    const userName = req.cookies.userName;
    let result = users[userName];
    if(result.hashedPassword) {
        delete result.hashedPassword;
    }
    if(result.authToken) {
        delete result.authToken;
    }
    res.status(200).send(result);
})

apiRouter.post('/data/get', checkAuth, async (req,res) => {
    // Tested
    const key = req.body.key;
    const userName = req.cookies.userName;
    let result = {};
    if(typeof key==="object") {
        key.forEach(element => {
            result[element] = getValue(userName,element);
        });
    } else {
        result[key] = getValue(userName,key);
    }
    res.send(result);
})

apiRouter.post('/appointments/create', checkAuth, async (req,res) => {
    const appointmentData = req.body.appointmentData;
    const userName = req.cookies.userName;
    if (Object.values(appointmentData).some((value) => (value === "" || value === undefined))) {
        res.status(400).send({error: 'One or more of the fields are empty. Please check your response and resubmit.'})
        return;
    }
    if (appointmentData.name===getValue(userName,'name') && dateOfBirth===getValue(userName,'dateOfBirth')) {
        setValue(userName,'gender',appointmentData.gender);
        setValue(userName,'phone',appointmentData.phone);
        setValue(userName,'address',appointmentData.address)
    }
    let userAppointments = getValue(userName,'appointments');
    userAppointments.push({[req.body.appointmentID]:appointmentData});
    setValue(userName,'appointments',userAppointments);
    res.sendStatus(204);
})

apiRouter.post('/appoointments/schedule/getSchedule', checkAuth, async (req,res) => {
    let apptData = await getChatgptResponse(req.body.appointmentData)
    apptData.schedulingClass = determineSchedulingClass(apptData);
    const userName = req.cookies.userName;
    const apptId = req.body.appointmentId;
    let userAppointments = getValue(userName,'appointments');
    userAppointments[apptId] = apptData;
    setValue(userName,'appointments',userAppointments);
    res.status(200).send({data: apptData});
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
    suggestedDate.setDate((currentDay.getDate() + classDateBindings[req.body.schedulingClass]));
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
    let userAppointments = getValue(userName,'appointments');
    let doctorAppointments = getValue(apptData.doctor,'appointments')
    userAppointments[apptId] = apptData;
    doctorAppointments[apptId] = apptData;
    setValue(userName,'appointments',userAppointments);
    setValue(apptData.doctor,'appointments',doctorAppointments);
    res.sendStatus(200);
})

app.use(function (err,_req,res,next) {
    res.status(500).send({error: err.message})
})

app.use((_req,res) => {
    res.sendFile('index.html', {root: 'public'});
})

app.listen(port, () => {
    console.log("Webserver started.")
})

//TODO: Test scheduling class, chatgpt, appointment creation, appointment deletion, get all data, get schedules, get times, set appointment.
//TODO: Password not stored as hash
//TODO: Create page not autofilling