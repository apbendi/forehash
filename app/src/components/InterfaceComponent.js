import React, { Component } from 'react';

import {
  AccountData,
  ContractData,
  ContractForm,
} from "drizzle-react-components";

class InterfaceComponent extends Component {

  constructor(props, context) {
    super(props);

    this.accounts = props.accounts;
  }

  render() {
    return (
      <div className="App">
        Hello {this.props.accounts[0]}
      </div>
    );
  }
}

export default InterfaceComponent;
