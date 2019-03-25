import { IRawPage } from "@Redux/Interfaces/IStore";
import React from "react";

export const resumePageId: string = "resume";

function getResumeUrl(): string {
    return "http://MatthewSchiller.com/assets/MattSchiller_CV.pdf";
}

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

// We use this google drive link to render in some mobile browsers.
export const ResumeComponent = () =>
    <embed src={ "https://drive.google.com/viewerng/viewer?embedded=true&url=" + getResumeUrl() } />;
