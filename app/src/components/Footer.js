import React from 'react';
import { Navbar } from 'react-bootstrap';
import { GoPerson, GoMarkGithub } from 'react-icons/go';
import { FaCopyright } from 'react-icons/fa';

const Footer = _props => {
    return (
        <Navbar bg="light" fixed="bottom">
            <p className="text-secondary">
                <GoPerson /> <span style={{fontSize: ".8em"}}>Built for fun by <a href="https://twitter.com/bendifrancesco" target="_blank" rel="noopener noreferrer">@BenDiFrancesco</a></span><br />
                <GoMarkGithub /> <span style={{fontSize: ".8em"}}>Code availble on <a href="https://github.com/apbendi/bankshot" target="_blank" rel="noopener noreferrer">GitHub</a></span><br />
                <FaCopyright /> <span style={{fontSize: ".8em"}}>2019 All Rights Reserved </span><br />
                <span className="text-muted" style={{fontSize: ".7em"}}>
                    Icon derivative from <a href="https://www.flaticon.com/authors/freepik" target="blank">freepik</a>
                    (<a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank" rel="noopener noreferrer">CC 3.0 BY</a>)
                </span>
            </p>
        </Navbar>
    )
}

export default Footer
