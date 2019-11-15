import React, { Component } from 'react'
import PropTypes from 'prop-types';
import makeBlockie from 'ethereum-blockies-base64';
import { Image } from 'react-bootstrap';

class Blockie extends Component {
    constructor(props) {
        super(props);

        this.state = {
            blockieData: makeBlockie(props.account),
        };
    }

    render() {
        return (
            <Image src={this.state.blockieData}
                alt={"Identicon of ether address" + this.props.account}
                fluid
                roundedCircle />
        );
    }
}

Blockie.propTypes = {
    account: PropTypes.string.isRequired,
}

export default Blockie
