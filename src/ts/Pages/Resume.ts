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

export const ResumePage: IRawPage = {
    pageId: resumePageId,
    simTypes: [{
        simTypeId: "resume",
        sourceText: ""
    }]
}
