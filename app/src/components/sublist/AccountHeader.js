import React from 'react';
import PropTypes from 'prop-types';
import Blockie from '../Blockie';
import { Col, Row } from 'react-bootstrap';

const AccountHeader = props => {
    return (
            <Row>
                <Col xs="2" sm="1">
                    <Blockie account={props.account} />
                </Col>
                <Col>
                    <h5 className="text-dark">{props.account.slice(0, 14) + "..."}</h5>
                    <p className="text-secondary">
                        {props.submissions.length} Predictions ({props.revelations.length} Revealed)
                    </p>
                </Col>
            </Row>
    );
}

AccountHeader.propTypes = {
    account: PropTypes.string.isRequired,
    submissions: PropTypes.array.isRequired,
    revelations: PropTypes.array.isRequired,
}

export default AccountHeader
