import { IPage, IRawPage, IStore } from "@Redux/Interfaces/IStore";
import { About } from "@Pages/About";
import { Contact } from "@Pages/Contact";
import { IRawSimTypeContent, ISimTypeContent, ISimTypeStatus } from "@SimType/ISimTypeContent";
import { ResumePage } from "@TS/Pages/Resume";

export const initialState = getInitialState();

function getInitialState(): IStore {
    const pages: IPage[] = [
        About,
        Contact,
        ResumePage,
    ].map(cleanUpRawPage);

    const activePageId = pages.length > 0 ? pages[0].pageId : "NULL";

    return {
        activePageId,
        pages
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
