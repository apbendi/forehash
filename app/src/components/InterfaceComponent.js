import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { drizzleConnect } from 'drizzle-react';
import SubmissionsList from './sublist/SubmissionsList';
import SubmissionFlow from './submission/SubmissionFlow';
import RevelationForm from './revelation/RevelationForm';
import NotFound from './NotFound';
import Navigation from './Navigation';
import Footer from './Footer';
import SubmissionsContainer from './SubmissionsContainer';
import Home from './Home';
import FullList from './full_list/FullList';
import LoadingIndicator from './LoadingIndicator';
import NoWeb3 from './load_status/NoWeb3';
import InvalidNetwork from './load_status/InvalidNetwork';

function isValidNetwork(networkId) {

  return networkId === 1 ||
                      (
                        ( window.location.href.includes("localhost") ||
                          window.location.href.includes("127.0.0.1") )
                                              && networkId > 1500000000000
                      );
}

const InterfaceComponent = props => {
  let isWeb3Ready = props.web3Info.status === "initialized" &&
                              props.web3Info.networkId !== undefined;

  let isInvalidNetwork = isWeb3Ready && !isValidNetwork(props.web3Info.networkId);

  let isWeb3Failure = props.web3Info.status === "failed" ||
                              // For some reason, web3 reports as initialized in Safari, w/o any
                              // MetaMask or web3 installation, but with a networkId property present and
                              // set to undefined. This combination of conditions allows us to identify
                              // this case in Safari without flashing the 'no web 3' interface while
                              // loading on browsers that do have web3
                              (
                                  props.web3Info.status === "initialized" &&
                                  Object.keys(props.accounts).length === 0 &&
                                  props.web3Info.hasOwnProperty('networkId') &&
                                  props.web3Info.networkId === undefined
                              );

  let isLoadingDrizzle = !props.drizzleStatus.initialized;

  var failureComp = null;

  if (isInvalidNetwork) {
    failureComp = InvalidNetwork;
  } else if(isWeb3Failure) {
    failureComp = NoWeb3;
  } else if(isLoadingDrizzle) {
    failureComp = LoadingIndicator;
  }

  var routes = "";

  if (null !== failureComp) {
    routes = (
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/" component={failureComp} />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/activity" component={FullList} />

            <Route path="/:subid(\d+)/reveal" render={(routeProps) => {
                        return (<SubmissionsContainer {...routeProps}
                                                      account={props.accounts[0]}
                                                      component={RevelationForm}/>);
                      }} />

            <Route path="/:account(0x[a-fA-F0-9]{40})/:subid(\d+)" render={(routeProps) => {
                        return (<SubmissionsContainer {...routeProps}
                                                      account={routeProps.match.params.account}
                                                      component={SubmissionsList}/>);
                      }} />

            <Route path="/:account(0x[a-fA-F0-9]{40})" render={(routeProps) => {
                        return (<SubmissionsContainer {...routeProps}
                                                      account={routeProps.match.params.account}
                                                      component={SubmissionsList}/>);
                      }}/>
            <Route path="/new" component={SubmissionFlow} />
            <Route component={NotFound} />
          </Switch>
    );
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Navigation account={props.accounts[0]} />
        {routes}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

const mapStateToProps = state => {
  return {
      accounts: state.accounts,
      drizzleStatus: state.drizzleStatus,
      web3Info: state.web3,
  };
};

export default drizzleConnect(InterfaceComponent, mapStateToProps);
