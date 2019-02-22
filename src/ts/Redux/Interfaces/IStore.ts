import { ISimTypeContent, IRawSimTypeContent } from "@SimType/ISimTypeContent";
import { IThemesEnum } from "@TS/Helpers/Theming";

export interface IStore {
    activePageId: string;
    pages: IPage[];
    activeTheme: IThemesEnum;
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
