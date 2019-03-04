import { IRawPage } from "@Redux/Interfaces/IStore";
import React from "react";

export const resumePageId: string = "resume";

function getResumeUrl(): string {
    return "http://MatthewSchiller.com/assets/MattSchiller_CV.pdf";
}

// A dummy export so other aspects of the page outside of the menu don't know that resume is "different".
export const Resume: IRawPage = {
    pageId: resumePageId,
    pageTitle: "resume.pdf",
    iconUrl: "assets/images/pdfIcon.png",
    language: "n/a",
    simTypes: [{
        simTypeId: resumePageId,
        sourceText: ""
    }]
};

export function renderResume(): () => JSX.Element {
    // We use this google drive link to render in some mobile browsers.
    return () => <embed src={ "https://drive.google.com/viewerng/viewer?embedded=true&url=" + getResumeUrl() } />;
}
