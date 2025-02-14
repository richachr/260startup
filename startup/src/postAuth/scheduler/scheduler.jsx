import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export function Scheduler() {
    const navigate = useNavigate();
    return (
        <div class="mainContent" id="postAuth">
            <img id="postAuth" src="papers.png" alt="Person doing paperwork" />
            <h1>Let's talk time.</h1>
            <h3>How do these appointment times sound?</h3>
            <fieldset class="fieldset">
                <div class="formItem">
                    <label for="1"><input type="radio" name="apptTime" id="1" value="1" />Monday, February 10th 11:00am</label>
                </div>
                <div class="formItem">
                    <label for="2"><input type="radio" name="apptTime" id="2" value="2" />Monday, February 10th 1:45pm</label>
                </div>
                <div class="formItem">
                    <label for="3"><input type="radio" name="apptTime" id="3" value="3" />Monday, February 10th 3:30pm</label>
                </div>
            </fieldset>
            <div class="actions">
                <button type="button" class="secondary"><span>Show more times for this day</span></button>
                <button type="button" class="secondary"><span>Show the next available day</span></button>
            </div>
            <nav>
                <button onClick={()=>navigate(-1)} type="button" class="danger"><span>Back</span></button>
                <NavLink to="/appointments"><button type="button" class="primary"><FontAwesomeIcon icon={faArrowRight} className="fontAwesome" /></button></NavLink>
            </nav>
        </div>
    )
}
        