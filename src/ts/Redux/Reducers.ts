import { IAction, IUpdateTypedContentPayload } from "@Interfaces/IAction";
import { IPage, IStore } from "@Interfaces/IStore";
import { ActionTypes } from "@Redux/Actions";
import { initialState } from "@Redux/InitialState";

export const rootReducer = (state: IStore = initialState, action: IAction) => {
    if (!action.payload) return state;
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
                const payload: IUpdateTypedContentPayload = action.payload as IUpdateTypedContentPayload;

                const pages = state.pages.map((page: IPage) => {
                    return (page.pageId !== pageId ? page :
                        {
                            ...page,
                            contentIndex: payload.contentIndex,
                            textSegments: payload.textSegments
                        }
                    );
                });

                return {
                    ...state,
                    pages
                };
            }
            break;
    }

    return state;
};
