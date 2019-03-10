import { IRawPage } from "@Redux/Interfaces/IStore";
import CSS from "@Sass/styles.scss";
import React from "react";
import { Spinner } from "@Components/Spinner";

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
    hidden: boolean;
}

export class FunFactFridayComponent extends React.PureComponent<{}, IFunFactFridayComponentState> {
    constructor(props: any) {
        super(props);
        console.log("RECONSTRXUTING")
        this.state = { hidden: true };
    }

    public render() {
        const iFrameClassName: string = this.state.hidden ? CSS.hidden : "";
        const spinnerClassName: string = this.state.hidden ? "" : CSS.hidden;

        return [
            <Spinner key="spinner" className={ spinnerClassName } />,
            <iframe
                key="fff"
                className={ iFrameClassName }
                src={ getFFFUrl() }
                onLoad={ this._showComponent }
                frameBorder={ "0" }
                sandbox="allow-scripts"
            />
        ];
    }

    private _showComponent = () => {
        this.setState({ hidden: false });
    }
}
