import React, { Component } from 'react'
import PropTypes from 'prop-types';
import PredictionForm from './PredictionForm';
import BackupPrediction from './BackupPrediction';
import ConfirmForm from './ConfirmForm';
import PublishForm from './PublishForm';

class SubmissionFlow extends Component {

    constructor(props, context) {
        super(props);

        this.utils = context.drizzle.web3.utils;

        this.state = {
            flowStep: "PREDICTION",
            predictionText: "",
            depositAmount: "",
            randomSalt: this.generateSalt(),
            confirmError: null,
        }

        this.predictionCallback = this.predictionCallback.bind(this);
        this.backupContinue = this.backupContinue.bind(this);
        this.backupConfirm = this.backupConfirm.bind(this);
        this.publishHash = this.publishHash.bind(this);

        this.fullText = this.fullText.bind(this);
        this.predictionHash = this.predictionHash.bind(this);
    }

    generateSalt(length=8) {
        // Not strong, but does it need to be? It's just some noise
        // to make it harder for people to brute force a short or
        // easily guessable prediction. (via https://stackoverflow.com/q/1349404)
        return Math.random()
                    .toString(36)
                    .replace(/[^a-z]+/g, '')
                    .substr(0, length)
    }

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

        console.log("Do it now " + hash);
    }

    fullText() {
        return this.state.predictionText + " {" + this.state.randomSalt + "}";
    }

    predictionHash() {
        let hash = this.utils.soliditySha3({type: 'string', value: this.fullText()});

        return hash;
    }
    
    render() {
        var stepComponent = ("");
        var header = "";

        switch (this.state.flowStep) {
            case "PREDICTION":
                header = "New Prediction";

                stepComponent = (
                    <PredictionForm
                        onSubmit={this.predictionCallback}
                        />
                );   

                break;
            case "BACKUP":
                header = "Backup Your Prediction";
                
                stepComponent =(
                    <BackupPrediction
                        fullText={this.fullText()}
                        onContinue={this.backupContinue}
                        />
                );

                break;
            case "CONFIRM":
                header = "Confirm Backup";

                stepComponent = (
                    <ConfirmForm
                        onConfirm={this.backupConfirm}
                        error={this.state.confirmError} />
                );

                break;
            case "PUBLISH":
                header = "Publish Hash";

                stepComponent = (
                    <PublishForm
                        hash={this.predictionHash()}
                        onSubmit={this.publishHash} />
                );
                break;
            default:
                throw "Illegal State";
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

export default SubmissionFlow;
