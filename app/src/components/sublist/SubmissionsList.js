import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { Button, Container, Row, Col, ListGroup, Card } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import HashSpan from '../HashSpan';
import { LinkContainer } from 'react-router-bootstrap'

class SubmissionsList extends Component {

    // LIFECYCLE

    constructor(props, context) {
        super(props);

        this.bankshot = context.drizzle.contracts.Bankshot;
        this.utils = context.drizzle.web3.utils;

        this.state = {
            submissionsKey: this.bankshot.methods.submissionsForAddress.cacheCall(props.account),
            revealInput: "",
            newSubIDSelection: null,
        }

        this.urlSubID = this.urlSubID.bind(this);
        this.submissions = this.submissions.bind(this);
        this.revelations = this.revelations.bind(this);
        this.revelationFor = this.revelationFor.bind(this);
        this.publications = this.publications.bind(this);
        this.publicationDateStringFor = this.publicationDateStringFor.bind(this);
        this.handleHashClick = this.handleHashClick.bind(this);
        this.handleRevealInput = this.handleRevealInput.bind(this);
        this.handleRevealClick = this.handleRevealClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.account !== this.props.account) {
            this.setState({
                submissionsKey: this.bankshot.methods.submissionsForAddress.cacheCall(nextProps.account),
            });
        }

        if (null !== this.state.newSubIDSelection) {
            this.setState({
                newSubIDSelection: null,
            });
        }
    }

    // HANDLERS

    handleHashClick(subID) {
        let newSelection = (subID === this.urlSubID()) ? "" : subID;

        this.setState({
            newSubIDSelection: newSelection,
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

        this.bankshot.methods.revealSubmission.cacheSend(this.urlSubID(), encodedRevelation);
    }

    // DATA DERIVATION

    urlSubID() {
        if (undefined === this.props.match.params.subid) {
            return "";
        }

        return this.props.match.params.subid;
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

    publications() {
        return this.props.bankshotState.events.filter( event => {
            return (event.event === 'Publication' &&
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

    publicationsFor(subID) {
        let pubs = this.publications().filter(publication => {
            return publication.returnValues.subID === subID;
        });

        if (pubs.length > 0) {
            return pubs[0];
        } else {
            return null;
        }
    }

    publicationDateStringFor(subID) {
        let publication = this.publicationsFor(subID);

        if (null === publication) {
            return "";
        }

        return this.dateForTimestamp(publication.returnValues.date);
    }

    revelationDateStringFor(subID) {
        let reveal = this.revelationFor(subID);

        if (null === reveal) {
            return "";
        }

        return this.dateForTimestamp(reveal.returnValues.date);
    }

    // HELPERS

    dateForTimestamp(timestamp) {
        let date = new Date(1000 * parseInt(timestamp));
        return date.toLocaleDateString();
    }

    // RENDER

    render() {
        if (null !== this.state.newSubIDSelection) {
            let newURL = "/" + this.state.newSubIDSelection;

            return (
                <Redirect push to={newURL} />
            );
        }

        let selectedSubID = this.urlSubID();
        let submissions = this.submissions();

        let hashList = submissions.map( (submission, subID) => {
                        subID = subID.toString();

                        let depositString = this.utils.fromWei(submission.deposit, "ether");

                        var className = "list-group-item list-group-item-action flex-column align-items-start";
                        var badge = "";

                        var pubDate = this.publicationDateStringFor(subID);
                        let revelationDate = this.revelationDateStringFor(subID);

                        if ("" !== revelationDate) {
                            badge = (<span className="badge badge-warning badge-pill">Revealed</span>);
                        }

                        if (this.urlSubID() === subID) {
                            className += " active";
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
                                <span>Published: {pubDate}</span><br />
                                <span>Deposit: {depositString} ETH</span><br />
                                <span>Revealed: {revelationDate}</span>
                            </a>
                        );
                    });

        var detailInterface = "";

        if (selectedSubID.length > 0 && submissions[selectedSubID]) {
            let hash = submissions[selectedSubID].hash;
            let depositString = this.utils.fromWei(submissions[selectedSubID].deposit, 'ether');
            let pubString = this.publicationDateStringFor(selectedSubID);

            let revelation = this.revelationFor(selectedSubID);
            var revelationInterface = "";
            var revealLabelAndDate = "";
            var depositLabel = "";

            if (revelation !== null) {
                let revelationText = this.utils.hexToString(revelation.returnValues.revelation);
                revealLabelAndDate = "Revealed: " + this.revelationDateStringFor(selectedSubID);
                depositLabel = "Deposit Returned: ";

                revelationInterface = (
                    <Card className="bg-light">
                        <Card.Body>
                            <big>{revelationText}</big>
                        </Card.Body>
                    </Card>
                );
            } else {
                let newPath = this.props.location.pathname + "/reveal";
                depositLabel = "Deposit Locked: ";

                revelationInterface = (
                    <LinkContainer to={newPath}>
                        <Button>Reveal This Prediction</Button>
                    </LinkContainer>
                );
            }

            detailInterface = (
                <Card>
                    <Card.Header>
                        <HashSpan hash={hash} />
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>
                            Published: {pubString}<br />
                            {depositLabel}{depositString} ETH<br />
                            {revealLabelAndDate}
                        </Card.Text>
                        {revelationInterface}
                    </Card.Body>
                </Card>
            );
        } else {
            detailInterface =(
                <Card className="h-25">
                    <Card.Body>
                        <big>Select an existing prediction or <Link to="/new">add a new one</Link>.</big>
                    </Card.Body>
                </Card>
            );
        }

        return (
            <Container>
                <Row>
                    <Col md="4" sm="12">
                        <ListGroup>
                            {hashList}
                        </ListGroup>
                    </Col>
                    <Col md="8" sm="12">
                        {detailInterface}
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
