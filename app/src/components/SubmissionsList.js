import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

class SubmissionsList extends Component {

    constructor(props, context) {
        super(props);

        this.bankshot = context.drizzle.contracts.Bankshot;
        this.utils = context.drizzle.web3.utils;

        this.state = {
            hashesKey: this.bankshot.methods.hashesForAddress.cacheCall(props.account),
        }

        this.hashes = this.hashes.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.account === this.props.account) {
            return;
        }

        this.setState({
            hashesKey: this.bankshot.methods.hashesForAddress.cacheCall(nextProps.account),
        });
    }

    hashes() {
        if (!this.props.bankshotState.initialized) {
            return [];
        }

        if ( !(this.state.hashesKey in this.props.bankshotState.hashesForAddress) ) {
            return [];
        }

        return this.props.bankshotState.hashesForAddress[this.state.hashesKey].value;
    }
    
    render() {
        let hashList = this.hashes().map( hash => {
                            return (<li key={hash}>{hash}</li>);
                        });
        return (
            <div>
                <h2>Submissions</h2>
                <ul>
                    {hashList}
                </ul>
            </div>
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
