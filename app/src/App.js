import React, { Component } from "react";
import { DrizzleProvider } from "drizzle-react";
import "./App.css";
import drizzleOptions from "./drizzleOptions";
import InterfaceContainer from "./components/InterfaceContainer";

class App extends Component {
  render() {
    return (
      <DrizzleProvider options={drizzleOptions}>
          <InterfaceContainer />
      </DrizzleProvider>
    );
  }
}

export default App;
