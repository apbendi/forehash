import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Spinner } from 'react-bootstrap';

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
        var buttonContent = "Submit";

        if (this.props.isSubmissionPending) {
            buttonContent = (
                <span>
                    <Spinner as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true" />
                        {" "}Pending...
                </span>
            );
        }
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

                <Button variant="primary"
                        disabled={!this.props.isEnabled && !this.props.isSubmissionPending}
                        onClick={this.handleSubmit} >
                    {buttonContent}
                </Button>
            </div>
        );
    }
}

PublishForm.propTyptes = {
    hash: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isEnabled: PropTypes.bool.isRequired,
    isSubmissionPending: PropTypes.bool.isRequired,
}

export default PublishForm;