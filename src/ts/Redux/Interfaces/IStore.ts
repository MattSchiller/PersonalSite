import { ISimTypeContent, IRawSimTypeContent } from "@SimType/ISimTypeContent";
import { IThemeEnum } from "@TS/Helpers/IThemeEnum";

export interface IStore {
    activePageId: string;
    pages: IPage[];
    activeTheme: IThemeEnum;
}

interface IBasePage {
    pageId: string;
    pageTitle: string;
    iconUrl: string;
    language: string;
}

export interface IPage extends IBasePage {
    simTypes?: ISimTypeContent[];
}

export interface IRawPage extends IBasePage {
    simTypes?: IRawSimTypeContent[];
}
