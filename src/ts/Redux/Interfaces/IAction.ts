import { TextSegment } from "@SimType/TextSegment";
import { ISimTypeStatus } from "@SimType/ISimTypeContent";
import { IThemeEnum } from "@Helpers/IThemeEnum";
import { ActionTypeEnum, ActionType } from "@Redux/ActionTypes";

export interface ISetActivePagePayload {
    pageId: string;
}

export interface ITypedContentPayload {
    [key: string]: any;
    contentIndex: number;
    textSegments: TextSegment[];
    status: ISimTypeStatus;
}

export interface IUpdateTypedContentPayload
    extends ISetActivePagePayload, ITypedContentPayload {
    simTypeId: string;
}

interface IBaseAction {
    type: ActionType;
}

export interface IContentAction extends IBaseAction {
    payload: IUpdateTypedContentPayload;
}

export interface IThemeAction extends IBaseAction {
    payload: IThemeEnum;
}
