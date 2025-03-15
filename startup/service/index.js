const express = require('express');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const app = express();
const openai = require('openai');

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

const apiRouter = express.Router();
app.use('/api', apiRouter);

let users = {"test@test.test": {
    "name": "test",
    "email": "test@test.test",
    "dateOfBirth": "2025-02-26",
    "hashedPassword": "$2b$10$fU0RTDHctl2g4cdgeWkfMO.1RK8uOVdvfBRWLlVJYGJiNqXuAtU0y",
    "appointments": [
        {
            "7a925dec-6f53-419b-86b4-fd83a89edb48": {
                "name": "test",
                "dateOfBirth": "2025-02-26",
                "gender": "Male",
                "phone": "8018018011",
                "address": "9 Heritage Halls #4104",
                "doctor": "james.howard@ihc.org",
                "purpose": "Non-urgent Treatment",
                "painLevel": "3",
                "urgencyLevel": "3",
                "symptoms": "Owie",
                "diagnosis": "Needs medical care.",
                "seriousness": 5,
                "schedulingClass": 4,
                "time": "Fri Mar 14 2025 11:00:00 GMT-0600 (Mountain Daylight Time)"
            }
        }
    ],
    "gender": "Male",
    "phone": "8018018011",
    "address": "9 Heritage Halls #4104"
}};
let doctors = {"james.howard@ihc.org": "James Howard"};

async function userExists(userName) {
    if(userName && userName in Object.keys(users)) {
        return true;
    }
    return false;
}

function getValue(userName,key) {
    return users[userName][key];
}

function setValue(userName,key,value) {
    users[userName][key] = value;
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
    if(getValue(userName,'authToken')===currentToken) {
        next();
    } else {
        res.status(401).send({error: 'Authentication failed. Please log in again.'})
    }
}

function determineSchedulingClass(apptData) {
    const pain = +Object.values(apptData)[0].painLevel;
    const urgency = +Object.values(apptData)[0].urgencyLevel;
    const seriousness = +Object.values(apptData)[0].seriousness;
    return Math.ceil((pain+urgency+seriousness)/3);
}

function getChatgptResponse(apptData) {
    query = `Given the symptoms: ${apptData.symptoms}, give a ranking of the probable severity of these symptoms from 1-10 with 1 being the lowest and 10 the highest, and give the most probably diagnosis. Give only one number separated from the diagnosis with a comma, and give only the number and condition, with no extra words or commentary.`
    apptData.diagnosis = "Needs medical care."
    Object.values(apptData)[0].seriousness = 5
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
        userData.hashedPassword = await bcrypt.hash(userData.hashedPassword, 10);
    } catch (err) {
        console.error(`Error: ${err}`);
    }
    users[userData.email] = userData;
    setCookies(res,userData.email);
    res.status(201).send({userName: userData.email});
})

apiRouter.post('/login', async (req,res) => {
    const loginData = req.body;
    let enteredPassword;
    if(!await userExists(loginData.email)) {
        res.status(404).send({error: "No user found with that email. Please create an account."});
        return;
    }
    try {
        enteredPassword = await bcrypt.hash(loginData.hashedPassword, 10);
    } catch (err) {
        console.error(`Error: ${err}`);
    }
    const storedPassword = getValue(loginData.email,hashedPassword);
    if(bcrypt.compare(enteredPassword, storedPassword)) {
        setCookies(res,loginData.email);
        res.status(200).send({userName: loginData.email});
        return;
    } else {
        res.status(401).send({error: "Incorrect password."});
        return;
    }
})

apiRouter.delete('/logout', async (req,res) => {
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
    res.status(200).send(doctors);
})

apiRouter.get('/data/get/all', checkAuth, async (req,res) => {
    const userName = req.cookies.userName;
    let result = users[userName];
    delete result.hashedPassword;
    res.status(200).send(result);
})

apiRouter.get('/data/get', checkAuth, async (req,res) => {
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

apiRouter.put('/appointments/create', checkAuth, async (req,res) => {
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

app.listen(port, () => {
    console.log("Webserver started.")
})

//TODO: Use Authentication Endpoint for sensitive calls.
//TODO: Add appointments to schedules for user and doctor.
//TODO: Move getSchedulingClass, ChatGPT call, timeGenerator, TimesAvailable to backend. Add wrapper for TimesAvailable.
//TODO: SetUserData endpoint?
//TODO: Move form validation to backend?