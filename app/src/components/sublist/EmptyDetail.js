import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EmptyDetail = _props => {
    return (
        <Card className="">
            <Card.Body>
                <big>Select an existing prediction or <Link to="/new">add a new one</Link>.</big>
            </Card.Body>
        </Card>
    );
}

export default EmptyDetail
