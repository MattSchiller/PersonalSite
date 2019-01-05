import IAction, { IUpdateTypedContentPayload } from "@Interfaces/IAction";
import ActionTypes from "@Redux/actions";
import IStore, { IPage, IRawPage } from "@Interfaces/IStore";
import About from "@Pages/About";
import Contact from "@Pages/Contact";

export default getInitialStore();

function getInitialStore(): IStore {
    const pages = getPages();
    const activePageId = pages.length > 0 ? pages[0].pageId : "NULL";

    return {
        activePageId,
        pages
    }

}
function getPages(): IPage[] {
    return [
        About,
        Contact
    ].map((rawPage: IRawPage) => createPage(rawPage));
}

function createPage(importedPage: IRawPage): IPage {
    return {
        ...importedPage,
        contentIndex: 0,
        textSegments: []
    };
}