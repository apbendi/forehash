import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SuccessMessage extends Component {
    constructor(props) {
        super(props);

        this.handleNext = this.handleNext.bind(this);
    }

    handleNext(event) {
        event.preventDefault();
        this.props.onSubmit();
    }

    render() {
        return (
            <div>
                <p>
                    Your prediction hash has been published on the blockchain, and your deposit has been
                    locked. To get it back, you'll need to reveal your prediction text. Be sure to keep it
                    backed up somewhere safe!
                </p>

                <div className="card mb-3">
                    <div className="card-header">Hash Published</div>
                    <div className="card-body">
                        {this.props.hash}
                    </div>
                </div>

                <button type="button" 
                        className="btn btn-success"
                        onClick={this.handleNext}
                        disabled={!this.props.isEnabled} >
                    Continue
                </button>
            </div>
        );
    }
}

SuccessMessage.propTypes = {
    hash: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isEnabled: PropTypes.bool.isRequired,
}

export default SuccessMessage;
