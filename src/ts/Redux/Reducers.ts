import { IAction, IUpdateTypedContentPayload } from "@Interfaces/IAction";
import { IPage, IStore } from "@Interfaces/IStore";
import { ActionTypes } from "@Redux/Actions";
import { initialState } from "@Redux/InitialState";
import { ISimTypeContent } from "@SimType/ISimTypeContent";

export const rootReducer = (state: IStore = initialState, action: IAction) => {
    if (!action.payload)
        return state;
    console.log("action:", action);

    const pageId = action.payload.pageId;

    switch (action.type) {
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
                    getUpdatedPage(page, action.payload as IUpdateTypedContentPayload));

                return {
                    ...state,
                    pages
                };
            }
            break;
    }

    return state;
};

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
            }
        } else
            return simType;
    });
}
