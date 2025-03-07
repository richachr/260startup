import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { faCalendarPlus, faCalendarXmark, faFileLines, faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";

function exportAppointments(userName) {
    const userData = JSON.parse(localStorage.getItem(userName));
    const appointmentText = JSON.stringify(userData.appointments ? userData.appointments : '');
    const file = new Blob([appointmentText], {type: 'text/plain'});
    const tempLink = document.createElement('a');
    tempLink.href = URL.createObjectURL(file);
    tempLink.download = 'Rappt Appointments.txt';
    document.body.appendChild(tempLink);
    tempLink.click();
    tempLink.remove();
}

function fetchAppointments(userName) {
    const userData = JSON.parse(localStorage.getItem(userName));
    return userData.appointments;
}

function AppointmentsBlock(props) {
    return (
        <div className="appointments">
            {(!(props.appointments.length === 0)) ? props.appointments.map((value) => {
                return <Appointment data={value} key={Object.keys(value)[0]} userName={props.userName} onAppointmentsChange={props.onAppointmentsChange} />;
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

function deleteAppointment(id,userName,doctor,setAppointments) {
    let userData = JSON.parse(localStorage.getItem(userName));
    let userAppointments = userData.appointments;
    let doctorData = JSON.parse(localStorage.getItem(doctor));
    let doctorAppointments = doctorData.appointments;
    console.log(userAppointments);
    console.log(doctorAppointments);
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
    console.log(newUserAppointments);
    console.log(newDoctorAppointments);
    setAppointments(newUserAppointments);
    userData.appointments = newUserAppointments;
    doctorData.appointments = newDoctorAppointments;
    localStorage.setItem(userName,JSON.stringify(userData));
    localStorage.setItem(doctor,JSON.stringify(doctorData));
    return;
}

function Appointment({data, userName, onAppointmentsChange}) {
    const apptInfo = Object.values(data)[0];
    const idValue = Object.keys(data)[0];
    
    return (
        <div className="appointment" id={idValue}>
            <div className="denseInfoContainer">
                <span>{apptInfo.doctor===userName ? apptInfo.name : JSON.parse(localStorage.getItem("doctors"))[apptInfo.doctor]}</span>
                <span>{apptInfo.time ? apptInfo.time : "Unscheduled"}</span>
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
                <button className="danger" onClick={() => deleteAppointment(idValue,userName,apptInfo.doctor,onAppointmentsChange)}><FontAwesomeIcon icon={faTrashCan} className="fontAwesome" /></button>
            </div>
        </div>
    )
}

export function Appointments(props) {
    const [appointments, setAppointments] = React.useState(fetchAppointments(props.userName));

    useEffect(() => {
        const newAppointments = fetchAppointments(props.userName);
        if (JSON.stringify(newAppointments) !== JSON.stringify(appointments)) {
            setAppointments(newAppointments);
        }
    },[props.userName,appointments]);
    return (
        <div className="mainContent" id="postAuth">
            <img id="postAuth" src="docs-together.png" alt="Doctors" />
            <h1>Your Appointments</h1>
            <div className="actions">
                <NavLink to="/create-appointment"><button className="primary"><FontAwesomeIcon icon={faCalendarPlus} className="fontAwesome" /><span>New</span></button></NavLink>
                <button className="secondary" onClick={() => exportAppointments(props.userName)}><FontAwesomeIcon icon={faArrowUpRightFromSquare} className="fontAwesome" /><span>Export</span></button>
            </div>
            <AppointmentsBlock userName={props.userName} appointments={appointments} onAppointmentsChange={(newAppointments) => setAppointments(newAppointments)} />
        </div>
    );
}