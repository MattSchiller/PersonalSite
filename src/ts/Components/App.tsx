import Menu from "@Components/Menu";
import SimTypeContainer from "@Components/SimTypeContainer";
import IStore, { IPage } from "@Interfaces/IStore";
import React from "react";
import { connect } from "react-redux";

class App extends React.PureComponent<IStore> {
    public render() {
        return [
            <Menu key={ "menu" } items={ this.props.pages } />,
            <SimTypeContainer key={ "content" } { ...getActivePage(this.props) } />
        ];
    }
}

function getActivePage(state: IStore): IPage {
    return state.pages.filter((page: IPage) => page.pageId === state.activePageId)[0];
}

const mapStateToProps = (state: IStore) => ({ ...state });

export default connect(
    mapStateToProps
)(App);
