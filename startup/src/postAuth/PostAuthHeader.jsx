import React, { useEffect } from 'react';
import {NavLink, Outlet, useNavigate} from 'react-router-dom';
import './after_login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { ErrorBoundary } from 'react-error-boundary';

export default function PostAuthHeader(props) {
    const navigate = useNavigate();
    useEffect(() => {
        if (!props.loginState) {
            navigate('/login');
        }
    },[]);
    return (
            <div className="reactContent">
                <header id='postAuth'>
                    <div className="leftContent">
                        <NavLink to="/" className="logo"><img src="RapptLogo.png" alt="Logo" className="logo" /><h2 className="logo">Rappt</h2></NavLink>
                    </div>
                    <div className="rightContent">
                        <nav>
                            <button className="secondary"><FontAwesomeIcon icon={faBell} className='fontAwesome' />
                                <aside className="notifications">
                                    <h5>Notifications</h5>
                                    <table>
                                        <tbody><tr><td><span>Dr. Smithfield</span> <span>scheduled</span> an appointment for <span>James Haskell</span> on <span>February 25th, 2025</span>.</td></tr>
                                        <tr><td><span>Dr. Jenkins</span> <span>cancelled</span> an appointment for <span>Emily Haskell</span> on <span>March 14th, 2025</span>.</td></tr></tbody>
                                    </table>
                                </aside>
                            </button>
                            <button className="danger" onClick={() => {props.onLoginChange(false,"",""); navigate('/')}}><FontAwesomeIcon icon={faArrowRightFromBracket} className='fontAwesome' /></button>
                            <h5>Hey there, {props.name}!</h5>
                        </nav>
                    </div>
                </header>
                <main>
                    <ErrorBoundary fallback={<div className='mainContent' id='postAuth'><h1>Something went wrong.</h1></div>} onReset={() => navigate('/')} onError={() => navigate('/')}>
                        <Outlet />
                    </ErrorBoundary>
                </main>
            </div>
    )
}