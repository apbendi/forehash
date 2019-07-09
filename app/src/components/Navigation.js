import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Navbar, NavItem, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Navigation = props => {
    let predictionsLink = "/" + props.account;

    return (
        <Navbar bg="light">
            <Navbar.Brand href="/">Bankshot</Navbar.Brand>
            <Nav.Link href="/activity">Activity</Nav.Link>
            <Nav.Link href="/new">New</Nav.Link>
            <Nav.Link href={predictionsLink}>My Predictions</Nav.Link>
        </Navbar>
    );
}

Navigation.propTypes = {
    account: PropTypes.string.isRequired,
}

export default Navigation
