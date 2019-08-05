import React, { Component } from 'react'
import PropTypes from 'prop-types';

class PredictionForm extends Component {

    constructor(props, context) {
        super(props);

        this.utils = context.drizzle.web3.utils;

        this.state = {
            predictionInput: "",
            depositAmount: "",
            submissionValidationMessage: "",
            depositValidationMessage: "",
        }

        this.depositValidationResponse = this.depositValidationResponse.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDepositChange = this.handleDepositChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    submissionValidationResponse(submissionText) {
        if (submissionText === "") {
            return "";
        }

        if (submissionText.length < 10) {
            return "Prediction text must be at least 10 characters";
        }

        if (submissionText.length > 256) {
            return "Prediction text must be less than 256 characters";
        }

        return "";
    }

    depositValidationResponse(ethAmountString) {
        if (ethAmountString.length < 1) {
            return "";
        }

        let minEthDeposit = this.props.minEthDeposit;
        let maxEthDeposit = this.props.maxEthDeposit;

        if (null === minEthDeposit || null == maxEthDeposit) {
            return "Loading Contract Parameters";
        }

        let weiAmount = this.utils.toBN(this.utils.toWei(ethAmountString));

        let minWeiDeposit = this.utils.toBN(minEthDeposit);
        let isEnough = weiAmount.gte(minWeiDeposit);

        if (!isEnough) {
            let ethString = this.utils.fromWei(minEthDeposit, "ether");
            return "The Minimum Deposit Is " + ethString + " ETH";
        }

        let maxWeiDeposit = this.utils.toBN(maxEthDeposit);
        let isBelowMax = maxWeiDeposit.gte(weiAmount);

        if (!isBelowMax) {
            let maxString = this.utils.fromWei(maxEthDeposit, "ether");
            return "The Maximum Deposit Permitted Is " + maxString + " ETH";
        }

        return "";
    }

    handleInputChange(event) {
        event.preventDefault();

        let input = event.target.value;

        this.setState({
            predictionInput: input,
            submissionValidationMessage: this.submissionValidationResponse(input),
        });
    }

    handleDepositChange(event) {
        event.preventDefault();

        let input = event.target.value;

        this.setState({
           depositAmount: input,
           depositValidationMessage: this.depositValidationResponse(input),
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.onSubmit(this.state.predictionInput, this.state.depositAmount);
    }

    render() {
        let isButtonEnabled = this.props.isEnabled &&
                                this.state.predictionInput.length > 0 &&
                                this.state.depositAmount.length > 0 &&
                                this.state.depositValidationMessage === "" &&
                                this.state.submissionValidationMessage === "";

        var placeholder = "ETH";

        if (this.props.minEthDeposit) {
            let ethMin = this.utils.fromWei(this.props.minEthDeposit, "ether");
            placeholder = ethMin + " ETH";
        }

        return (
            <div>
                <p>
                    Enter the text of your prediction.
                    We'll store a hash of it on the blockchain.
                </p>
                <div className="form-group">
                        <textarea placeholder="Prediction Text"
                                    className="form-control"
                                    value={this.state.predictionInput}
                                    onChange={this.handleInputChange} />
                        <small>
                            {this.state.submissionValidationMessage}
                        </small>
                        <br />

                        <h4>Deposit Amount</h4>

                        <p>
                        Your deposit will be locked with your prediction. It is returned when you reveal it.
                        It doesn't matter whether it's right or wrong. It's your pledge to revealing your prediction.
                        </p>

                        <input type="number"
                                className="form-control"
                                step="0.01"
                                placeholder={placeholder}
                                value={this.state.depositAmount}
                                onChange={this.handleDepositChange}
                                />

                        <small>
                            {this.state.depositValidationMessage}
                        </small>

                        <br />

                        <button type="button"
                                className="btn btn-primary"
                                disabled={!isButtonEnabled}
                                onClick={this.handleSubmit}>
                            Prepare For Submission
                        </button>
                    </div>
            </div>
        )
    }
}

PredictionForm.contextTypes = {
    drizzle: PropTypes.object,
}

PredictionForm.propTypes = {
    minEthDeposit: PropTypes.string,
    maxEthDeposit: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    isEnabled: PropTypes.bool.isRequired,
}

export default PredictionForm;
