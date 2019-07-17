import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const InvalidNetwork = () => {
    return (
        <Container className="mt-4">
            <Row>
                <Col xs="2"></Col>
                <Col xs="8">
                    <Card>
                        <Card.Header as="h5"><span role="img" aria-label="warning emoji">⚠️</span> Invalid Network</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                Please connecte MetaMask, or your other web3 wallet provider, to the
                                main Ethereum network.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default InvalidNetwork
