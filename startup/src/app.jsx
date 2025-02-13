import React, { useEffect } from 'react';
import './app.css';
import {Routes, Route, useNavigate} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub} from '@fortawesome/free-brands-svg-icons'

import PreAuthHeader from './preAuth/PreAuthHeader';
import {Homepage, Welcome, Login, CreateAccount} from './preAuth/welcome/welcome'

export default function App() {
    return (
        <div className="body">
            <Routes>
                <Route element={<PreAuthHeader />}>
                    <Route path='/' element={<Homepage />} exact>
                        <Route index element={<Welcome />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/create-account' element={<CreateAccount />} />
                    </Route>
                    <Route path='/not-found' element={<NotFound />} />
                </Route>
                {/* <Route element={<PostAuthHeader />}>
                    <Route path='/appointments' element={<Appointments />} />
                    <Route path='/create-appointment' element={<CreateAppointment />} />
                    <Route path='/scheduler' element={<Scheduler />} />
                </Route> */}
                <Route path='*' element={<ToNotFound />} />
            </Routes>
            <footer>
                <h4>Created by Christian Richardson</h4>
                <a href="https://github.com/richachr/260startup"><FontAwesomeIcon icon={faGithub} className='fontAwesome' /><span>GitHub</span></a>
            </footer>
        </div>
    )
}

function ToNotFound() {
    const navigate = useNavigate();
    useEffect(() => {navigate('/not-found');}, [navigate]);
}

function NotFound() {
    return (
        <div className="mainContent" style={{justifyContent: 'space-evenly'}}><h1 style={{fontSize: '2em'}}>Oops! We can't find this page... Error 404.</h1><img style={{width: '200px'}} src="./confused-404.png" alt="Confused person looking at phone." /></div>
    )
}