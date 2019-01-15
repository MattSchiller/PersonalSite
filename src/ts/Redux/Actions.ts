import { ISetActivePagePayload, ITypedContentPayload } from "@Interfaces/IAction";
import { store } from "@Redux/Store";

export enum ActionTypes {
    SET_ACTIVE_PAGE = "SET_ACTIVE_PAGE",
    UPDATE_SIMTYPE_CONTENT = "UPDATED_SIMTYPE_CONTENT"
}

export const Actions = {
    setActivePage: (payload: ISetActivePagePayload) => {
        store.dispatch({
            type: ActionTypes.SET_ACTIVE_PAGE,
            payload: payload
        })
    },

    updateSimTypeContent: (simTypeId: string, updatedContent: ITypedContentPayload) => store.dispatch({
        type: ActionTypes.UPDATE_SIMTYPE_CONTENT,
        payload: {
            simTypeId,
            ...updatedContent
        }
    })
}
