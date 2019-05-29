import React, { Component } from 'react'
import PropTypes from 'prop-types';

class PredictionForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            predictionInput: "",
            depositAmount: "",
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDepositChange = this.handleDepositChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        event.preventDefault();

        this.setState({
            predictionInput: event.target.value,
        });
    }

    handleDepositChange(event) {
        event.preventDefault();

        this.setState({
           depositAmount: event.target.value, 
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.onSubmit(this.state.predictionInput, this.state.depositAmount);
    }

    render() {
        let isButtonEnabled = (this.props.isEnabled && this.state.predictionInput.length > 5);

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
                        <br />

                        <h4>Deposit Amount</h4>

                        <p>
                        Your deposit will be locked with your prediction. It is returned when you reveal it.
                        It doesn't matter whether it's right or wrong. It's your commitment to revealing your prediction.
                        </p>

                        <input type="number" 
                                className="form-control"
                                step="0.01" 
                                placeholder="0.1 ETH" 
                                value={this.state.depositAmount}
                                onChange={this.handleDepositChange}
                                />

                        <br />

                        <button type="button"
                                className="btn btn-default"
                                disabled={!isButtonEnabled} 
                                onClick={this.handleSubmit}>
                            Prepare For Submission
                        </button>
                    </div>
            </div>
        )
    }
}

PredictionForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isEnabled: PropTypes.bool.isRequired,
}

export default PredictionForm;
