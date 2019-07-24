import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap';
import { Container, Jumbotron, Row, Col, Card, Button } from 'react-bootstrap';
import { GoMegaphone, GoLightBulb, GoLock, GoLinkExternal } from 'react-icons/go';

class Home extends Component {
    render() {
        return (
            <Container className="mt-4">
                <Row className="justify-content-center">
                    <Col xs="12" md="9">
                        <Jumbotron className="pt-3 pb-4">
                                <h1 className="display-4 mb-0">forehash <span className="lead">/ ˈfoʊrhæʃ /</span></h1>
                                <hr className="mt-0 mb-3"></hr>
                            <p className="mb-1">
                                <i style={{fontSize: "1.2em"}}>noun, plural <b>fore·hashes</b></i> <br />
                            </p>
                            <div className="ml-4">
                                    <p className="text-muted" style={{float: "left", height: "100%"}}>1</p>
                                    <p className="ml-4">
                                        The hash of a prediction which is distributed publicly, such that the prediction
                                        itself can be revealed after it is proven correct or incorrect.
                                    </p>
                            </div>
                            <div className="ml-4">
                                    <p className="text-muted" style={{float: "left", height: "100%"}}>2</p>
                                    <p className="ml-4 mb-0">
                                        A commitment to reveal some knowledge in the future by publishing its hash
                                        in the present.
                                    </p>
                            </div>
                            <p className="mb-1">
                                <i style={{fontSize: "1.2em"}}>verb</i> <br />
                            </p>
                            <div className="ml-4">
                                    <p className="text-muted" style={{float: "left", height: "100%"}}>1</p>
                                    <p className="ml-4">
                                        The act of publishing a forehash.
                                    </p>
                            </div>
                            <LinkContainer className="mt-2" to="/new">
                                <Button size="lg">Get Started <GoLinkExternal /></Button>
                            </LinkContainer>
                        </Jumbotron>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs="12" md="3" className="d-flex align-items-stretch">
                        <Card>
                            <Card.Body>
                                <Card.Title><GoLightBulb /> Predict</Card.Title>
                                <Card.Text>
                                    Write a short prediction you'd like to reveal publicly at some point
                                    in the future.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs="12" md="3" className="mt-4 mt-md-0 d-flex align-items-stretch">
                        <Card>
                            <Card.Body>
                                <Card.Title><GoLock /> Commit</Card.Title>
                                <Card.Text>
                                    Publish a hash of your prediciton to the Ethereum blockchain, along with a
                                    small deposit.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs="12" md="3" className="mt-4 mt-md-0 d-flex align-items-stretch">
                        <Card>
                            <Card.Body>
                                <Card.Title><GoMegaphone /> Reveal</Card.Title>
                                <Card.Text>
                                    Reveal your prediction's plaintext and get your deposit back.
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
