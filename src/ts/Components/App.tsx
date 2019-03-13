import { Menu } from "@Components/Menu";
import { RotateMobile } from "@Components/RotateMobile";
import { SimTypeContainer } from "@Components/SimTypeContainer";
import { getTrimmedPath as getPageIdFromPath, history } from "@Helpers/History";
import { getThemedClassName } from "@Helpers/Theming";
import { FunFactFridayComponent } from "@Pages/FunFactFriday";
import { ResumeComponent, resumePageId } from "@Pages/Resume";
import { Actions } from "@Redux/Actions";
import { IStoreTheme } from "@Redux/Interfaces/IStore";
import { getActiveTheme, isValidPageId } from "@Redux/Store";
import CSS from "@Sass/styles.scss";
import { Location } from "history";
import React from "react";
import { connect } from "react-redux";
import { Route, Router } from "react-router-dom";

class App extends React.PureComponent<IStoreTheme> {
    public componentWillMount() {
        this._initializeHistoryListener();
    }

    private _initializeHistoryListener() {
        history.listen((location: Location) => {
            const _inboundPageId = getPageIdFromPath(location);
            if (isValidPageId(_inboundPageId))
                Actions.setActivePage({ pageId: _inboundPageId });
            else
                history.block();
        });

        // Initial re-route upon entry to site.
        const inboundPageId = getPageIdFromPath(history.location);

        if (isValidPageId(inboundPageId))
            Actions.setActivePage({ pageId: inboundPageId });
        else
            history.replace("/about");
    }

    public render() {
        const simTypeUrls = "/(|index.html|about|contact|projects)";
        return (
            <div className={ getThemedClassName(CSS.content) }>
                <Menu key={ "menu" } />
                <Router history={ history } >
                    <div>
                        <Route
                            key={ "fff" }
                            component={ FunFactFridayComponent }
                        />
                        <Route
                            key={ "rotateMobile" }
                            path={ simTypeUrls }
                            component={ RotateMobile }
                        />
                        <Route
                            key={ "content" }
                            path={ simTypeUrls }
                            component={ SimTypeContainer }
                        />
                        <Route
                            key={ "resume" }
                            path={ `/${resumePageId}` }
                            component={ ResumeComponent }
                        />
                    </div>
                </Router >
            </div>
        );
    }
}

// This is needed to trigger updates from theme changes.
function mapStateToProps() {
    return {
        activeTheme: getActiveTheme(),
    };
}

const ConnectedApp = connect(mapStateToProps)(App);
export { ConnectedApp as App };
