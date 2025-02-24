import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { faCalendarPlus, faFileLines, faPenToSquare } from "@fortawesome/free-regular-svg-icons";

function exportAppointments(userName) {
    const userData = JSON.parse(localStorage.getItem(userName));
    const appointmentText = JSON.stringify(userData.appointments);
    const file = new Blob([appointmentText], {type: 'text/plain'});
    const tempLink = document.createElement('a');
    tempLink.href = URL.createObjectURL(file);
    tempLink.download = 'Rappt Appointments.txt';
    document.body.appendChild(tempLink);
    tempLink.click();
    tempLink.remove();
}

export function Appointments(props) {
    return (
        <div className="mainContent" id="postAuth">
            <img id="postAuth" src="docs-together.png" alt="Doctors" />
            <h1>Your Appointments</h1>
            <div className="actions">
                <NavLink to="/create-appointment"><button className="primary"><FontAwesomeIcon icon={faCalendarPlus} className="fontAwesome" /><span>New</span></button></NavLink>
                <button className="secondary" onClick={exportAppointments(props.userName)}><FontAwesomeIcon icon={faArrowUpRightFromSquare} className="fontAwesome" /><span>Export</span></button>
            </div>
            <div className="appointments">
                <div className="appointment">
                    <span>Andrew Smithfield</span>
                    <span>3:00pm, February 5th, 2025</span>
                    <div className="additionalApptInfo">
                        <p>Patient Name: James Haskell</p>
                        <p>Date of Birth: 04/01/2000</p>
                        <p>Gender: Male</p>
                        <p>Phone Number: 385-555-3099</p>
                        <p>Address: 3445 Cougar Rd., Provo, Utah, 84606</p>
                        <p>Email: segfault@gmail.com</p>
                        <p>Purpose: Illness</p>
                        <p>Pain (1-10): 4</p>
                        <p>Urgency (1-10): 5</p>
                        <p>Symptoms: Fever, Vomiting</p>
                        <p>Deception Margin: 0</p>
                        <p>Inferred Diagnosis: Seasonal Flu</p>
                        <p>Seriousness: 6</p>
                        <p>Scheduling Class: 3</p>
                    </div>
                    <div className="apptActions">
                        <button className="secondary" onClick="showInfo()"><FontAwesomeIcon icon={faFileLines} className="fontAwesome" /></button>
                        <button className="primary" onClick="editAppt()"><FontAwesomeIcon icon={faPenToSquare} className="fontAwesome" /></button>
                    </div>
                </div>
                <div className="appointment">
                    <span>Sandra Martinez</span>
                    <span>12:05pm, February 25th, 2025</span>
                    <div className="additionalApptInfo">
                        <p>Patient Name: Alexi Haskell</p>
                        <p>Date of Birth: 08/15/2019</p>
                        <p>Gender: Female</p>
                        <p>Phone Number: 385-555-3099</p>
                        <p>Address: 3445 Cougar Rd., Provo, Utah, 84606</p>
                        <p>Email: segfault@gmail.com</p>
                        <p>Purpose: Check-Up</p>
                        <p>Pain (1-10): 1</p>
                        <p>Urgency (1-10): 1</p>
                        <p>Symptoms: None</p>
                        <div className="hiddenItems">
                            <p>Deception Margin: 0</p>
                            <p>Inferred Diagnosis: None</p>
                            <p>Seriousness: 1</p>
                            <p>Scheduling Class: 7</p>
                        </div>
                    </div>
                    <div className="apptActions">
                        <button className="secondary" onClick="showInfo()"><FontAwesomeIcon icon={faFileLines} className="fontAwesome" /></button>
                        <button className="primary" onClick="editAppt()"><FontAwesomeIcon icon={faPenToSquare} className="fontAwesome" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}