import { Spinner } from "@Components/Spinner";
import { IActivePageProps, IRawPage, IStore } from "@Redux/Interfaces/IStore";
import CSS from "@Sass/styles.scss";
import React from "react";
import { connect } from "react-redux";
import { } from "react-router";

export const fffPageId: string = "fff";

function getFFFUrl(): string {
    return "https://funfactfridaysite.wordpress.com";
}

// A dummy export so other aspects of the page outside of the menu don't know that resume is "different".
export const FunFactFriday: IRawPage = {
    pageId: fffPageId,
    pageTitle: "trivia.rss",
    iconUrl: "assets/images/rssIcon.png",
    language: "n/a",
    simTypes: [{
        simTypeId: fffPageId,
        sourceText: ""
    }]
};

interface IFunFactFridayComponentState {
    iFrameLoaded: boolean;
}

class FunFactFridayComponent extends React.Component<IActivePageProps, IFunFactFridayComponentState> {
    constructor(props: any) {
        super(props);

        // TODO: Include check for "first" time hitting the fff route to create the iFrame.

        this.state = { iFrameLoaded: false };
    }

    public render() {
        const shouldRender: boolean = this.props.activePageId === fffPageId;
        const funFactFridayComponentClassName: string = shouldRender ? "" : CSS.hidden;
        const spinnerClassName: string = this.state.iFrameLoaded ? CSS.hidden : "";

        return (
            <div className={ funFactFridayComponentClassName }>
                <Spinner key="spinner" className={ spinnerClassName } />
                { this._renderIFrame() }
            </div>
        );
    }

    private _renderIFrame() {
        const iFrameClassName: string = this.state.iFrameLoaded ? "" : CSS.hidden;
        return (
            <iframe
                key="fff"
                src={ getFFFUrl() }
                className={ iFrameClassName }
                onLoad={ this._showComponent }
                frameBorder={ "0" }
                sandbox="allow-scripts"
            />
        );
    }

    private _showComponent = () => {
        this.setState({ iFrameLoaded: true });
    }
}

function mapStateToProps(state: IStore) {
    return {
        activePageId: state.activePageId,
    }
}

const ConnectedFunFactFridayComponent = connect(mapStateToProps)(FunFactFridayComponent);
export { ConnectedFunFactFridayComponent as FunFactFridayComponent };

