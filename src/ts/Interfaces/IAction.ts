import ActionTypes from "@Redux/actions";

export default interface IAction {
    type: ActionTypes;
    payload: any;
}
