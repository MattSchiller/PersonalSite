import { ISimTypeContent, IRawSimTypeContent } from "@SimType/ISimTypeContent";
import { IThemeEnum } from "@Helpers/IThemeEnum";

export interface IStore {
    theme: IStoreTheme;
    content: IStoreContent;
}

export interface IStoreContent extends IActivePageProps {
    pages: IPage[];
}

export interface IStoreTheme {
    activeTheme: IThemeEnum;
}

export interface IActivePageProps {
    activePageId: string;
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
