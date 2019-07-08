import React from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { PropTypes } from 'prop-types';

const EmptyScreen = props => {
    let article = props.isActiveAccount ? "Your" : "This";
    let buttonCopy = props.isActiveAccount ? "Publish First Prediction" : "Publish Your Own Prediction";

    return (
        <Container className="mt-4">
            <Row>
                <Col md="1" sm="0"></Col>
                <Col md="10" sm="12">
                    <Card>
                        <Card.Body className="text-center">
                            <Card.Text>
                                <big>{article} account has not published any predictions yet.</big>
                            </Card.Text>
                            <LinkContainer to="/new">
                                <Button>{buttonCopy}</Button>
                            </LinkContainer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

EmptyScreen.propTypes = {
    isActiveAccount: PropTypes.bool.isRequired,
}

export default EmptyScreen
