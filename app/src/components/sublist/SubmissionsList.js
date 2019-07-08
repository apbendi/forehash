import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Row, Col, ListGroup } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap'
import SubmissionCell from './SubmissionCell';
import SubmissionDetail from './SubmissionDetail';
import EmptyScreen from './EmptyScreen';
import EmptyDetail from './EmptyDetail';
import AccountHeader from './AccountHeader';

class SubmissionsList extends Component {

    // LIFECYCLE

    constructor(props, context) {
        super(props);

        this.utils = context.drizzle.web3.utils;

        this.state = {
            newSubIDSelection: null,
        }

        this.urlSubID = this.urlSubID.bind(this);
        this.publicationDateStringFor = this.publicationDateStringFor.bind(this);
        this.revelationDateStringFor = this.revelationDateStringFor.bind(this);
        this.handleHashClick = this.handleHashClick.bind(this);
    }

    componentWillReceiveProps(_nextProps) {
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
        });
    }

    // DATA DERIVATION

    urlSubID() {
        if (undefined === this.props.match.params.subid) {
            return "";
        }

        return this.props.match.params.subid;
    }

    publicationDateStringFor(subID) {
        let publication = this.props.publicationFor(subID);

        if (null === publication) {
            return "";
        }

        return this.dateForTimestamp(publication.returnValues.date);
    }

    revelationDateStringFor(subID) {
        let reveal = this.props.revelationFor(subID);

        if (null === reveal) {
            return null;
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
            let newURL = "/" + this.props.match.params.account + "/" + this.state.newSubIDSelection;

            return (
                <Redirect push to={newURL} />
            );
        }

        if (this.props.isLoading) {
            return (
                <div>
                    Loading...
                </div>
            );
        }

        let selectedSubID = this.urlSubID();
        let submissions = this.props.submissions;

        if (submissions.length <= 0) {
            return (
                <EmptyScreen />
            );
        }

        let hashList = submissions.map( (submission, subID) => {
                        subID = subID.toString();
                        let depositString = this.utils.fromWei(submission.deposit, "ether");

                        return (
                            <SubmissionCell key={subID}
                                            subID={subID}
                                            onSelection={this.handleHashClick}
                                            isSelected={this.urlSubID() === subID}
                                            hash={submission.hash}
                                            pubDate={this.publicationDateStringFor(subID)}
                                            deposit={depositString}
                                            revelationDate={this.revelationDateStringFor(subID)}
                                    />
                        );
                    });

        var detailInterface = "";

        let hasSelectedSub = selectedSubID.length > 0 && submissions[selectedSubID];
        let isActiveAccount = (this.props.activeAccount === this.props.account);

        if (hasSelectedSub) {
            let revealPath = isActiveAccount ? ("/" + selectedSubID + "/reveal") : null;

            detailInterface = (
                <SubmissionDetail submission={submissions[selectedSubID]}
                                    publication={this.props.publicationFor(selectedSubID)}
                                    revelation={this.props.revelationFor(selectedSubID)}
                                    revealPath={revealPath}
                            />
            );
        } else {
            detailInterface = (<EmptyDetail isActiveAccount={isActiveAccount} />);
        }

        var newButton = "";

        if (isActiveAccount) {
            newButton = (
                <div className="text-center mt-2">
                    <LinkContainer to="/new">
                        <Button>[+] New Prediciton</Button>
                    </LinkContainer>
                </div>
            );
        }

        return (
            <Container className="mt-3">
                <div className="border-bottom p-1">
                    <AccountHeader
                        account={this.props.account}
                        submissions={this.props.submissions}
                        revelations={this.props.revelations} />
                </div>
                <Row className="mt-3">
                    <Col md="4" sm="12">
                        <ListGroup>
                            {hashList}
                        </ListGroup>
                        {newButton}
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

export default SubmissionsList;
