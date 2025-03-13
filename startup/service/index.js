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
let doctors = {};

async function userExists(userName) {
    if(userName && users.some((user) => {return user.email===userName;})) {
        return true;
    }
    return false;
}

function getValue(userName,key) {
    return users.find((user) => user.email===userName)[key];
}

apiRouter.post('/register', async (req, res) => {
    const userData = req.body;
    if(await userExists(userData.email)) {
        return res.status(409).send({error: "That user already exists. Please log in instead."})
    }
    if(Object.values(userData).some(value => value==="")) {
        return res.status(400).send({error: "One or more fields are empty. Please fill them in and resubmit."})
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
    return res.status(201).send({userName: userData.email});
})

apiRouter.post('/login', async (req,res) => {
    const loginData = req.body;
    let enteredPassword;
    if(!await userExists(loginData.email)) {
        return res.status(404).send({error: "No user found with that email. Please create an account."})
    }
    try {
        enteredPassword = await bcrypt.hash(loginData.hashedPassword, 10);
    } catch (err) {
        console.error(`Error: ${err}`);
    }
    const storedPassword = getValue(loginData.email,hashedPassword);
    if(await bcrypt.compare(enteredPassword, storedPassword)) {
        return res.status(200).send({userName: loginData.email});
    } else {
        return res.status(401).send({error: "Incorrect password."});
    }
})

app.listen(4000, () => {
    console.log("Webserver started.")
})

//TODO: Cookie auth token for registration and login
//TODO: Logout Endpoint
//TODO: Change login state to middleware checking?
//TODO: Authentication Endpoint
//TODO: Add appointments to schedules for user and doctor. Add user email to appt data.
//TODO: Move getSchedulingClass, ChatGPT call, timeGenerator, TimesAvailable to backend. Add wrapper for TimesAvailable.
//TODO: Move Doctors list to backend, make frontend a wrapper for endpoint.
//TODO: GetUserData Endpoint, SetUserData endpoint
//TODO: Export Appointments Endpoint: 3rd party service on backend
//TODO: Move FetchAppts and DeleteAppts to backend.
//TODO: Move form validation to backend?