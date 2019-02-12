import { IRawPage } from "@TS/Redux/Interfaces/IStore";

const resumePageId: string = "resume.pdf";

export class Resume {
    public static isResumeId(pageId: string): boolean {
        return pageId === resumePageId;
    }

    public static getResumeUrl(): string {
        return "./assets/MattSchillerCV.pdf";
    }
}

// A dummy export so other aspects of the page outside of the menu don't know that resume is "different".
export const ResumePage: IRawPage = {
    pageId: resumePageId,
    iconUrl: "assets/images/pdfIcon.png",
    simTypes: [{
        simTypeId: "resume",
        sourceText: ""
    }]
}
