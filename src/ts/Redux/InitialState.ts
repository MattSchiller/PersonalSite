import { IPage, IRawPage, IStore } from "@Interfaces/IStore";
import { About } from "@Pages/About";
import { Contact } from "@Pages/Contact";
import { IRawSimTypeContent, ISimTypeContent } from "@SimType/ISimTypeContent";

export const initialState = getInitialState();

function getInitialState(): IStore {
    const pages: IPage[] = [
        About,
        Contact
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
        textSegments: []
    };
}
