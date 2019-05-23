import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

class SubmissionForm extends Component {
    constructor(props, context) {
        super(props);

        this.account = props.account;
        this.utils = context.drizzle.web3.utils;
        this.bankshot = context.drizzle.contracts.Bankshot;

        this.state = {
            predictionInput: "",
            ethVigKey: this.bankshot.methods.ethVig.cacheCall(),
            minEthDepositKey: this.bankshot.methods.minEthDeposit.cacheCall(),
        }

        this.isContractInitialized = this.isContractInitialized.bind(this);
        this.methodValueForKey = this.methodValueForKey.bind(this);
        this.ethVig = this.ethVig.bind(this);
        this.minEthDeposit = this.minEthDeposit.bind(this);
        this.minEthPayable = this.minEthPayable.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    isContractInitialized() {
        return this.props.bankshotState.initialized;
    }

    methodValueForKey(method, key) {
        if ( !(key in this.props.bankshotState[method]) ) {
            return null;
        } else {
            return this.props.bankshotState[method][key].value;
        }
    }

    ethVig() {
        if ( !this.isContractInitialized()){
            return null;
        }

        return this.methodValueForKey("ethVig", this.state.ethVigKey);
    }

    minEthDeposit() {
        if ( !this.isContractInitialized()){
            return null;
        }

        return this.methodValueForKey("minEthDeposit", this.state.minEthDepositKey);
    }

    minEthPayable() {
        let ethVig = this.ethVig();
        let minEthDeposit = this.minEthDeposit();

        if (ethVig === null || minEthDeposit === null) {
            return null;
        }

        let sum = this.utils.toBN(ethVig).add(this.utils.toBN(minEthDeposit));

        return sum;
    }

    handleInputChange(event) {
        event.preventDefault();

        this.setState({
            predictionInput: event.target.value,
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        let predictionHash = this.utils.soliditySha3({type: 'string', value: this.state.predictionInput});
        this.bankshot.methods.submitHash.cacheSend(predictionHash, {value: this.minEthPayable()});
    }

    render() {
        let ethVig  = this.ethVig();
        let minEthDeposit = this.minEthDeposit();

        let isButtonEnabled = ethVig !== null && 
                                minEthDeposit !== null && 
                                this.state.predictionInput !== "";

        return (
            <div>
                <h2>New Submission</h2>
                <form>
                    <div className="form-group">
                        <textarea placeholder="Your submission text"
                                    className="form-control"
                                    value={this.state.predictionInput} 
                                    onChange={this.handleInputChange} />
                        <br />

                        <button type="button"
                                className="btn btn-default"
                                disabled={!isButtonEnabled} 
                                onClick={this.handleSubmit}>
                            Hash & Submit
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

SubmissionForm.contextTypes = {
    drizzle: PropTypes.object,
}

let mapStateToProps = state => {
    return {
        account: state.accounts[0],
        bankshotState: state.contracts.Bankshot,
    };
};

export default drizzleConnect(SubmissionForm, mapStateToProps, null);
