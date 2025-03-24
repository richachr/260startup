import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarPlus, faFileLines, faTrashCan } from "@fortawesome/free-regular-svg-icons";

async function fetchAppointments() {
    const response = await fetch('/api/data/get', {
        method: 'POST',
        body: JSON.stringify({"key": "appointments"}),
        headers: {
            "Content-type": 'application/json' // May need UTF-8 Encoding.
        }
    });
    if(!response?.ok) {
        const errorData = await response.json();
        alert(errorData.error);
        return;
    }
    const responseData = await response.json();
    return responseData.appointments;
}

function AppointmentsBlock(props) {
    return (
        <div className="appointments">
            {(!(props.appointments.length === 0)) ? props.appointments.map((value) => {
                return <Appointment data={value} key={Object.keys(value)[0]} userName={props.userName} doctors={props.doctors} onAppointmentsChange={props.onAppointmentsChange} />;
            }) : <div className="appointment"><h4>No appointments found.</h4></div>}
        </div>
    )
}

function showInfo(id) {
    const parent = document.getElementById(id);
    const target = parent.querySelector('.additionalApptInfo');
    if (target.style.height === '0px') {
        target.style.height = '100%'
        target.style.width = '100%';
        return;
    } else {
        target.style.height = '0px';
        target.style.width = '0px';
        return;
    }
}

async function deleteAppointment(id,doctor,setAppointments) {
    const response = await fetch('/api/appointments/delete', {
        method: 'DELETE',
        body: JSON.stringify({
            "id": id,
            "doctor": doctor
        }),
        headers: {
            "Content-type": 'application/json'
        }
    })
    const responseData = await response.json();
    setAppointments(responseData.updatedAppointments);
}

function Appointment({data, userName, doctors, onAppointmentsChange}) {
    const apptInfo = Object.values(data)[0];
    const idValue = Object.keys(data)[0];
    const doctorInfo = doctors.find((item) => {item.email == apptInfo.doctor});
    
    return (
        <div className="appointment" id={idValue}>
            <div className="denseInfoContainer">
                <span>{apptInfo.doctor===userName ? apptInfo.name : doctorInfo.name}</span>
                <span>{apptInfo.time ? new Date(apptInfo.time).toLocaleString("en-US",{timeZone: "America/Denver", dateStyle: "long", timeStyle: "short"}) : "Unscheduled"}</span>
                <div className="additionalApptInfo" style={{width: 0, height: 0}}>
                    <p>Patient Name: {apptInfo.name}</p>
                    <p>Date of Birth: {apptInfo.dateOfBirth}</p>
                    <p>Gender: {apptInfo.gender}</p>
                    <p>Phone Number: {apptInfo.phone}</p>
                    <p>Address: {apptInfo.address}</p>
                    <p>Purpose: {apptInfo.purpose}</p>
                    <p>Pain (1-10): {apptInfo.painLevel}</p>
                    <p>Urgency (1-10): {apptInfo.urgencyLevel}</p>
                    <p>Symptoms: {apptInfo.symptoms}</p>
                    <p>Inferred Diagnosis: {apptInfo.diagnosis ? apptInfo.diagnosis : "None"}</p>
                    <p>Seriousness: {apptInfo.seriousness ? apptInfo.seriousness : "Uncalculated"}</p>
                    <p>Scheduling Class: {apptInfo.schedulingClass ? apptInfo.schedulingClass : "Uncalculated"}</p>
                </div>
            </div>
            <div className="apptActions">
                <button className="secondary" onClick={() => showInfo(idValue)}><FontAwesomeIcon icon={faFileLines} className="fontAwesome" /></button>
                <button className="danger" onClick={() => deleteAppointment(idValue,apptInfo.doctor,onAppointmentsChange)}><FontAwesomeIcon icon={faTrashCan} className="fontAwesome" /></button>
            </div>
        </div>
    )
}

export function Appointments(props) {
    const [appointments, setAppointments] = React.useState([]);
    const [doctors,setDoctors] = React.useState({});
    useEffect(() => {
        const fetchData = async () => {
            const newAppointments = await fetchAppointments();
            if (JSON.stringify(newAppointments) !== JSON.stringify(appointments)) {
                setAppointments(newAppointments);
            }
        };
        const fetchDoctors = async () => {
            const response = await fetch('/api/doctors',{method: "GET"});
            const responseData = await response.json();
            setDoctors(responseData);
        }
        fetchData();
        fetchDoctors();
    },[appointments]);

    return (
        <div className="mainContent" id="postAuth">
            <img id="postAuth" src="docs-together.png" alt="Doctors" />
            <h1>Your Appointments</h1>
            <div className="actions">
                <NavLink to="/create-appointment"><button className="primary"><FontAwesomeIcon icon={faCalendarPlus} className="fontAwesome" /><span>New</span></button></NavLink>
            </div>
            <AppointmentsBlock userName={props.userName} appointments={appointments} doctors={doctors} onAppointmentsChange={(newAppointments) => setAppointments(newAppointments)} />
        </div>
    );
}