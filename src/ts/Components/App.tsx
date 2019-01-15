import { Menu } from "@Components/Menu";
import SimTypeContainer from "@Components/SimTypeContainer";
import { IStore } from "@Interfaces/IStore";
import { getActivePage, getActivePageId } from "@Redux/Store";
import React from "react";
import { connect } from "react-redux";

class App extends React.PureComponent<IStore> {
    public render() {
        return [
            <Menu key={ "menu" } items={ this.props.pages } activePageId={ getActivePageId() } />,
            <SimTypeContainer key={ "content" } { ...getActivePage() } />
        ];
    }
}

const mapStateToProps = (state: IStore) => ({ ...state });

export const AppContainer = connect(
    mapStateToProps
)(App);
