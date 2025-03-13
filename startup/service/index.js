const express = require('express');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));


app.listen(port, () => {
    console.log("Webserver started.")
})

//TODO: Registration Endpoint - doctors list, check if exists, store user info.
//TODO: Login Endpoint - check if exists, cookie auth token, 
//TODO: FindUser Endpoint
//TODO: Logout Endpoint
//TODO: Change login state to middleware checking?
//TODO: Authentication Endpoint
//TODO: Add appointments to schedules for user and doctor.
//TODO: Move getSchedulingClass, ChatGPT call, timeGenerator, TimesAvailable to backend. Add wrapper for TimesAvailable.
//TODO: Move Doctors list to backend, make frontend a wrapper for endpoint.
//TODO: GetUserData Endpoint, SetUserData endpoint
//TODO: Export Appointments Endpoint: 3rd party service on backend
//TODO: Move FetchAppts and DeleteAppts to backend.
//TODO: Move form validation to backend?
//TODO: Double hash passwords