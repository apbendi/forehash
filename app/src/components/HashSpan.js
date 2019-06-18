import React from 'react';
import PropTypes from 'prop-types';

export default function HashSpan(props) {
    let hash = props.hash;
    let briefHash = hash.slice(0, 6) + "..." + hash.slice(-4);

    return (
        <span>
            <h5>{briefHash}</h5>
        </span>
    );
}

HashSpan.propTypes = {
    hash: PropTypes.string.isRequired,
}
