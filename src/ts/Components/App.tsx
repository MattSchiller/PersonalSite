import { Menu } from "@Components/Menu";
import SimTypeContainer from "@Components/SimTypeContainer";
import { IStore } from "@Redux/Interfaces/IStore";
import { getActivePage, getActivePageId, getValidPageIds } from "@Redux/Store";
import { history } from "@TS/history";
import { Resume } from "@TS/Pages/Resume";
import { Actions } from "@TS/Redux/Actions";
import React from "react";
import { connect } from "react-redux";
import { Route, Router } from "react-router-dom";

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
            <Menu key={ "menu" }
                items={ this.props.pages }
                activePageId={ getActivePageId() }
            />,
            <Router history={ history } >
                <div>
                    <Route key="content"
                        path="/(|index.html|about|contact|projects)"
                        render={ props => <SimTypeContainer
                            { ...props }
                            { ...getActivePage() } /> }
                    />
                    <Route key="resume"
                        path="/resume"
                        render={ props => <embed src={ Resume.getResumeUrl() } /> }
                    />
                </div>
            </Router >
        ];
    }
}

const mapStateToProps = (state: IStore) => ({ ...state });

export const AppContainer = connect(
    mapStateToProps
)(App);
