import React from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const EmptyScreen = () => {
    return (
        <Container>
            <Row>
                <Col md="1" sm="0"></Col>
                <Col md="10" sm="12">
                    <Card>
                        <Card.Body className="text-center">
                            <Card.Text>
                                <big>This account has not published any predictions yet.</big>
                            </Card.Text>
                            <LinkContainer to="/new">
                                <Button>Publish First Prediction</Button>
                            </LinkContainer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default EmptyScreen
