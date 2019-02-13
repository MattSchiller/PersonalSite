import { ISimTypeContent, IRawSimTypeContent } from "@SimType/ISimTypeContent";

export interface IStore {
    activePageId: string;
    pages: IPage[];
}

interface IBasePage {
    pageId: string;
    iconUrl: string;
    language: string;
}

export interface IPage extends IBasePage {
    simTypes?: ISimTypeContent[];
}

export interface IRawPage extends IBasePage {
    simTypes?: IRawSimTypeContent[];
}
