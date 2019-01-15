import { ActionTypes } from "@Redux/Actions";
import { TextSegment } from "@SimType/TextSegment";

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
}

export interface IUpdateTypedContentPayload extends ISetActivePagePayload, ITypedContentPayload {
    simTypeId: string;
}
