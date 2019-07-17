import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';

const Blockie = props => {

    return (
        <Image src={"https://eth.vanity.show/" + props.account}
                alt={"Identicon of ether address" + props.account}
                roundedCircle />
    );
}

Blockie.propTypes = {
    account: PropTypes.string.isRequired,
}

export default Blockie
