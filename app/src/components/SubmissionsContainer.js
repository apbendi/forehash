import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { drizzleConnect } from '@drizzle/react-plugin';

class SubmissionsContainer extends Component {

    // LIFECYCLE

    constructor(props, context) {
        super(props);

        this.bankshot = context.drizzle.contracts.Bankshot;
        this.utils = context.drizzle.web3.utils;

        this.state = {
            submissionsKey: this.bankshot.methods.submissionsForAddress.cacheCall(this.props.account),
        }

        this.isLoading = this.isLoading.bind(this);
        this.submissions = this.submissions.bind(this);
        this.revelations = this.revelations.bind(this);
        this.publications = this.publications.bind(this);
        this.revelationFor = this.revelationFor.bind(this);
        this.publicationFor = this.publicationFor.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.account !== this.props.account) {
            this.setState({
                submissionsKey: this.bankshot.methods.submissionsForAddress.cacheCall(nextProps.account),
            });
        }
    }

    // DATA DERIVATION

    isLoading() {
        if (!this.props.bankshotState.initialized) {
            return true;
        }

        if ( !(this.state.submissionsKey in this.props.bankshotState.submissionsForAddress) ) {
            return true;
        }

        let contractValue = this.props.bankshotState.submissionsForAddress[this.state.submissionsKey].value;

        if(!contractValue || !contractValue.hashes || !contractValue.deposits) {
            return true;
        }

        return false;
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

    publicationFor(subID) {
        let pubs = this.publications().filter(publication => {
            return publication.returnValues.subID === subID;
        });

        if (pubs.length > 0) {
            return pubs[0];
        } else {
            return null;
        }
    }

    // RENDER

    render() {
        let PresentationComponent = this.props.component;
        return (
            <PresentationComponent {...this.props}
                                    isLoading={this.isLoading()}
                                    submissions={this.submissions()}
                                    publications={this.publications()}
                                    revelations={this.revelations()}
                                    publicationFor={this.publicationFor}
                                    revelationFor={this.revelationFor}
                                    />
        )
    }
}

SubmissionsContainer.contextTypes = {
    drizzle: PropTypes.object,
}

SubmissionsContainer.propTypes = {
    account: PropTypes.string.isRequired,
}

let mapStateToProps = state => {
    return {
        activeAccount: state.accounts[0],
        bankshotState: state.contracts.Bankshot,
    };
}

export default drizzleConnect(SubmissionsContainer, mapStateToProps, null);
