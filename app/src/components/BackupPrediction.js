import React, { Component } from 'react';
import PropTypes from 'prop-types';

class BackupPrediction extends Component {

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    submissionText(prediction, salt) {
        return prediction + ' {' + salt + '}';
    }

    handleClick(event) {
        event.preventDefault();
        this.props.onContinue();
    }

    render() {
        return (
            <div>
                <p>
                Save this EXACT text! It will be required to reclaim your deposit.
                </p>
                <div className="well">
                    {this.submissionText(this.props.prediction, this.props.salt)}
                </div>
                <button type="button"
                        className="btn btn-default"
                        onClick={this.handleClick}>
                    Continue
                </button>
            </div>
        )
    }
}

BackupPrediction.propTypes = {
    prediction: PropTypes.string.isRequired,
    salt: PropTypes.string.isRequired,
    onContinue: PropTypes.func.isRequired,
}

export default BackupPrediction;