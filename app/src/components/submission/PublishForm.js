import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PublishForm extends Component {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.onSubmit();
    }

    render() {
        return (
            <div>
                <p>
                    Submit a transaction to the Ethereum blockchain which includes
                    the hash of your prediction and locks your deposit.
                </p>

                <div className="card mb-3">
                    <div className="card-header">Prediction Hash</div>
                    <div className="card-body">
                        {this.props.hash}
                    </div>
                </div>

                <button type="button" 
                        className="btn btn-primary"
                        onClick={this.handleSubmit}
                        disabled={!this.props.isEnabled} >
                    Submit
                </button>
            </div>
        );
    }
}

PublishForm.propTyptes = {
    hash: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isEnabled: PropTypes.bool.isRequired,
}

export default PublishForm;