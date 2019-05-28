import React, { Component } from 'react'
import SubmissionForm from './SubmissionForm';
import PredictionForm from './PredictionForm';

class SubmissionFlow extends Component {

    constructor(props, context) {
        super(props);

        this.predictionCallback = this.predictionCallback.bind(this);
    }

    predictionCallback(prediction, deposit) {
        console.log(prediction + " " + deposit);
    }

    render() {
        return (
            <div>
                <h2>New Prediction</h2>
                <PredictionForm 
                    onSubmit={this.predictionCallback}
                    />
            </div>
        )
    }
}

export default SubmissionFlow;
