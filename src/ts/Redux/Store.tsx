import { IThemeEnum } from "@Helpers/IThemeEnum";
import { IPage, IStore } from "@Redux/Interfaces/IStore";
import { contentReducer } from "@Redux/Reducers/contentReducer";
import { themeReducer } from "@Redux/Reducers/themeReducer";
import { createStore, Store, combineReducers } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension";

export const store: Store = createStore(
    combineReducers({
        content: contentReducer,
        theme: themeReducer,
    }),
    devToolsEnhancer({})
);

export function getPages(): IPage[] {
    return (store.getState() as IStore).content.pages;
}

export function getActivePageId(): string {
    return (store.getState() as IStore).content.activePageId;
}

export function getActivePage(): IPage {
    const state: IStore = store.getState();
    return state.content.pages.filter((page: IPage) => page.pageId === getActivePageId())[0];
}

export function getValidPageIds(): string[] {
    const state: IStore = store.getState();
    return state.content.pages.map(page => page.pageId);
}

export function getActiveTheme(): IThemeEnum {
    const state: IStore = store.getState();
    return state.theme.activeTheme;
}
