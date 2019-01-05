import IAction, { IUpdateTypedContentPayload } from "@Interfaces/IAction";
import ActionTypes from "@Redux/actions";
import IStore, { IPage } from "@Interfaces/IStore";
import InitialState from "@Redux/InitialState";

export default (state: IStore = InitialState, action: IAction) => {
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
