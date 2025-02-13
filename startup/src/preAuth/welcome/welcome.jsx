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

export function Welcome() {
    return (
    <div className="mainRightContent">
        <p>RAPPT is a smart appointment scheduler which will help you find appointments at times that work for you, and make sure you're not stuck waiting for months for an urgent appointment.</p>
        <nav>
            <NavLink to="login"><button type="button" class="primary"><span>Login</span></button></NavLink>
            <NavLink to="create-account"><button type="button" class="secondary"><span>Create Account</span></button></NavLink>
        </nav>
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

export function CreateAccount() {
    return (
        <div className="mainRightContent">
            <form action="">
                <div className="formItem">
                    <label for="email">Email:</label>
                    <input type="email" name="email" id="email" placeholder="jane@example.net" />
                </div>
                <div className="formItem">
                    <label for="pw">Password:</label>
                    <input type="password" name="pw" id="pw" />
                </div>
                <div className="formItem">
                    <label for="confirmPw">Confirm Password:</label>
                    <input type="password" name="confirmPw" id="confirmPw" />
                </div>
                <div className="formItem">
                    <label for="full-name">Full Name:</label>
                    <input type="text" name="full-name" id="full-name" placeholder="Alex Smith" />
                </div>
                <div className="formItem">
                    <label for="dob">Date of Birth:</label>
                    <input type="date" name="dob" id="dob" placeholder="01-01-1970" />
                </div> 
                <NavLink to="appointments"><button type="submit" className="primary"><span>Create</span></button></NavLink>
            </form>
        </div>
    )
}