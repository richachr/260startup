import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export function CreateAppointment() {

    const navigate = useNavigate();

    return (
        <div className="mainContent">
            <img src="papers.png" alt="Person doing paperwork" />
            <h1>Appointment, you say?</h1>
            <h3>Let's get the forms filled out.</h3>
            <form action="scheduler.html" method="post">
                <div className="formItem">
                    <label for="patientName">What's the full name of the patient?</label>
                    <input type="text" name="patientName" id="patientName" placeholder="John Doe" />
                </div>
                <div className="formItem">
                    <label for="dob">What's the patient's date of birth?</label>
                    <input type="date" name="dob" id="dob" placeholder="1/1/1970" />
                </div>
                <div className="formItem">
                    <label for="gender">What's the patient's gender?</label>
                    <select name="gender" id="gender">
                        <option></option>
                        <option value="f">Female</option>
                        <option value="m">Male</option>
                    </select>
                </div>
                <div className="formItem">
                    <label for="phone">What's the best phone number for contacting the patient?</label>
                    <input type="tel" name="phone" id="phone" placeholder="(801) 555-2039" />
                </div>
                <div className="formItem">
                    <label for="address">What's the patient's address?</label>
                    <input type="text" name="address" id="address" />
                </div>
                <div className="formItem">
                    <label for="doctor">Which doctor are you looking to see?</label>
                    <select name="doctor" id="doctor">
                        <option></option>
                        <option value="1">Dr. Andrew Smithfield</option>
                        <option value="2">Dr. Sandra Martinez</option>
                        <option value="3">Dr. Michael Jenkins</option>
                    </select>
                </div>
                <div className="formItem">
                    <label for="purpose">What's the purpose of the appointment?</label>
                    <select name="purpose" id="purpose">
                        <option></option>
                        <option value="regular">Regular Check-up</option>
                        <option value="followUp">Follow-up Appointment</option>
                        <option value="consult">Consultation</option>
                        <option value="urgent">Urgent Treatment</option>
                        <option value="nonUrgent">Non-urgent Treatment</option>
                        <option value="test">Testing/Diagnosis</option>
                    </select>
                </div>
                <div className="formItem">
                    <label for="pain">How would you rate your pain on a scale of 1-10?</label>
                    <input type="number" name="pain" id="pain" min="1" max="10" />
                </div>
                <div className="formItem">
                    <label for="urgency">How would you rate the urgency of your appointment on a scale of 1-10?</label>
                    <input type="number" name="urgency" id="urgency" min="1" max="10" />
                </div>
                <div className="formItem">
                    <label for="symptoms">What are your symptoms?</label>
                    <input type="text" name="symptoms" id="symptoms" />
                </div>
            </form>
            <nav>
                <button onClick={() => navigate(-1)} type="button" className="danger"><span>Back</span></button>
                <NavLink to="scheduler"><button type="button" className="primary"><i className="fa-solid fa-arrow-right"></i></button></NavLink>
            </nav>
        </div>
    )
}