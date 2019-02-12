import { ISimTypeContent, IRawSimTypeContent } from "@SimType/ISimTypeContent";

export interface IStore {
    activePageId: string;
    pages: IPage[];
}

export interface IPage {
    pageId: string;
    iconUrl?: string;
    simTypes?: ISimTypeContent[];
}

export interface IRawPage {
    pageId: string;
    iconUrl?: string;
    simTypes?: IRawSimTypeContent[];
}
