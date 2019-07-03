import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EmptyDetail = props => {
    let linkText = props.isActiveAccount ? "submit a new one" : "submit your own";

    return (
        <Card className="">
            <Card.Body>
                <big>Select an past prediction or <Link to="/new">{linkText}</Link>.</big>
            </Card.Body>
        </Card>
    );
}

EmptyDetail.propTypes = {
    isActiveAccount: PropTypes.bool.isRequired,
}

export default EmptyDetail
