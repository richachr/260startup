import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

function TimesAvailable({onTimeSelect,schedulingClass}) {
    const [offset, setOffset] = React.useState(0);
    const [apptOptions, setApptOptions] = React.useState([]);
    useEffect(() => {
        const getTimes = async () => {
            setApptOptions(await getAppointmentTimes(schedulingClass,offset));
        }
        getTimes()
    },[schedulingClass,offset])
    return (
        <fieldset className="fieldset" onChange={(e) =>onTimeSelect(e.target.value)}>
            {apptOptions.map((value,index) => { return(
                <div className="formItem" key={index}>
                    <label for={index}><input type="radio" name="apptTime" id={index} value={value.toString()} />{value.toLocaleString()}</label>
                </div>
            )})}
            <div className="actions">
                <button type="button" onClick={() => {setOffset((prev) => prev+3);}} className="secondary"><span>Show more times</span></button>
            </div>
        </fieldset>
    )
}

async function updateApptData(currentApptId,currentApptData) {
    const response = await fetch('/api/appoointments/schedule/getSchedule',{
        method: "POST",
        body: JSON.stringify({
            'appointmentId': currentApptId,
            'appointmentData': currentApptData
        }),
        headers: {
            "Content-type": 'application/json'
        }
    })
    const responseData = await response.json();
    return responseData.data;
}

async function getAppointmentTimes(schedulingClass,offset) {
    const response = await fetch('/api/appointments/schedule/getTimes', {
        method: "POST",
        body: JSON.stringify({'offset': offset, 'schedulingClass': schedulingClass}),
        headers: {"Content-type": 'application/json'}
    })
    const responseData = await response.json();
    return responseData.times;
}

// props: userName={userName} currentApptId={currentApptId} currentApptData={currentApptData}
export function Scheduler(props) {
    const navigate = useNavigate();
    const [selectedTime, setSelectedTime] = React.useState();
    const [apptData, setApptData] = React.useState(props.apptData);
    const [localSchedulingClass, setLSC] = React.useState(apptData?.schedulingClass);
    useEffect(() => {
        const updateData = async () => {
            setApptData(await updateApptData(props.currentApptId,apptData));
            setLSC(apptData.schedulingClass);
        }
        updateData();
        
    },[])
    const handleSubmit = async (event) => {
        event.preventDefault();
        apptData.time = selectedTime;
        await fetch('/api/appoointments/schedule/setAppointment',{
            method: "POST",
            body: JSON.stringify({
                'appointmentId': props.currentApptId,
                'appointmentData': apptData
            }),
            headers: {
                "Content-type": 'application/json'
            }
        })
        props.onCurrentApptChange(null,null);
        navigate('/appointments');
    }
    return (
        <div className="mainContent" id="postAuth">
            <img id="postAuth" src="papers.png" alt="Person doing paperwork" />
            <h1>Let's talk time.</h1>
            <h3>How do these appointment times sound?</h3>
            <TimesAvailable onTimeSelect={(time) => setSelectedTime(time)} schedulingClass={localSchedulingClass} />
            <nav>
                <button onClick={()=>navigate(-1)} type="button" className="danger"><span>Back</span></button>
                <button onClick={handleSubmit} type="button" className="primary"><FontAwesomeIcon icon={faArrowRight} className="fontAwesome" /></button>
            </nav>
        </div>
    )
}
        