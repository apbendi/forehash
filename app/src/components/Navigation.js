import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navigation() {
    return (
        <nav className="navbar navbar-default navbar-fixed-top">
            <div className="container-fluid">
                <ul className="nav navbar-nav">
                    <li><NavLink to="/">Predictions</NavLink></li>
                    <li><NavLink to="/new">New</NavLink></li>
                </ul>
            </div>
        </nav>
    );
}
