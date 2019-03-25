import { TextSegment } from "@SimType/TextSegment";
import { ISimTypeStatus } from "@SimType/ISimTypeContent";
import { IThemeEnum } from "@Helpers/IThemeEnum";
import { ActionTypes } from "@Redux/ActionTypes";

interface IBaseAction {
    type: ActionTypes;
}

export interface IContentAction extends IBaseAction {
    payload: IContentPayload;
}

export interface IThemeAction extends IBaseAction {
    payload: IThemeEnum;
}

export interface ISetActivePagePayload {
    pageId: string;
}

export interface ITypedContentPayload {
    [key: string]: any;
    contentIndex: number;
    textSegments: TextSegment[];
    status: ISimTypeStatus;
}

export interface IContentPayload
    extends ISetActivePagePayload, ITypedContentPayload {
    simTypeId: string;
}
