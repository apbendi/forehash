import React from 'react';
import { drizzleConnect } from 'drizzle-react';

const LoadingContainer = props => {
    let isWeb3Ready = props.web3Info.status === "initialized" &&
                                props.web3Info.networkId !== undefined;

    let isInvalidNetwork = isWeb3Ready && true;
                            //!isValidNetwork(this.props.web3Info.networkId);

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

    if (isInvalidNetwork) {
        return (
            <div>
                Invalid Network
            </div>
        );
    } else if(isWeb3Failure) {
        return (
            <div>
                No Web 3
            </div>
        );
    } else if(isLoadingDrizzle) {
        return (
            <div>
                Loading....
            </div>
        );
    }

    return Children.only(props.children);
}

const mapStateToProps = state => {
    return {
        accounts: state.accounts,
        drizzleStatus: state.drizzleStatus,
        web3Info: state.web3,
    };
};

export default drizzleConnect(LoadingContainer, mapStateToProps);
