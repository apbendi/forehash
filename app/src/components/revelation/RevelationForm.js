import React, { Component } from 'react';
import { Button, Form, Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import HashSpan from '../HashSpan';
import LoadingIndicator from '../LoadingIndicator';

class RevelationForm extends Component {

    // LIFECYCLE

    constructor(props, context) {
        super(props);

        this.bankshot = context.drizzle.contracts.Bankshot;
        this.utils = context.drizzle.web3.utils;

        this.state = {
            revealInput: "",
            isPending: false,
        }

        this.handleRevealInput = this.handleRevealInput.bind(this);
        this.handleRevealClick = this.handleRevealClick.bind(this);
        this.urlSubID = this.urlSubID.bind(this);
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

        this.setState({
            isPending: true,
        });
    }

    // DATA DERIVATION

    urlSubID() {
        if (undefined === this.props.match.params.subid) {
            return "";
        }

        return this.props.match.params.subid;
    }

    // HELPERS

    formatDate(timestamp) {
        let date = new Date(1000 * parseInt(timestamp));
        return date.toLocaleDateString();
    }

    // RENDER

    render() {
        if (this.props.isLoading) {
            return (<LoadingIndicator />);
        }

        let subID = this.urlSubID();

        let publicationsCount = this.props.publications.length;
        let isLoadingPublicationEvents = ( publicationsCount < (parseInt(subID) + 1) );

        if (isLoadingPublicationEvents) {
            return (<LoadingIndicator />);
        }

        if (null !== this.props.revelationFor(subID)) {
            let path = "/" + this.urlSubID();
            // TODO: fix redirect
            return (<Redirect to={path} />);
        }

        let buttonContent = "Reveal Prediction";

        if (this.state.isPending) {
            buttonContent = (
                <span>
                    <Spinner as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true" />
                        {" "}Pending...
                </span>
            );
        }

        let submission = this.props.submissions[subID];
        let publication = this.props.publicationFor(subID);

        let revealInputHash = this.utils.soliditySha3({type: 'string', value: this.state.revealInput});
        let isCorrectRevelation = (submission.hash === revealInputHash);
        let pubDate = this.formatDate(publication.returnValues.date);
        let depositString = this.utils.fromWei(submission.deposit, "ether");

        return (
            <Container className="mt-4">
                <Row>
                    <Col md="1" sm="0"></Col>
                    <Col md="10" sm="12">
                        <h3>Reveal Your Prediction</h3>
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title><HashSpan hash={submission.hash} /></Card.Title>
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
                                        disabled={!isCorrectRevelation || this.state.isPending}
                                        onClick={this.handleRevealClick}>
                                    {buttonContent}
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
