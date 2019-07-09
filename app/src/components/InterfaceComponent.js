import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import SubmissionsList from './sublist/SubmissionsList';
import SubmissionFlow from './submission/SubmissionFlow';
import RevelationForm from './revelation/RevelationForm';
import NotFound from './NotFound';
import Navigation from './Navigation';
import SubmissionsContainer from './SubmissionsContainer';
import Home from './Home';
import FullList from './full_list/FullList';

class InterfaceComponent extends Component {

  constructor(props, _context) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navigation account={this.props.accounts[0]} />
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/activity" component={FullList} />

            <Route path="/:subid(\d+)/reveal" render={(props) => {
                        return (<SubmissionsContainer {...props}
                                                      account={this.props.accounts[0]}
                                                      component={RevelationForm}/>);
                      }} />

            <Route path="/:account(0x[a-fA-F0-9]{40})/:subid(\d+)" render={(props) => {
                        return (<SubmissionsContainer {...props}
                                                      account={props.match.params.account}
                                                      component={SubmissionsList}/>);
                      }} />

            <Route path="/:account(0x[a-fA-F0-9]{40})" render={(props) => {
                        return (<SubmissionsContainer {...props}
                                                      account={props.match.params.account}
                                                      component={SubmissionsList}/>);
                      }}/>
            <Route path="/new" component={SubmissionFlow} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default InterfaceComponent;
