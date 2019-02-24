import { Menu } from "@Components/Menu";
import { SimTypeContainer } from "@Components/SimTypeContainer";
import { history } from "@Helpers/History";
import { Resume } from "@Pages/Resume";
import { Actions } from "@Redux/Actions";
import { IStore } from "@Redux/Interfaces/IStore";
import { getActivePage, getValidPageIds } from "@Redux/Store";
import CSS from "@Sass/styles.scss";
import { getThemedClassName } from "@Helpers/Theming";
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
        return (
            <div className={ getThemedClassName(CSS.content) }>
                <Menu key={ "menu" } />
                <Router history={ history } >
                    <div>
                        <Route
                            key={ "content" }
                            path={ "/(|index.html|about|contact|projects)" }
                            component={ SimTypeContainer }
                        />
                        <Route
                            key={ "resume" }
                            path={ "/resume" }
                            render={ this._renderResume() }
                        />
                    </div>
                </Router >
            </div>
        );
    }

    private _renderResume(): () => JSX.Element {
        return () => <embed src={ Resume.getResumeUrl() } />;
    }
}

// This is needed to trigger updates from theme changes.
function mapStateToProps(state: IStore) {
    return ({ ...state });
}

const ConnectedApp = connect(mapStateToProps)(App);
export { ConnectedApp as App };
