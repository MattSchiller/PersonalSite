import { ISimTypeContent, IRawSimTypeContent } from "@SimType/ISimTypeContent";
import { IThemedProps } from "@Helpers/Theming";

export interface IActivePageProps {
    activePageId: string;
}

export interface IStore extends IThemedProps, IActivePageProps {
    pages: IPage[];
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
