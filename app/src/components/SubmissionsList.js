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
            selectedSubID: "",
            revealInput: "",
        }

        this.hashes = this.hashes.bind(this);
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
            hashesKey: this.bankshot.methods.hashesForAddress.cacheCall(nextProps.account),
        });
    }

    handleHashClick(event) {
        event.preventDefault();

        let subID = event.target.value;
        let newSelection = (subID === this.state.selectedSubID) ? "" : subID;

        this.setState({
            selectedSubID: newSelection,
        });
    }

    handleRevealInput(event) {
        event.preventDefault();

        this.setState({
            revealInput: event.target.value,
        });
    }

    handleRevealClick(event) {
        event.preventDefault();

        let encodedRevelation = this.utils.toHex(this.state.revealInput);

        this.bankshot.methods.revealSubmission.cacheSend(this.state.selectedSubID, encodedRevelation);
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
        let hashList = this.hashes().map( (hash, subID) => {
                        subID = subID.toString();

                        var className = "list-group-item";
                        var badge = ""

                        let revelation = this.revelationFor(subID);
                        if (null !== revelation) {
                            className += " list-group-item-warning";
                            badge = (<span className="badge">Revealed</span>);
                        }

                        if (this.state.selectedSubID === subID) {
                            className += " active"
                        }

                        return (
                            <button type="button" 
                                    className={className}
                                    key={subID}
                                    value={subID}
                                    onClick={this.handleHashClick}>
                                {hash}{badge}
                            </button>
                        );
                    });

        var revealInterface = "";

        if (this.state.selectedSubID.length > 0) {
            let revelation = this.revelationFor(this.state.selectedSubID);

            if (revelation !== null) {
                let revelationText = this.utils.hexToString(revelation.returnValues.revelation);

                revealInterface = (
                    <div>
                        <h2>Revealed Submission</h2>
                        <div className="panel panel-default">
                            <div className="panel-body">
                                {revelationText}
                            </div>
                        </div>
                    </div>
                );
            } else {
                revealInterface = (
                    <form>
                        <h2>Reveal Submission</h2>
                        <div className="form-group">
                            <textarea className="form-control"
                                      value={this.state.revealInput}
                                      onChange={this.handleRevealInput} />
                            <br />

                            <button className="btn btn-default"
                                    disabled={this.state.revealInput.length === 0}
                                    onClick={this.handleRevealClick}>
                                Reveal This Submission
                            </button>
                        </div>
                    </form>
                );
            }
        }

        return (
            <div>
                <h2>Submissions</h2>
                <div className="list-group">
                    {hashList}
                </div>
                <div>
                    {revealInterface}
                </div>
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
