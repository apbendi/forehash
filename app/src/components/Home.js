import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';

class Home extends Component {
    render() {
        let links = [
            "0x73cC3e91D67613d481cC9cfe11A1679901873656",
            "0x85faf44B62f01e1969921B66b4c5c4C49FC953Dc",
        ];

        return (
            <Container className="mt-3">
                <Link to={"/" + links[0]}>{links[0]}</Link><br />
                <Link to={"/" + links[1]}>{links[1]}</Link>
            </Container>
        );
    }
}

Home.propTypes = {

}

export default Home;
