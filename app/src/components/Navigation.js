import React from 'react';
import PropTypes from 'prop-types';
import { Navbar, Nav } from 'react-bootstrap';
import logo from '../full-text-logo.png';

const Navigation = props => {
    let predictionsLink = props.account ? "/" + props.account : "/";

    return (
        <Navbar bg="light" expand="md">
            <Navbar.Brand href="/">
                <img src={logo}
                        height="30"
                        className="d-inline-block align-top"
                        alt="Forehash Logo" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse>
                <Nav className="mr-auto">
                    <Nav.Link href="/activity" className="text-primary">Activity</Nav.Link>
                    <Nav.Link href="/new" className="text-primary">New</Nav.Link>
                    <Nav.Link href={predictionsLink} className="text-primary">My Predictions</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

Navigation.propTypes = {
    account: PropTypes.string,
}

export default Navigation
