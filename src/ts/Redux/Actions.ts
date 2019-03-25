import { IThemeEnum } from "@Helpers/IThemeEnum";
import { ActionTypes } from "@Redux/ActionTypes";
import { ISetActivePagePayload, ITypedContentPayload } from "@Redux/Interfaces/IAction";
import { store } from "@Redux/Store";

export const Actions = {
    setActivePage: (payload: ISetActivePagePayload) =>
        store.dispatch({
            type: ActionTypes.SET_ACTIVE_PAGE,
            payload
        }),

    setActiveTheme: (payload: IThemeEnum) =>
        store.dispatch({
            type: ActionTypes.SET_ACTIVE_THEME,
            payload
        }),

    updateSimTypeContent: (
        pageId: string,
        simTypeId: string,
        updatedContent: ITypedContentPayload
    ) => store.dispatch({
        type: ActionTypes.UPDATE_SIMTYPE_CONTENT,
        payload: {
            pageId,
            simTypeId,
            ...updatedContent
        }
    }),
};
