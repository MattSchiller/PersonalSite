import { Menu } from "@Components/Menu";
import SimTypeContainer from "@Components/SimTypeContainer";
import { IStore } from "@Redux/Interfaces/IStore";
import { getActivePage, getActivePageId, getValidPageIds } from "@Redux/Store";
import React from "react";
import { connect } from "react-redux";
import { Router, Route } from "react-router-dom";
import { history } from "../history";
import { Actions } from "@TS/Redux/Actions";

class App extends React.PureComponent<IStore> {
    public componentWillMount() {
        const path = history.location.pathname;
        const inboundPageId = path.substr(1, path.length - 1);

        if (getValidPageIds().includes(inboundPageId))
            Actions.setActivePage({ pageId: inboundPageId });
        else
            history.replace("");
    }

    public render() {
        return [
            <Router history={ history }>
                <Menu key={ "menu" }
                    items={ this.props.pages }
                    activePageId={ getActivePageId() }
                />
            </Router>,
            <Router history={ history } >
                <Route key="content"
                    path="/(|index.html|about|contact|projects)"
                    render={ props => <SimTypeContainer
                        { ...props }
                        { ...getActivePage() } /> }
                />
            </Router >
        ];
    }
}

const mapStateToProps = (state: IStore) => ({ ...state });

export const AppContainer = connect(
    mapStateToProps
)(App);
