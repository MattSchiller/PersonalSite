import { IRawPage } from "@Redux/Interfaces/IStore";
import React from "react";

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

export function renderFunFactFriday(): () => JSX.Element {
    return () => <iframe
        src={ getFFFUrl() }
        frameBorder={ "0" }
        sandbox="allow-scripts"
    />
}