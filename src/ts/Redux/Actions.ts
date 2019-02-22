import { ISetActivePagePayload, ITypedContentPayload } from "@Redux/Interfaces/IAction";
import { store } from "@Redux/Store";
import { IThemesEnum } from "@Helpers/Theming";

export enum ActionTypes {
    SET_ACTIVE_PAGE = "SET_ACTIVE_PAGE",
    SET_ACTIVE_THEME = "SET_ACTIVE_THEME",
    UPDATE_SIMTYPE_CONTENT = "UPDATED_SIMTYPE_CONTENT",
}

export const Actions = {
    setActivePage: (payload: ISetActivePagePayload) =>
        store.dispatch({
            type: ActionTypes.SET_ACTIVE_PAGE,
            payload
        }),

    setActiveTheme: (payload: IThemesEnum) =>
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
}
