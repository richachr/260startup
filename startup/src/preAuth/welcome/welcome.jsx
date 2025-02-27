import React from "react";
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import bcrypt from "bcryptjs";

export function Homepage() {
    return (
        <div className="mainContent" id="preAuth">
            <div className="mainLeftContent">
                <img src="doc-patient.png" alt="Doctor Image" />
                <h1>Hello there!</h1>
                <h3>Let's get started with RAPPT.</h3>
            </div>
            <Outlet />
        </div>
    )
}

export function Welcome() {
    return (
        <div className="mainRightContent">
            <p>RAPPT is a smart appointment scheduler which will help you find appointments at times that work for you, and make sure you're not stuck waiting for months for an urgent appointment.</p>
            <nav>
                <NavLink to="/login"><button type="button" className="primary"><span>Login</span></button></NavLink>
                <NavLink to="/create-account"><button type="button" className="secondary"><span>Create Account</span></button></NavLink>
            </nav>
        </div>
    )
}

export function Login(props) {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!localStorage.getItem(email)) {
            alert('No account found with the associated email. Please create an account.');
            navigate('/create-account');
            return;
        }
        let hash = JSON.parse(localStorage.getItem(email)).hashedPassword;
        if (await bcrypt.compare(password, hash)) {
            let name = JSON.parse(localStorage.getItem(email)).name;
            props.onLoginChange(true, email, name);
            navigate('/appointments');
        } else {
            alert('Password incorrect.');
            return;
        }
    }
    return (
        <div className="mainRightContent">
            <form action="" method="post">
                <div className="formItem">
                    <label for="email">Email:</label>
                    <input type="email" pattern=".+@.+\.[a-zA-z]{2,}$" name="email" id="email" placeholder="jane@example.net" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="formItem">
                    <label for="pw">Password:</label>
                    <input type="password" name="pw" id="pw" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <NavLink to="/appointments"><button type="submit" className="secondary" onClick={handleSubmit}><FontAwesomeIcon icon={faArrowRight} className='fontAwesome' /></button></NavLink>
            </form>
        </div>
    )
}

export function CreateAccount(props) {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [checkPassword, setCheck] = React.useState("");
    const [name, setName] = React.useState("");
    const [doctorStatus, setDoctorStatus] = React.useState(false);
    const [dateOfBirth, setDOB] = React.useState(new Date());
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== checkPassword) {
            alert(`Your passwords don't match. Please try again.`);
            return;
        }
        if ([name, email, dateOfBirth, password].some((value) => value === "")) {
            alert(`One or more fields are empty. Please fill them in and resubmit.`);
            return;
        }
        if (localStorage.getItem(email)) {alert('That account already exists.'); return;}
        if (doctorStatus) {
            let currentDoctors = localStorage.getItem("doctors") ? JSON.parse(localStorage.getItem("doctors")) : {}
            currentDoctors[email] = name;
            localStorage.setItem("doctors",JSON.stringify(currentDoctors));
        }
        try {
            const hash = await bcrypt.hash(password, 10);
            localStorage.setItem(email, JSON.stringify({ "name": name, "email": email, "dateOfBirth": dateOfBirth, "hashedPassword": hash, "appointments": [] }));
        } catch (err) {
            console.error(`Error: ${err}`);
        }
        if (!(localStorage.getItem(email))) {
            localStorage.setItem(email, JSON.stringify({ "name": name }));
        }
        props.onLoginChange(true, email, name)
        navigate("/appointments");
    }

    return (
        <div className="mainRightContent">
            <form>
                <div className="formItem">
                    <label for="email">Email:</label>
                    <input type="email" pattern=".+@.+\.[a-zA-z]{2,}$" name="email" id="email" placeholder="jane@example.net" onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="formItem">
                    <label for="pw">Password:</label>
                    <input type="password" name="pw" id="pw" autoComplete="new-password" onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="formItem">
                    <label for="confirmPw">Confirm Password:</label>
                    <input type="password" name="confirmPw" id="confirmPw" autoComplete="current-password" onChange={(e) => setCheck(e.target.value)} required />
                </div>
                <div className="formItem">
                    <label for="full-name">Full Name:</label>
                    <input type="text" name="full-name" id="full-name" placeholder="Alex Smith" onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="formItem">
                    <label for="dob">Date of Birth:</label>
                    <input type="date" name="dob" id="dob" placeholder="01-01-1970" onChange={(e) => setDOB(e.target.value)} required />
                </div>
                <div className="formItem">
                    <label for="doctorStatus" style={{textAlign: "center"}}><span>Check if you are a doctor: </span><input type="checkbox" name="doctorStatus" id="doctorStatus" value={true} onChange={(e) => setDoctorStatus(e.target.value)} /></label>
                </div>
                <button type="submit" className="primary" onClick={handleSubmit}><span>Create</span></button>
            </form>
        </div>
    )
}