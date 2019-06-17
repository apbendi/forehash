import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ConfirmForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            input: "",
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
    }

    handleChange(event) {
        event.preventDefault();

        this.setState({
           input: event.target.value,
        });
    }

    handleConfirm(event) {
        event.preventDefault();
        this.props.onConfirm(this.state.input);
    }

    render() {
        return (
            <div>
                <p>
                Confirm you've backed up your prediction text by entering the random letters that were added to the end. 
                You can find them between the curly braces.
                </p>

                <div className="form-group">
                    <input type="text" 
                            className="form-control"
                            placeholder="Random String From Your Backup"
                            value={this.state.randomInput}
                            onChange={this.handleChange}
                            />
                                        
                    <small>
                        {this.props.error}
                    </small>

                    <br />

                    <button type="button"
                            className="btn btn-primary"
                            onClick={this.handleConfirm} 
                            disabled={!this.props.isEnabled} >
                        Confirm
                    </button>
                </div>
            </div>
        );
    }
}

ConfirmForm.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    error: PropTypes.string,
    isEnabled: PropTypes.bool.isRequired,
};

export default ConfirmForm;
