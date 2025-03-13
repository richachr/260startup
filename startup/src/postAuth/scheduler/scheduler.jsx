import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

function determineSchedulingClass(apptData) {
    const pain = +Object.values(apptData)[0].painLevel;
    const urgency = +Object.values(apptData)[0].urgencyLevel;
    const seriousness = Object.values(apptData)[0].seriousness;
    return Math.ceil((pain+urgency+seriousness)/3);
}

function getChatgptResponse(apptData) {
    Object.values(apptData)[0].diagnosis = "Needs medical care."
    Object.values(apptData)[0].seriousness = 5
    return apptData;
}

function* timeGenerator(suggestedDate) {
    suggestedDate.setSeconds(0);
    while(true) {
        if(suggestedDate.getHours() > 16) {
            suggestedDate.setHours(9);
            suggestedDate.setDate((suggestedDate.getDate()+1));
        } else if(suggestedDate.getHours() < 9) {
            suggestedDate.setHours(9);
        }
        if(!(1<=suggestedDate.getDay() && suggestedDate.getDay()<=5)) {
            suggestedDate.setDate((suggestedDate.getDate()+1));
        }
        if(1<=suggestedDate.getMinutes() && suggestedDate.getMinutes()<=29) {
            suggestedDate.setMinutes(30);
        } else if(31<=suggestedDate.getMinutes() && suggestedDate.getMinutes()<=59) {
            suggestedDate.setMinutes(60);
        }
        yield new Date(suggestedDate);
        suggestedDate.setMinutes((suggestedDate.getMinutes()+30));
    }
}

function TimesAvailable({onTimeSelect,schedulingClass}) {
    const classDateBindings = {10: 0, 9: 1, 8: 2, 7:3, 6:5, 5:7, 4:14, 3:30, 2:60, 1:180}
    const currentDay = new Date();
    const suggestedDate = new Date();
    suggestedDate.setDate((currentDay.getDate() + classDateBindings[schedulingClass]));
    const generator = React.useRef(timeGenerator(suggestedDate));
    const [apptOptions, setApptOptions] = React.useState([generator.current.next().value,generator.current.next().value,generator.current.next().value]);
    return (
        <fieldset className="fieldset" onChange={(e) =>onTimeSelect(e.target.value)}>
            {apptOptions.map((value,index) => { return(
                <div className="formItem" key={index}>
                    <label for={index}><input type="radio" name="apptTime" id={index} value={value.toString()} />{value.toLocaleString()}</label>
                </div>
            )})}
            <div className="actions">
                <button type="button" onClick={() => {setApptOptions([generator.current.next().value,generator.current.next().value,generator.current.next().value])}} className="secondary"><span>Show more times</span></button>
            </div>
        </fieldset>
    )
}

// props: userName={userName} currentApptId={currentApptId} currentApptData={currentApptData}
export function Scheduler(props) {
    const navigate = useNavigate();
    const [selectedTime, setSelectedTime] = React.useState();
    let apptData = getChatgptResponse(props.currentApptData);
    const localSchedulingClass = determineSchedulingClass(apptData);
    Object.values(apptData)[0].schedulingClass = localSchedulingClass;
    const handleSubmit = (event) => {
        Object.values(apptData)[0].time = selectedTime
        let cloudData = JSON.parse(localStorage.getItem(props.userName));
        let doctorCloudData = JSON.parse(localStorage.getItem(Object.values(apptData)[0].doctor));
        cloudData.appointments.push(apptData);
        doctorCloudData.appointments.push(apptData);
        localStorage.setItem(props.userName,JSON.stringify(cloudData));
        localStorage.setItem(Object.values(apptData)[0].doctor,JSON.stringify(doctorCloudData));
        props.onCurrentApptChange(null,null);
        navigate('/appointments');
    }
    return (
        <div className="mainContent" id="postAuth">
            <img id="postAuth" src="papers.png" alt="Person doing paperwork" />
            <h1>Let's talk time.</h1>
            <h3>How do these appointment times sound?</h3>
            <TimesAvailable onTimeSelect={(time) => setSelectedTime(time)}schedulingClass={localSchedulingClass} />
            <nav>
                <button onClick={()=>navigate(-1)} type="button" className="danger"><span>Back</span></button>
                <button onClick={handleSubmit} type="button" className="primary"><FontAwesomeIcon icon={faArrowRight} className="fontAwesome" /></button>
            </nav>
        </div>
    )
}
        