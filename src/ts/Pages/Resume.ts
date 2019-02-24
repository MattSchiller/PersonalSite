import { IRawPage } from "@Redux/Interfaces/IStore";

const resumePageId: string = "resume";

export class Resume {
    public static isResumeId(pageId: string): boolean {
        return pageId === resumePageId;
    }

    public static getResumeUrl(): string {
        return "./assets/MattSchiller_CV.pdf";
    }
}

// A dummy export so other aspects of the page outside of the menu don't know that resume is "different".
export const ResumePage: IRawPage = {
    pageId: resumePageId,
    pageTitle: "resume.pdf",
    iconUrl: "assets/images/pdfIcon.png",
    language: "n/a",
    simTypes: [{
        simTypeId: "resume",
        sourceText: ""
    }]
};
