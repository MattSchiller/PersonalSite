import { IPage, IStore } from "@Redux/Interfaces/IStore";
import { rootReducer } from "@Redux/Reducers";
import { createStore, Store } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension";

export const store: Store = createStore(rootReducer, devToolsEnhancer({}));

export function getActivePageId(): string {
    return (store.getState() as IStore).activePageId;
}

export function getActivePage(): IPage {
    const state: IStore = store.getState();
    return state.pages.filter((page: IPage) => page.pageId === getActivePageId())[0];
}

export function getValidPageIds(): string[] {
    const state: IStore = store.getState();
    return state.pages.map(page => page.pageId);
}
