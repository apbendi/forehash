import React, { Component } from "react";
import { DrizzleProvider } from "drizzle-react";
import { LoadingContainer } from "drizzle-react-components";

import "./App.css";

import drizzleOptions from "./drizzleOptions";
import InterfaceContainer from "./components/InterfaceContainer";

class App extends Component {
  render() {
    return (
      <DrizzleProvider options={drizzleOptions}>
        <LoadingContainer>
          <InterfaceContainer />
        </LoadingContainer>
      </DrizzleProvider>
    );
  }
}

export default App;
