import React, { Component } from 'react';
import SubmissionsList from './SubmissionsList';
import SubmissionFlow from './submission/SubmissionFlow';

class InterfaceComponent extends Component {

  constructor(props, context) {
    super(props);

    this.accounts = props.accounts;
  }

  render() {
    return (
      <div className="App">
        <SubmissionFlow />
        <hr />
        <SubmissionsList />
      </div>
    );
  }
}

export default InterfaceComponent;
