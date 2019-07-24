import React from 'react';
import PropTypes from 'prop-types';
import { Navbar, Nav } from 'react-bootstrap';
import logo from '../full-text-logo.png';

const Navigation = props => {
    let predictionsLink = props.account ? "/" + props.account : "/";

    return (
        <Navbar bg="light">
            <Navbar.Brand href="/">
                <img src={logo}
                        height="30"
                        className="d-inline-block align-top"
                        alt="Forehash Logo" />
            </Navbar.Brand>
            <Nav.Link href="/activity">Activity</Nav.Link>
            <Nav.Link href="/new">New</Nav.Link>
            <Nav.Link href={predictionsLink}>My Predictions</Nav.Link>
        </Navbar>
    );
}

Navigation.propTypes = {
    account: PropTypes.string,
}

export default Navigation
