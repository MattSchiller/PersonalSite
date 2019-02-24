import { IAction, IUpdateTypedContentPayload, ISetActivePagePayload } from "@Redux/Interfaces/IAction";
import { IPage, IStore } from "@Redux/Interfaces/IStore";
import { ActionTypes } from "@Redux/Actions";
import { initialState } from "@Redux/InitialState";
import { ISimTypeContent } from "@SimType/ISimTypeContent";
import { IThemeEnum } from "@Helpers/IThemeEnum";

export function rootReducer(state: IStore = initialState, action: IAction) {
    const payload = action.payload;
    if (!payload)
        return state;

    // This is helpful for the page-specific actions.
    const pageId = (payload as ISetActivePagePayload).pageId;

    switch (action.type) {
        case ActionTypes.SET_ACTIVE_THEME:
            const activeTheme = payload as IThemeEnum;
            if (Object.values(IThemeEnum).includes(activeTheme) && activeTheme !== state.activeTheme)
                return {
                    ...state,
                    activeTheme
                };
            break;

        case ActionTypes.SET_ACTIVE_PAGE:
            if (pageId !== state.activePageId)
                return {
                    ...state,
                    activePageId: pageId
                };
            break;

        case ActionTypes.UPDATE_SIMTYPE_CONTENT:
            if (pageId === state.activePageId) {
                const pages = state.pages.map((page: IPage) =>
                    getUpdatedPage(page, payload as IUpdateTypedContentPayload));

                return {
                    ...state,
                    pages: [...pages]
                };
            }
            break;
    }

    return state;
}

function getUpdatedPage(page: IPage, payload: IUpdateTypedContentPayload): IPage {
    return (page.pageId !== payload.pageId ? page :
        {
            ...page,
            simTypes: getUpdatedSimTypes(page.simTypes, payload)
        }
    );
}

function getUpdatedSimTypes(
    simTypes: ISimTypeContent[] | undefined,
    payload: IUpdateTypedContentPayload
): ISimTypeContent[] | undefined {
    if (!simTypes)
        return simTypes;

    return simTypes.map((simType: ISimTypeContent) => {
        if (simType.simTypeId === payload.simTypeId) {
            return {
                ...simType,
                contentIndex: payload.contentIndex,
                textSegments: payload.textSegments,
                status: { ...payload.status }
            };
        } else
            return simType;
    });
}
