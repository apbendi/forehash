import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap';
import { Container, Jumbotron, Row, Col, Card, Button } from 'react-bootstrap';
import { MdPublish, MdLockOutline } from 'react-icons/md';
import { GoMegaphone } from 'react-icons/go';

class Home extends Component {
    render() {
        let links = [
            "0x73cC3e91D67613d481cC9cfe11A1679901873656",
            "0x85faf44B62f01e1969921B66b4c5c4C49FC953Dc",
        ];

        return (
            <Container className="mt-4">
                <Row className="justify-content-center">
                    <Col xs="12" md="9">
                        <Jumbotron>
                            <h2>Predict, Commit, Reveal</h2>
                            <p>
                                Pre-imaged predictions with skin in the game. Publication history is
                                stored immutably on the Ethereum blockchain. A small deposit locked until
                                each prediction is revealed. Add accountability to your public prognostications.
                            </p>
                            <LinkContainer to="/new">
                                <Button>Get Started</Button>
                            </LinkContainer>
                        </Jumbotron>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs="12" md="3" className="d-flex align-items-stretch">
                        <Card>
                            <Card.Body>
                                <Card.Title><MdPublish /> Predict</Card.Title>
                                <Card.Text>
                                    Put a timestamped prediction hash to the Ethereum blockchain.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs="12" md="3" className="mt-4 mt-md-0">
                        <Card>
                            <Card.Body>
                                <Card.Title><MdLockOutline /> Commit</Card.Title>
                                <Card.Text>
                                    Lock a small deposit to signal your committment to exposing it.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs="12" md="3" className="mt-4 mt-md-0">
                        <Card>
                            <Card.Body>
                                <Card.Title><GoMegaphone /> Reveal</Card.Title>
                                <Card.Text>
                                    Reveal your prediction's plaintext to get your deposit back.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Home;
