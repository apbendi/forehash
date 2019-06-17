import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navigation() {
    return (
        <nav className="navbar fixed-top navbar-light bg-light">
            <ul className="navbar-nav">
                <li className="nav-item"><NavLink to="/">Predictions</NavLink></li>
                <li className="nav-item"><NavLink to="/new">New</NavLink></li>
            </ul>
        </nav>
    );
}
