import InterfaceComponent from "./InterfaceComponent";
import { drizzleConnect } from "@drizzle/react-plugin";

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    Bankshot: state.contracts.Bankshot,
    drizzleStatus: state.drizzleStatus,
  };
};

const InterfaceContainer = drizzleConnect(InterfaceComponent, mapStateToProps);

export default InterfaceContainer;
