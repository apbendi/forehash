import React, { Component } from 'react'
import PropTypes from 'prop-types';
import PredictionForm from './PredictionForm';
import BackupPrediction from './BackupPrediction';
import ConfirmForm from './ConfirmForm';

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
        console.log("Hello world");
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
                        prediction={this.state.predictionText}
                        salt={this.state.randomSalt}
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
