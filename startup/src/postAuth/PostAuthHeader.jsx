import React from 'react';
import {NavLink, Outlet} from 'react-router-dom';
import './after_login.css';

export default function PostAuthHeader() {
    return (
        <div className="reactContent">
            <header>
                <div className="leftContent">
                    <NavLink to="/" className="logo"><img src="RapptLogo.png" alt="Logo" className="logo" /><h2 className="logo">Rappt</h2></NavLink>
                </div>
                <div className="rightContent">
                    <nav>
                        <button className="secondary"><i className="fa-regular fa-bell"></i>
                            <aside className="notifications">
                                <h5>Notifications</h5>
                                <table>
                                    <tr><td><span>Dr. Smithfield</span> <span>scheduled</span> an appointment for <span>James Haskell</span> on <span>February 25th, 2025</span>.</td></tr>
                                    <tr><td><span>Dr. Jenkins</span> <span>cancelled</span> an appointment for <span>Emily Haskell</span> on <span>March 14th, 2025</span>.</td></tr>
                                </table>
                            </aside>
                        </button>
                        <NavLink to='/'><button className="danger"><i className="fa-solid fa-arrow-right-from-bracket"></i></button></NavLink>
                    </nav>
                    <h5>Hey there, James!</h5>
                </div>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}