import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

// Next issue: this doesn't update when the account changes

const Navigation = props => {
    let predictionsLink = "/" + props.account;

    return (
        <nav className="navbar fixed-top navbar-light bg-light">
            <ul className="navbar-nav">
                <li className="nav-item"><NavLink to={predictionsLink}>My Predictions</NavLink></li>
                <li className="nav-item"><NavLink to="/new">New</NavLink></li>
            </ul>
        </nav>
    );
}

Navigation.propTypes = {
    account: PropTypes.string.isRequired,
}

export default Navigation
