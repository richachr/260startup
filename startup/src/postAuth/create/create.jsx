import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuid } from "uuid";

function DoctorsInput(props) {
    const [doctors, setDoctors] = React.useState({});
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch('/api/doctors', {method: "GET"});
                const body = await response.json();
                setDoctors(body);
            }
            catch (err) {
                alert(err.error);
            }
        }
        fetchDoctors();
    },[]);

    return (
        <select name="doctor" id="doctor" value={props.doctor} onChange={(e) => props.setDoctor(e.target.value)}>
            <option></option>
            {doctors.map((item) => {
                return <option key={item.email} value={item.email}>{`Dr. ${item.name}`}</option>
            })}
        </select>
    )
}

export function CreateAppointment(props) {
    const navigate = useNavigate();
    const savedData = props.currentApptData ? Object.values(props.currentApptData)[0] : {};
    const [userData, setUserData] = React.useState({name: "", dateOfBirth: null})
    const [name,setName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [gender, setGender] = useState(null);
    const [phone, setPhone] = useState(null);
    const [address, setAddress] = useState(null);
    const [doctor, setDoctor] = useState(null);
    const [purpose, setPurpose] = useState(null);
    const [painLevel, setPainLevel] = useState(null);
    const [urgencyLevel, setUrgencyLevel] = useState(null);
    const [symptoms, setSymptoms] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await fetch('/api/data/get/all', {method: "GET"});
            const body = await response.json();
            setUserData(body);
        }
        fetchUserData();
    },[])

    useEffect(() => {
        setName(savedData.name || userData.name || "");
        setDateOfBirth(savedData.dateOfBirth || userData.dateOfBirth || "");
        setGender(savedData.gender || userData.gender || "");
        setPhone(savedData.phone || userData.phone || "");
        setAddress(savedData.address || userData.address || "");
        setDoctor(savedData.doctor || "");
        setPurpose(savedData.purpose || "");
        setPainLevel(savedData.painLevel || "");
        setUrgencyLevel(savedData.urgencyLevel || "");
        setSymptoms(savedData.symptoms || "");
    },[userData])

    const handleSubmit = async (event) => {
        event.preventDefault();
        const appointmentID = props.currentApptId ? props.currentApptId : uuid();
        const appointmentData = {
            name: name,
            patientEmail: props.userName,
            dateOfBirth: dateOfBirth,
            gender: gender,
            phone: phone,
            address: address,
            doctor: doctor,
            purpose: purpose,
            painLevel: painLevel,
            urgencyLevel: urgencyLevel,
            symptoms: symptoms
        };
        const response = await fetch('/api/appointments/create', {
            method: "POST",
            body: JSON.stringify({
                'appointmentID': appointmentID,
                'appointmentData': appointmentData
            }),
            headers: {
                "Content-type": 'application/json'
            }
        });
        const json = await response.json();
        props.onCurrentApptChange(appointmentID,json.apptData); 
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
                    <input type="text" name="patientName" id="patientName" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div id="postAuth" className="formItem">
                    <label for="dob">What's the patient's date of birth?</label>
                    <input type="date" name="dob" id="dob" placeholder="1/1/1970" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                </div>
                <div id="postAuth" className="formItem">
                    <label for="gender">What's the patient's gender?</label>
                    <select name="gender" id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option></option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                    </select>
                </div>
                <div id="postAuth" className="formItem">
                    <label for="phone">What's the best phone number for contacting the patient?</label>
                    <input type="tel" name="phone" id="phone" placeholder="(801) 555-2039" value={phone} onChange={(e) => setPhone(e.target.value)}/>
                </div>
                <div id="postAuth" className="formItem">
                    <label for="address">What's the patient's address?</label>
                    <input type="text" name="address" id="address" value={address} onChange={(e) => setAddress(e.target.value)}/>
                </div>
                <div id="postAuth" className="formItem">
                    <label for="doctor">Which doctor are you looking to see?</label>
                    <DoctorsInput setDoctor={(value) => setDoctor(value)} doctor={doctor}/>
                </div>
                <div id="postAuth" className="formItem">
                    <label for="purpose">What's the purpose of the appointment?</label>
                    <select name="purpose" id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
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
                    <input type="number" name="pain" id="pain" min="1" max="10"  value={painLevel} onChange={(e) => setPainLevel(e.target.value)}/>
                </div>
                <div id="postAuth" className="formItem">
                    <label for="urgency">How would you rate the urgency of your appointment on a scale of 1-10?</label>
                    <input type="number" name="urgency" id="urgency" min="1" max="10" value={urgencyLevel} onChange={(e) => setUrgencyLevel(e.target.value)}/>
                </div>
                <div id="postAuth" className="formItem">
                    <label for="symptoms">What are your symptoms?</label>
                    <input type="text" name="symptoms" id="symptoms" value={symptoms} onChange={(e) => setSymptoms(e.target.value)}/>
                </div>
            </form>
            <nav>
                <button onClick={() => {props.onCurrentApptChange(null,null); navigate(-1)}} type="button" className="danger"><span>Back</span></button>
                <button type="submit" onClick={handleSubmit} className="primary"><FontAwesomeIcon icon={faArrowRight} className="fontAwesome" /></button>
            </nav>
        </div>
    )
}