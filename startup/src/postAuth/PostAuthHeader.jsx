import React from 'react';
import {NavLink, Outlet} from 'react-router-dom';
import './welcome/welcome.css';

export default function PreAuthHeader() {
    return (
        <div className="reactContent">
            <header>
                <div className="leftContent">
                    <NavLink to="/" className="logo"><img src="RapptLogo.png" alt="Logo" className="logo" /><h2 className="logo">Rappt</h2></NavLink>
                </div>
                <div className="rightContent">
                    <nav>
                        <NavLink to="login"><button type="button" className="primary"><span>Login</span></button></NavLink>
                        <NavLink to="create-account"><button type="button" className="secondary"><span>Create Account</span></button></NavLink>
                    </nav>
                </div>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}