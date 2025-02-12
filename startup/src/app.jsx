import React from 'react';
import './app.css';
import {Routes, Route, NavLink} from 'react-router-dom';

export default function App() {
    return (
        <div className="body">
            <header>
                <div class="leftContent">
                    <a href="index.html" class="logo"><img src="RapptLogo.png" alt="Logo" class="logo" /><h2 class="logo">Rappt</h2></a>
                </div>
                <div class="rightContent">
                    <nav>
                        <a href="tempLogin.html"><button type="button" class="primary"><span>Login</span></button></a>
                        <a href="tempCreate.html"><button type="button" class="secondary"><span>Create Account</span></button></a>
                    </nav>
                </div>
            </header>
            <main>
                <div class="mainContent">
                    <div class="mainLeftContent">
                        <img src="doc-patient.png" alt="Doctor Image" />
                        <h1>Hello there!</h1>
                        <h3>Let's get started with RAPPT.</h3>
                    </div>
                    <div class="mainRightContent">
                        <p>RAPPT is a smart appointment scheduler which will help you find appointments at times that work for you, and make sure you're not stuck waiting for months for an urgent appointment.</p>
                        <nav>
                            <a href="tempLogin.html"><button type="button" class="primary"><span>Login</span></button></a>
                            <a href="tempCreate.html"><button type="button" class="secondary"><span>Create Account</span></button></a>
                        </nav>
                    </div>
                </div>
            </main>
            <footer>
                <h4>Created by Christian Richardson</h4>
                <a href="https://github.com/richachr/260startup"><i class="fa-brands fa-github"></i><span>GitHub</span></a>
            </footer>
        </div>
    )
}