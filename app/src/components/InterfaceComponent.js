import React, { Component } from 'react';
import SubmissionForm from './SubmissionForm';
import SubmissionsList from './SubmissionsList';

class InterfaceComponent extends Component {

  constructor(props, context) {
    super(props);

    this.accounts = props.accounts;
  }

  render() {
    return (
      <div className="App">
        <SubmissionForm />
        <SubmissionsList />
      </div>
    );
  }
}

export default InterfaceComponent;
