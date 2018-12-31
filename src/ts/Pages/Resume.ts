export default class Resume {
    public static isResumeId(pageId: string): boolean {
        return pageId === "resume";
    }

    public static getResumeUrl(): string {
        return "./assets/MattSchillerCV.pdf";
    }
}
