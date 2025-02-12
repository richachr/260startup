import React from 'react';
import './app.css';
import {Routes, Route, NavLink, Navigate} from 'react-router-dom';

export default function App() {
    return (
        <div className="body">
            <Routes>
                <Route element={<PreAuthHeader />}>
                    <Route path='/' element={<Homepage />} exact>
                        <Route index element={<Welcome />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/create-account' element={<CreateAccount />} />
                        <Route path='/not-found' element={<NotFound />} />
                    </Route>
                </Route>
                <Route element={<PostAuthHeader />}>
                    <Route path='/appointments' element={<Appointments />} />
                    <Route path='/create-appointment' element={<CreateAppointment />} />
                    <Route path='/scheduler' element={<Scheduler />} />
                </Route>
                <Route path='*' element={<ToNotFound />} />
            </Routes>
            <footer>
                <h4>Created by Christian Richardson</h4>
                <a href="https://github.com/richachr/260startup"><i className="fa-brands fa-github"></i><span>GitHub</span></a>
            </footer>
        </div>
    )
}

function ToNotFound() {
    const navigate = useNavigate();
    navigate('/not-found')
}