import React, {useState} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuid } from "uuid";

function DoctorsInput(props) {
    const doctors = localStorage.getItem("doctors") ? JSON.parse(localStorage.getItem("doctors")) : {"james.howard@ihc.org": "James Howard"};
    return (
        <select name="doctor" id="doctor" defaultValue={props.doctor} onChange={(e) => props.setDoctor(e.target.value)}>
            <option></option>
            {Object.entries(doctors).map(([key,value]) => {
                return <option key={key} value={key}>{`Dr. ${value}`}</option>
            })}
        </select>
    )
}

export function CreateAppointment(props) {
    const navigate = useNavigate();
    let userData = JSON.parse(localStorage.getItem(props.userName));
    const savedData = props.currentApptData ? Object.values(props.currentApptData)[0] : {};
    const [name,setName] = useState(savedData.name ? savedData.name : userData.name);
    const [dateOfBirth, setDateOfBirth] = useState(savedData.dateOfBirth ? savedData.dateOfBirth : userData.dateOfBirth);
    const [gender, setGender] = useState(savedData.gender ? savedData.gender : userData.gender ? userData.gender : undefined);
    const [phone, setPhone] = useState(savedData.phone ? savedData.phone : userData.phone ? userData.phone : undefined);
    const [address, setAddress] = useState(savedData.address ? savedData.address : userData.address ? userData.address : undefined);
    const [doctor, setDoctor] = useState(savedData.doctor ? savedData.doctor : undefined);
    const [purpose, setPurpose] = useState(savedData.purpose ? savedData.purpose : undefined);
    const [painLevel, setPainLevel] = useState(savedData.painLevel ? savedData.painLevel : undefined);
    const [urgencyLevel, setUrgencyLevel] = useState(savedData.urgencyLevel ? savedData.urgencyLevel : undefined);
    const [symptoms, setSymptoms] = useState(savedData.symptoms ? savedData.symptoms : undefined);

    const handleSubmit = (event) => {
        event.preventDefault();
        const appointmentID = props.currentApptId ? props.currentApptId : uuid();
        const appointmentData = {[appointmentID]: {
            name: name,
            dateOfBirth: dateOfBirth,
            gender: gender,
            phone: phone,
            address: address,
            doctor: doctor,
            purpose: purpose,
            painLevel: painLevel,
            urgencyLevel: urgencyLevel,
            symptoms: symptoms
        }};
        if (Object.values(appointmentData[appointmentID]).some((value) => (value === "" || value === undefined))) {
            alert('One or more of the fields are empty. Please check your response and resubmit.')
            return;
        }
        if (name===userData.name && dateOfBirth===userData.dateOfBirth) {
            if(!userData.gender) {
                userData.gender = gender;
            }
            if(!userData.phone) {
                userData.phone = phone;
            }
            if(!userData.address) {
                userData.address = address;
            }
        }
        props.onCurrentApptChange(appointmentID,appointmentData);
        localStorage.setItem(props.userName,JSON.stringify(userData));
        navigate('/scheduler')
    }

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
                    <select name="gender" id="gender" defaultValue={gender} onChange={(e) => setGender(e.target.value)}>
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
                    <DoctorsInput setDoctor={(value) => setDoctor(value)} doctor={doctor}/>
                </div>
                <div id="postAuth" className="formItem">
                    <label for="purpose">What's the purpose of the appointment?</label>
                    <select name="purpose" id="purpose" defaultValue={purpose} onChange={(e) => setPurpose(e.target.value)}>
                        <option></option>
                        <option value="Regular Check-up">Regular Check-up</option>
                        <option value="Follow-up Appointment">Follow-up Appointment</option>
                        <option value="Consultation">Consultation</option>
                        <option value="Urgent Treatment">Urgent Treatment</option>
                        <option value="Non-urgent Treatment">Non-urgent Treatment</option>
                        <option value="Testing/Diagnosis">Testing/Diagnosis</option>
                    </select>
                </div>
                <div id="postAuth" className="formItem">
                    <label for="pain">How would you rate your pain on a scale of 1-10?</label>
                    <input type="number" name="pain" id="pain" min="1" max="10"  defaultValue={painLevel} onChange={(e) => setPainLevel(e.target.value)}/>
                </div>
                <div id="postAuth" className="formItem">
                    <label for="urgency">How would you rate the urgency of your appointment on a scale of 1-10?</label>
                    <input type="number" name="urgency" id="urgency" min="1" max="10" defaultValue={urgencyLevel} onChange={(e) => setUrgencyLevel(e.target.value)}/>
                </div>
                <div id="postAuth" className="formItem">
                    <label for="symptoms">What are your symptoms?</label>
                    <input type="text" name="symptoms" id="symptoms" defaultValue={symptoms} onChange={(e) => setSymptoms(e.target.value)}/>
                </div>
            </form>
            <nav>
                <button onClick={() => {props.onCurrentApptChange(null,null); navigate(-1)}} type="button" className="danger"><span>Back</span></button>
                <button type="submit" onClick={handleSubmit} className="primary"><FontAwesomeIcon icon={faArrowRight} className="fontAwesome" /></button>
            </nav>
        </div>
    )
}