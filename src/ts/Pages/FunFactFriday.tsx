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
        this.state = { iFrameLoaded: false };
    }

    private _iFrame: JSX.Element | undefined;

    public render() {
        const shouldRender: boolean = this.props.activePageId === fffPageId;

        // Since we want these components to persist in the DOM, but be hidden (wrapped in a spinner), we juggle hidden
        const funFactFridayComponentClassName: string = shouldRender ? "" : CSS.hidden;
        const spinnerClassName: string = this.state.iFrameLoaded ? CSS.hidden : "";
        const iFrameClassName: string = this.state.iFrameLoaded ? "" : CSS.hidden;

        // This limits the page from inserting the iFrame into the DOM until the user shows interest in the page.
        if (shouldRender && !this._iFrame)
            this._initializeIFrame();

        return (
            <div className={ funFactFridayComponentClassName }>
                <Spinner key="spinner" className={ spinnerClassName } />
                <div className={ iFrameClassName }>
                    { this._iFrame }
                </div>
            </div>
        );
    }

    private _initializeIFrame() {
        this._iFrame = (
            <iframe
                key="fff"
                src={ getFFFUrl() }
                onLoad={ this._showComponent }
                frameBorder={ "0" }
                sandbox="allow-scripts"
            />
        );
    }

    private _showComponent = () => this.setState({ iFrameLoaded: true });
}

function mapStateToProps(state: IStore) {
    return {
        activePageId: state.content.activePageId,
    };
}

const ConnectedFunFactFridayComponent = connect(mapStateToProps)(FunFactFridayComponent);
export { ConnectedFunFactFridayComponent as FunFactFridayComponent };
