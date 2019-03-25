import { IThemeEnum } from "@Helpers/IThemeEnum";
import { About } from "@Pages/About";
import { Contact } from "@Pages/Contact";
import { FunFactFriday } from "@Pages/FunFactFriday";
import { Projects } from "@Pages/Projects";
import { Resume } from "@Pages/Resume";
import { IPage, IRawPage, IStore, IStoreContent, IStoreTheme } from "@Redux/Interfaces/IStore";
import { IRawSimTypeContent, ISimTypeContent, ISimTypeStatus } from "@SimType/ISimTypeContent";

export const initialState = getInitialState();

function getInitialState(): IStore {
    const pages: IPage[] = [
        About,
        Projects,
        Contact,
        Resume,
        FunFactFriday,
    ].map(cleanUpRawPage);

    const content: IStoreContent = {
        activePageId: pages.length > 0 ? pages[0].pageId : "NULL",
        pages,
    };

    const theme: IStoreTheme = {
        activeTheme: IThemeEnum.DARK_PLUS,
    };

    return {
        content,
        theme,
    };
}

function cleanUpRawPage(page: IRawPage): IPage {
    if (!page.simTypes)
        return page as IPage;

    const simTypes = page.simTypes.map(initializeSimTypeContent);

    return {
        ...page,
        simTypes
    };
}

function initializeSimTypeContent(rawSimType: IRawSimTypeContent): ISimTypeContent {
    return {
        ...rawSimType,
        contentIndex: 0,
        textSegments: [],
        status: getInitialSimTypeStatus()
    };
}

function getInitialSimTypeStatus(): ISimTypeStatus {
    return {
        isBackspacing: false,
        backspaceIterations: 0,
        isQuoting: false
    };
}
