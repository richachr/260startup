const express = require('express');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

const apiRouter = express.Router();
app.use('/api', apiRouter);

let users = [{
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
}];
let doctors = {"james.howard@ihc.org": "James Howard"};

async function userExists(userName) {
    if(userName && users.some((user) => {return user.email===userName;})) {
        return true;
    }
    return false;
}

function getValue(userName,key) {
    return users.find((user) => user.email===userName)[key];
}

function setValue(userName,key,value) {
    users.find((user) => user.email===userName)[key] = value;
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
    users.push(userData);
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
    let result = users.find((user) => user.email===userName);
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

app.listen(port, () => {
    console.log("Webserver started.")
})

//TODO: Use Authentication Endpoint for sensitive calls.
//TODO: Doctor/patient names on appts page
//TODO: Add appointments to schedules for user and doctor. Add user email to appt data.
//TODO: Move getSchedulingClass, ChatGPT call, timeGenerator, TimesAvailable to backend. Add wrapper for TimesAvailable.
//TODO: SetUserData endpoint?
//TODO: Export Appointments: Not using API, implement serverside?
//TODO: Move form validation to backend?