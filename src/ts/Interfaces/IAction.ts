import ActionTypes from "@Redux/actions";

export default interface IAction {
    type: ActionTypes;
    payload: IActionPayload;
}

interface IActionPayload {
    pageId: string;
    contentIndex?: number;
}
