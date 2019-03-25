import { initialState } from "@Redux/InitialState";
import { IContentAction, IContentPayload } from "@Redux/Interfaces/IAction";
import { IPage, IStoreContent } from "@Redux/Interfaces/IStore";
import { ISimTypeContent } from "@SimType/ISimTypeContent";
import { ActionTypes } from "@Redux/ActionTypes";

export function contentReducer(content: IStoreContent = initialState.content, action: IContentAction) {
    const payload = action.payload;
    if (!payload)
        return content;

    const pageId = payload.pageId;

    switch (action.type) {
        case ActionTypes.SET_ACTIVE_PAGE:
            if (pageId !== content.activePageId)
                return {
                    ...content,
                    activePageId: pageId
                };
            break;

        case ActionTypes.UPDATE_SIMTYPE_CONTENT:
            if (pageId === content.activePageId) {
                const pages = content.pages.map((page: IPage) =>
                    getUpdatedPage(page, payload));

                return {
                    ...content,
                    pages,
                };
            }
            break;
    }

    return content;
}

function getUpdatedPage(page: IPage, payload: IContentPayload): IPage {
    return (page.pageId !== payload.pageId ? page :
        {
            ...page,
            simTypes: getUpdatedSimTypes(page.simTypes, payload)
        }
    );
}

function getUpdatedSimTypes(
    simTypes: ISimTypeContent[] | undefined,
    payload: IContentPayload
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
