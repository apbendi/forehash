import React from 'react';
import { Navbar } from 'react-bootstrap';
import { GoPerson, GoMarkGithub } from 'react-icons/go';
import { FaCopyright } from 'react-icons/fa';

const Footer = _props => {
    return (
        <Navbar bg="light" fixed="bottom">
            <p className="text-muted">
                <GoPerson /> <span style={{fontSize: ".8em"}}>Built for fun by <a href="https://twitter.com/bendifrancesco" target="blank">@BenDiFrancesco</a></span><br />
                <GoMarkGithub /> <span style={{fontSize: ".8em"}}>Code availble on <a href="https://github.com/apbendi/bankshot" target="blank">GitHub</a></span><br />
                <FaCopyright /> <span style={{fontSize: ".8em"}}>2019 All Rights Reserved </span><br />
            </p>
        </Navbar>
    )
}

export default Footer
