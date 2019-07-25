import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { GoLinkExternal, GoLink } from 'react-icons/go';

const NoWeb3 = () => {
    return (
        <Container className="mt-4">
            <Row>
                <Col sm="0" md="2"></Col>
                <Col sm="12" md="8">
                    <Card>
                        <Card.Header as="h5"><span role="img" aria-label="fox emoji">🦊</span> Web3 Is Required</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                This website communicates with the Ethereum network via a protocol known as web3.
                                To enable this site in your browser, download a web3 compatible browser extension
                                like MetaMask.
                            </Card.Text>
                            <a href="https://metamask.io" className="btn btn-primary">Get MetaMask <GoLinkExternal /></a>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default NoWeb3
