import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { Button, Form, Container, Row, Col, ListGroup } from 'react-bootstrap';
import HashSpan from './HashSpan';

class SubmissionsList extends Component {

    constructor(props, context) {
        super(props);

        this.bankshot = context.drizzle.contracts.Bankshot;
        this.utils = context.drizzle.web3.utils;

        this.state = {
            submissionsKey: this.bankshot.methods.submissionsForAddress.cacheCall(props.account),
            selectedSubID: "",
            revealInput: "",
        }

        this.submissions = this.submissions.bind(this);
        this.revelations = this.revelations.bind(this);
        this.revelationFor = this.revelationFor.bind(this);
        this.handleHashClick = this.handleHashClick.bind(this);
        this.handleRevealInput = this.handleRevealInput.bind(this);
        this.handleRevealClick = this.handleRevealClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.account === this.props.account) {
            return;
        }

        this.setState({
            submissionsKey: this.bankshot.methods.submissionsForAddress.cacheCall(nextProps.account),
        });
    }

    handleHashClick(subID) {
        let newSelection = (subID === this.state.selectedSubID) ? "" : subID;

        this.setState({
            selectedSubID: newSelection,
            revealInput: "",
        });
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

        this.bankshot.methods.revealSubmission.cacheSend(this.state.selectedSubID, encodedRevelation);
    }

    submissions() {
        if (!this.props.bankshotState.initialized) {
            return [];
        }

        if ( !(this.state.submissionsKey in this.props.bankshotState.submissionsForAddress) ) {
            return [];
        }

        let contractValue = this.props.bankshotState.submissionsForAddress[this.state.submissionsKey].value;

        if(!contractValue || !contractValue.hashes || !contractValue.deposits) {
            return [];
        }

        if (contractValue.hashes.length !== contractValue.deposits.length) {
            throw new Error("Invalid response from contract call");
        }

        var submissions = [];

        for (var i = 0; i < contractValue.hashes.length; i++){
            submissions[i] = {
                                hash: contractValue.hashes[i],
                                deposit: contractValue.deposits[i],
                            }
        }

        return submissions;
    }

    revelations() {
        return this.props.bankshotState.events.filter( event => {
            return (event.event === 'Revelation' && 
                    event.returnValues.user === this.props.account);
        });
    }

    revelationFor(subID) {
        let reveals = this.revelations().filter(revelation => {
            return revelation.returnValues.subID === subID;
        });

        if (reveals.length > 0) {
            return reveals[0];
        } else {
            return null;
        }
    }
    
    render() {
        let hashList = this.submissions().map( (submission, subID) => {
                        subID = subID.toString();

                        let depositString = this.utils.fromWei(submission.deposit, "ether");

                        var className = "list-group-item list-group-item-action flex-column align-items-start";
                        var badge = ""

                        let revelation = this.revelationFor(subID);

                        if (null !== revelation) {
                            badge = (<span className="badge badge-warning badge-pill">Revealed</span>);
                        }

                        if (this.state.selectedSubID === subID) {
                            className += " active"
                        }

                        return (
                            <a href="/"
                                    className={className}
                                    key={subID}
                                    onClick={(event) => {
                                            event.preventDefault();
                                            this.handleHashClick(subID);
                                        }
                                    }>

                                <div className="d-flex w-100 justify-content-between">
                                    <HashSpan hash={submission.hash} />
                                    <span>{badge}</span>
                                </div>
                                <span>Deposit: {depositString} ETH</span>
                            </a>
                        );
                    });

        var revealInterface = "";

        if (this.state.selectedSubID.length > 0) {
            let revelation = this.revelationFor(this.state.selectedSubID);

            if (revelation !== null) {
                let revelationText = this.utils.hexToString(revelation.returnValues.revelation);

                revealInterface = (
                    <div>
                        <h3>Revealed Prediction</h3>
                        <div className="card">
                            <div className="card-body">
                                {revelationText}
                            </div>
                        </div>
                    </div>
                );
            } else {
                let selectedHash = this.submissions()[this.state.selectedSubID].hash;
                let revealInputHash = this.utils.soliditySha3({type: 'string', value: this.state.revealInput});
                let isCorrectRevelation = (selectedHash === revealInputHash);

                revealInterface = (
                    <Form>
                        <h3>Reveal Prediction</h3>
                        <Form.Group controlId="formRevealSubmission">
                            <Form.Control as="textarea"
                                            rows="2"
                                            className="mb-3"
                                            value={this.state.revealInput}
                                            onChange={this.handleRevealInput} />
                            <Button variant="primary"
                                    disabled={!isCorrectRevelation}
                                    onClick={this.handleRevealClick}>
                                Reveal This Submission
                            </Button>
                        </Form.Group>
                    </Form>
                );
            }
        }

        return (
            <Container>
                <Row>
                    <Col md="4" sm="12">
                        <h2>Past Predictions</h2>
                        <ListGroup>
                            {hashList}
                        </ListGroup>
                    </Col>
                    <Col md="8" sm="12">
                        {revealInterface}
                    </Col>
                </Row>
            </Container>
        );
    }
}

SubmissionsList.contextTypes = {
    drizzle: PropTypes.object,
}

let mapStateToProps = state => {
    return {
        account: state.accounts[0],
        bankshotState: state.contracts.Bankshot,
    };
}

export default drizzleConnect(SubmissionsList, mapStateToProps, null);
