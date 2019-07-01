import React, { Component } from 'react';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import HashSpan from '../HashSpan';

class RevelationForm extends Component {

    // LIFECYCLE

    constructor(props, context) {
        super(props);

        this.bankshot = context.drizzle.contracts.Bankshot;
        this.utils = context.drizzle.web3.utils;

        this.state = {
            revealInput: "",
        }

        this.handleRevealInput = this.handleRevealInput.bind(this);
        this.handleRevealClick = this.handleRevealClick.bind(this);
        this.urlSubID = this.urlSubID.bind(this);
        this.hash = this.hash.bind(this);
        this.deposit = this.deposit.bind(this);
        this.publication = this.publication.bind(this);
        this.revelation = this.revelation.bind(this);
    }

    handleRevealInput(event) {
        event.preventDefault();

        this.setState({
            revealInput: event.currentTarget.value,
        });
    }

    handleRevealClick(event) {
        event.preventDefault();

        let encodedRevelation = this.utils.toHex(this.state.revealInput);

        this.bankshot.methods.revealSubmission.cacheSend(this.urlSubID(), encodedRevelation);
    }

    // DATA DERIVATION

    urlSubID() {
        if (undefined === this.props.match.params.subid) {
            return "";
        }

        return this.props.match.params.subid;
    }

    hash() {
        return this.props.submissions[this.urlSubID()].hash;
    }

    deposit() {
        return this.props.submissions[this.urlSubID()].deposit;
    }

    publication() {
        let subID = this.urlSubID();

        let pubs = this.props.publications.filter(publication => {
            return publication.returnValues.subID === subID;
        });

        if (pubs.length > 0) {
            return pubs[0];
        } else {
            return null;
        }
    }

    revelation() {
        let subID = this.urlSubID();

        let reveals = this.props.revelations.filter(revelation => {
            return revelation.returnValues.subID === subID;
        });

        if (reveals.length > 0) {
            return reveals[0];
        } else {
            return null;
        }
    }

    // HELPERS

    formatDate(timestamp) {
        let date = new Date(1000 * parseInt(timestamp));
        return date.toLocaleDateString();
    }

    // RENDER

    render() {
        if (this.props.isLoading) {
            return (<div>Loading...</div>);
        }

        if (null !== this.revelation()) {
            let path = "/" + this.urlSubID();
            return (<Redirect to={path} />);
        }

        let hash = this.hash();
        let revealInputHash = this.utils.soliditySha3({type: 'string', value: this.state.revealInput});
        let isCorrectRevelation = (hash === revealInputHash);
        let pubDate = this.formatDate(this.publication().returnValues.date);
        let depositString = this.utils.fromWei(this.deposit(), "ether");

        return (
            <Container>
                <Row>
                    <Col md="1" sm="0"></Col>
                    <Col md="10" sm="12">
                        <h3>Reveal Your Prediction</h3>
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title><HashSpan hash={hash} /></Card.Title>
                                <Card.Text className="text-muted">
                                    Published: {pubDate}<br />
                                    Deposit: {depositString} ETH<br />
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <h5>Enter Revelation Text:</h5>
                        <Form>
                            <Form.Group controlId="formRevealSubmission">
                                <Form.Control as="textarea"
                                                rows="2"
                                                className="mb-3"
                                                value={this.state.revealInput}
                                                onChange={this.handleRevealInput} />
                                <Button variant="primary"
                                        disabled={!isCorrectRevelation}
                                        onClick={this.handleRevealClick}>
                                    Reveal Prediction
                                </Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }
}

RevelationForm.contextTypes = {
    drizzle: PropTypes.object,
}

RevelationForm.propTypes = {

}

export default RevelationForm;
