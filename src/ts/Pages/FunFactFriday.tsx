import { IRawPage, IStore, IActivePageProps } from "@Redux/Interfaces/IStore";
import CSS from "@Sass/styles.scss";
import React from "react";
import { Spinner } from "@Components/Spinner";
import { connect } from "react-redux";

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

class FunFactFridayComponent extends React.PureComponent<IActivePageProps, IFunFactFridayComponentState> {
    constructor(props: any) {
        super(props);
        this.state = { iFrameLoaded: false };
    }

    private _iFrame: JSX.Element | null = null;

    private _initializeIFrame(): JSX.Element {
        return <iframe
            key="fff"
            src={ getFFFUrl() }
            onLoad={ this._showComponent }
            frameBorder={ "0" }
            sandbox="allow-scripts"
        />
    }

    public render() {
        const shouldRender: boolean = this.props.activePageId === fffPageId;
        if (shouldRender && !this._iFrame)
            this._iFrame = this._initializeIFrame();

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
            <div className={ iFrameClassName }>
                { this._iFrame }
            </div>
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
