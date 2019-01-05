import IAction, { IUpdateTypedContentPayload } from "@Interfaces/IAction";
import ActionTypes from "@Redux/actions";
import IStore from "@Interfaces/IStore";
import ISimTypeContent from "@Interfaces/ISimTypeContent";

const defaultState: IStore = {
    activePageId: "NULL",
    pages: {}
};

export default (state: IStore = defaultState, action: IAction) => {
    if (!action.payload) return state;
    console.log("action:", action);

    const pageId = action.payload.pageId;

    switch (action.type) {
        case ActionTypes.SET_ACTIVE_PAGE:
            if (pageId !== state.activePageId)
                return {
                    ...state,
                    activePage: pageId
                };
            break;

        case ActionTypes.UPDATE_SIMTYPE_CONTENT:
            if (pageId === state.activePageId) {
                const payload: IUpdateTypedContentPayload = action.payload as IUpdateTypedContentPayload;

                const updatedPage: ISimTypeContent = {
                    ...state.pages[pageId],
                    contentIndex: payload.contentIndex,
                    textSegments: payload.textSegments
                };

                const pages = {
                    ...state.pages,
                    [pageId]: updatedPage
                };

                return {
                    ...state,
                    pages
                };
            }
            break;
    }

    return state;
};
