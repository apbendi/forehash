import React from 'react';
import PropTypes from 'prop-types';
import makeBlockie from 'ethereum-blockies-base64';
import { Image } from 'react-bootstrap';

const Blockie = props => {

    return (
        <Image src={makeBlockie(props.account)}
                alt={"Identicon of ether address" + props.account}
                fluid
                roundedCircle />
    );
}

Blockie.propTypes = {
    account: PropTypes.string.isRequired,
}

export default Blockie
