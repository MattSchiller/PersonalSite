import ISimTypeContent from "@SimType/ISimTypeContent";

export default interface IStore {
    activePageId: string;
    pages: IPage[];
}

export interface IRawPage {
    pageId: string;
    sourceText: string;
}

export interface IPage extends IRawPage, ISimTypeContent { }
