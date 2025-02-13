import React from "react";
import {NavLink} from 'react-router-dom';

export function Homepage() {
    return (
        <div className="mainLeftContent">
                <img src="doc-patient.png" alt="Doctor Image" />
                <h1>Hello there!</h1>
                <h3>Let's get started with RAPPT.</h3>
        </div>
    )
}

export function Login() {
    return (
        <div className="mainRightContent">
            <form action="" method="post">
                <div className="formItem">
                    <label for="email">Email:</label>
                    <input type="email" name="email" id="email" placeholder="jane@example.net" />
                </div>
                <div className="formItem">
                    <label for="pw">Password:</label>
                    <input type="password" name="pw" id="pw" />
                </div>
                <NavLink to="appointments"><button type="button" className="secondary"><i className="fa-solid fa-arrow-right"></i></button></NavLink>
            </form>
        </div>
    )
}