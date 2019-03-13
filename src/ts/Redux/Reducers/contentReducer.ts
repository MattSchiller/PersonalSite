import { initialState } from "@Redux/InitialState";
import { IContentAction, IUpdateTypedContentPayload } from "@Redux/Interfaces/IAction";
import { IPage, IStoreContent } from "@Redux/Interfaces/IStore";
import { ISimTypeContent } from "@SimType/ISimTypeContent";
import { ActionTypeEnum } from "@Redux/ActionTypes";

export function contentReducer(content: IStoreContent = initialState.content, action: IContentAction) {
    const payload = action.payload;
    if (!payload)
        return content;

    const pageId = payload.pageId;

    switch (action.type) {
        case ActionTypeEnum.SET_ACTIVE_PAGE:
            if (pageId !== content.activePageId)
                return {
                    ...content,
                    activePageId: pageId
                };
            break;

        case ActionTypeEnum.UPDATE_SIMTYPE_CONTENT:
            if (pageId === content.activePageId) {
                const pages = content.pages.map((page: IPage) =>
                    getUpdatedPage(page, payload));

                return {
                    ...content,
                    pages: [...pages]
                };
            }
            break;
    }

    return content;
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
