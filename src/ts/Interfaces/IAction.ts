import ActionTypes from "@Redux/actions";
import TextSegment from "@SimType/TextSegment";

export default interface IAction {
    type: ActionTypes;
    payload: ISetActivePagePayload | IUpdateTypedContentPayload;
}

interface ISetActivePagePayload {
    pageId: string;
}

export interface ITypedContentPayload {
    contentIndex: number;
    textSegments: TextSegment[];
}

export interface IUpdateTypedContentPayload extends ISetActivePagePayload, ITypedContentPayload { }
