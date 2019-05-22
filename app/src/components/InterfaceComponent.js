import React, { Component } from 'react';
import {
  AccountData,
  ContractData,
  ContractForm,
} from "drizzle-react-components";
import SubmissionForm from './SubmissionForm';

class InterfaceComponent extends Component {

  constructor(props, context) {
    super(props);

    this.accounts = props.accounts;
  }

  render() {
    return (
      <div className="App">
        <SubmissionForm />
      </div>
    );
  }
}

export default InterfaceComponent;
