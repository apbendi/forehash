import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { drizzleConnect } from 'drizzle-react';
import PredictionForm from './PredictionForm';
import BackupPrediction from './BackupPrediction';
import ConfirmForm from './ConfirmForm';
import PublishForm from './PublishForm';
import SuccessMessage from './SuccessMessage';

class SubmissionFlow extends Component {

    // LIFECYCLE

    constructor(props, context) {
        super(props);

        this.account = props.account;
        this.utils = context.drizzle.web3.utils;
        this.bankshot = context.drizzle.contracts.Bankshot;

        this.state = {
            flowStep: "PREDICTION",
            predictionText: "",
            depositAmount: "",
            randomSalt: this.generateSalt(),
            confirmError: null,
            ethVigKey: this.bankshot.methods.ethVig.cacheCall(),
            minEthDepositKey: this.bankshot.methods.minEthDeposit.cacheCall(),
            hashesKey: this.bankshot.methods.hashesForAddress.cacheCall(props.account),
        }

        this.validationResponseForDeposit = this.validationResponseForDeposit.bind(this);
        this.resetState = this.resetState.bind(this);

        this.predictionCallback = this.predictionCallback.bind(this);
        this.backupContinue = this.backupContinue.bind(this);
        this.backupConfirm = this.backupConfirm.bind(this);
        this.publishHash = this.publishHash.bind(this);
        this.continueOnSuccess = this.continueOnSuccess.bind(this);

        this.fullText = this.fullText.bind(this);
        this.predictionHash = this.predictionHash.bind(this);
        this.isContractInitialized = this.isContractInitialized.bind(this);
        this.methodValueForKey = this.methodValueForKey.bind(this);
        this.ethVig = this.ethVig.bind(this);
        this.minEthDeposit = this.minEthDeposit.bind(this);
        this.minEthPayable = this.minEthPayable.bind(this);
        this.hashes = this.hashes.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.flowStep !== 'PUBLISH') {
            return;
        }

        let hashes = this.hashes(nextProps);
        let predictionHash = this.predictionHash();

        if (hashes.includes(predictionHash)) {
            this.setState({
                flowStep: "SUCCESS",
            });
        }
    }

    // HELPERS

    generateSalt(length=8) {
        // Not strong, but does it need to be? It's just some noise
        // to make it harder for people to brute force a short or
        // easily guessable prediction. (via https://stackoverflow.com/q/1349404)
        return Math.random()
                    .toString(36)
                    .replace(/[^a-z]+/g, '')
                    .substr(0, length)
    }

    validationResponseForDeposit(ethAmountString) {
        if (ethAmountString.length < 1) {
            return "";
        }

        let minEthDeposit = this.minEthDeposit();

        if (null === minEthDeposit) {
            return "Loading Contract Parameters";
        }

        let minWeiDeposit = this.utils.toBN(minEthDeposit);
        let weiAmount = this.utils.toBN(this.utils.toWei(ethAmountString));

        let isEnough = weiAmount.gte(minWeiDeposit);

        if (!isEnough) {
            let ethString = this.utils.fromWei(minEthDeposit, "ether");
            return "The Minimum Deposit Is " + ethString + " ETH";
        }

        return "";
    }

    resetState() {
        this.setState({
            flowStep: "PREDICTION",
            predictionText: "",
            depositAmount: "",
            randomSalt: this.generateSalt(),
            confirmError: null,
        });
    }

    // FLOW STEP CALLBACKS

    predictionCallback(prediction, deposit) {
        this.setState({
            flowStep: "BACKUP",
            predictionText: prediction,
            depositAmount: deposit, 
        });
    }

    backupContinue() {
        this.setState({
            flowStep: "CONFIRM", 
        });
    }

    backupConfirm(confirmText) {
        if (confirmText === this.state.randomSalt) {
            this.setState({
               flowStep: "PUBLISH",
            });
        } else {
            this.setState({
                confirmError: "Text entered does not match",
            });
        }
    }

    publishHash() {
        let hash = this.predictionHash();
        let ethVig = this.ethVig();
        let depositWei = this.utils.toWei(this.state.depositAmount, "ether");

        let valueSum = this.utils.toBN(ethVig).add(this.utils.toBN(depositWei));

        this.bankshot.methods.submitHash.cacheSend(hash, {value: valueSum});
    }

    continueOnSuccess() {
        this.resetState();
    }

    // COMPUTED PROPERTIES

    fullText() {
        return this.state.predictionText + " {" + this.state.randomSalt + "}";
    }

    predictionHash() {
        let hash = this.utils.soliditySha3({type: 'string', value: this.fullText()});

        return hash;
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

    hashes(props) {
        if(props === undefined) {
            props = this.props;
        }

        if (!props.bankshotState.initialized) {
            return [];
        }

        if ( !(this.state.hashesKey in props.bankshotState.hashesForAddress) ) {
            return [];
        }

        let contractValue = props.bankshotState.hashesForAddress[this.state.hashesKey].value;

        if(!contractValue) {
            return [];
        }

        return contractValue;
    }

    // RENDER
    
    render() {
        let ethVig  = this.ethVig();
        let minEthDeposit = this.minEthDeposit();

        let isSubmissionEnabled = (ethVig !== null && minEthDeposit !== null)

        var stepComponent = ("");
        var header = "";

        switch (this.state.flowStep) {
            case "PREDICTION":
                header = "New Prediction";

                stepComponent = (
                    <PredictionForm
                        amountValidator={this.validationResponseForDeposit}
                        onSubmit={this.predictionCallback}
                        isEnabled={isSubmissionEnabled} />
                );   

                break;
            case "BACKUP":
                header = "Backup Your Prediction";
                
                stepComponent =(
                    <BackupPrediction
                        fullText={this.fullText()}
                        onContinue={this.backupContinue}
                        isEnabled={isSubmissionEnabled} />
                );

                break;
            case "CONFIRM":
                header = "Confirm Backup";

                stepComponent = (
                    <ConfirmForm
                        onConfirm={this.backupConfirm}
                        error={this.state.confirmError}
                        isEnabled={isSubmissionEnabled} />
                );

                break;
            case "PUBLISH":
                header = "Publish Hash";

                stepComponent = (
                    <PublishForm
                        hash={this.predictionHash()}
                        onSubmit={this.publishHash}
                        isEnabled={isSubmissionEnabled} />
                );
                break;
            case "SUCCESS":
                header = "Prediction Published";

                stepComponent = (
                    <SuccessMessage
                        hash={this.predictionHash()}
                        onSubmit={this.continueOnSuccess}
                        isEnabled={isSubmissionEnabled} />
                );

                break;
            default:
                throw new Error("Illegal State");
        }
        
        return (
            <div>
                <h2>{header}</h2>
                {stepComponent}
            </div>
        )
    }
}

SubmissionFlow.contextTypes = {
    drizzle: PropTypes.object,
}

let mapStateToProps = state => {
    return {
        account: state.accounts[0],
        bankshotState: state.contracts.Bankshot,
    };
}

export default drizzleConnect(SubmissionFlow, mapStateToProps, null);
