import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import SubmissionsList from './SubmissionsList';
import SubmissionFlow from './submission/SubmissionFlow';
import NotFound from './NotFound';

class InterfaceComponent extends Component {

  constructor(props, context) {
    super(props);

    this.accounts = props.accounts;
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route path="/" component={SubmissionsList} exact />
            <Route path="/new" component={SubmissionFlow} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default InterfaceComponent;
 