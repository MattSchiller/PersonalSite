import { ActionTypes } from "@Redux/Actions";
import { TextSegment } from "@SimType/TextSegment";
import { ISimTypeStatus } from "@SimType/ISimTypeContent";

export interface IAction {
    type: ActionTypes;
    payload: ISetActivePagePayload | IUpdateTypedContentPayload;
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

export interface IUpdateTypedContentPayload extends ISetActivePagePayload, ITypedContentPayload {
    simTypeId: string;
}