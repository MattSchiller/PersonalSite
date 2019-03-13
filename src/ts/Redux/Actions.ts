import { ISetActivePagePayload, ITypedContentPayload } from "@Redux/Interfaces/IAction";
import { store } from "@Redux/Store";
import { IThemeEnum } from "@Helpers/IThemeEnum";
import { ActionTypeEnum } from "@Redux/ActionTypes";

export const Actions = {
    setActivePage: (payload: ISetActivePagePayload) =>
        store.dispatch({
            type: ActionTypeEnum.SET_ACTIVE_PAGE,
            payload
        }),

    setActiveTheme: (payload: IThemeEnum) =>
        store.dispatch({
            type: ActionTypeEnum.SET_ACTIVE_THEME,
            payload
        }),

    updateSimTypeContent: (
        pageId: string,
        simTypeId: string,
        updatedContent: ITypedContentPayload
    ) => store.dispatch({
        type: ActionTypeEnum.UPDATE_SIMTYPE_CONTENT,
        payload: {
            pageId,
            simTypeId,
            ...updatedContent
        }
    }),
};
