import React, {useState} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export function CreateAppointment(props) {
    const navigate = useNavigate();
    let userData = JSON.parse(localStorage.getItem(props.userName));
    const [name,setName] = useState(userData.name);
    const [dateOfBirth, setDateOfBirth] = useState(userData.dateOfBirth);
    const [gender, setGender] = useState(userData.gender ? userData.gender : undefined);
    const [phone, setPhone] = useState(userData.phone ? userData.phone : undefined);
    const [address, setAddress] = useState(userData.address ? userData.address : undefined);
    const [doctor, setDoctor] = useState(undefined);
    const [purpose, setPurpose] = useState(undefined);
    const [painLevel, setPainLevel] = useState(undefined);
    const [urgencyLevel, setUrgencyLevel] = useState(undefined);
    const [symptoms, setSymptoms] = useState(undefined);
    return (
        <div className="mainContent" id="postAuth">
            <img id="postAuth" src="papers.png" alt="Person doing paperwork" />
            <h1>Appointment, you say?</h1>
            <h3>Let's get the forms filled out.</h3>
            <form action="scheduler.html" method="post">
                <div id="postAuth" className="formItem">
                    <label for="patientName">What's the full name of the patient?</label>
                    <input type="text" name="patientName" id="patientName" placeholder="John Doe" defaultValue={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div id="postAuth" className="formItem">
                    <label for="dob">What's the patient's date of birth?</label>
                    <input type="date" name="dob" id="dob" placeholder="1/1/1970" defaultValue={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                </div>
                <div id="postAuth" className="formItem">
                    <label for="gender">What's the patient's gender?</label>
                    <select name="gender" id="gender" defaultChecked={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value={undefined}></option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                    </select>
                </div>
                <div id="postAuth" className="formItem">
                    <label for="phone">What's the best phone number for contacting the patient?</label>
                    <input type="tel" name="phone" id="phone" placeholder="(801) 555-2039" defaultValue={phone} onChange={(e) => setPhone(e.target.value)}/>
                </div>
                <div id="postAuth" className="formItem">
                    <label for="address">What's the patient's address?</label>
                    <input type="text" name="address" id="address" defaultValue={address} onChange={(e) => setAddress(e.target.value)}/>
                </div>
                <div id="postAuth" className="formItem">
                    <label for="doctor">Which doctor are you looking to see?</label>
                    <select name="doctor" id="doctor" onChange={(e) => setDoctor(e.target.value)}>
                        <option></option>
                        <option value="1">Dr. Andrew Smithfield</option>
                        <option value="2">Dr. Sandra Martinez</option>
                        <option value="3">Dr. Michael Jenkins</option>
                    </select>
                </div>
                <div id="postAuth" className="formItem">
                    <label for="purpose">What's the purpose of the appointment?</label>
                    <select name="purpose" id="purpose" onChange={(e) => setPurpose(e.target.value)}>
                        <option></option>
                        <option value="regular">Regular Check-up</option>
                        <option value="followUp">Follow-up Appointment</option>
                        <option value="consult">Consultation</option>
                        <option value="urgent">Urgent Treatment</option>
                        <option value="nonUrgent">Non-urgent Treatment</option>
                        <option value="test">Testing/Diagnosis</option>
                    </select>
                </div>
                <div id="postAuth" className="formItem">
                    <label for="pain">How would you rate your pain on a scale of 1-10?</label>
                    <input type="number" name="pain" id="pain" min="1" max="10" onChange={(e) => setPainLevel(e.target.value)}/>
                </div>
                <div id="postAuth" className="formItem">
                    <label for="urgency">How would you rate the urgency of your appointment on a scale of 1-10?</label>
                    <input type="number" name="urgency" id="urgency" min="1" max="10" onChange={(e) => setUrgencyLevel(e.target.value)}/>
                </div>
                <div id="postAuth" className="formItem">
                    <label for="symptoms">What are your symptoms?</label>
                    <input type="text" name="symptoms" id="symptoms" onChange={(e) => setSymptoms(e.target.value)}/>
                </div>
            </form>
            <nav>
                <button onClick={() => navigate(-1)} type="button" className="danger"><span>Back</span></button>
                <NavLink to="/scheduler"><button type="button" className="primary"><FontAwesomeIcon icon={faArrowRight} className="fontAwesome" /></button></NavLink>
            </nav>
        </div>
    )
}