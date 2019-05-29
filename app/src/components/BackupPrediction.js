import React, { Component } from 'react';
import PropTypes from 'prop-types';

class BackupPrediction extends Component {

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
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
                    {this.props.fullText}
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
    fullText: PropTypes.string.isRequired,
    onContinue: PropTypes.func.isRequired,
}

export default BackupPrediction;