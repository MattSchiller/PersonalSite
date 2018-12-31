import IAction from "@Interfaces/IAction";
import ActionTypes from "@Redux/actions";
import IStore from "@Interfaces/IStore";

const defaultState: IStore = {
    activePageId: "NULL",
    pages: {}
};

export default (state: IStore = defaultState, action: IAction) => {
    switch (action.type) {
        case ActionTypes.SET_ACTIVE_PAGE:
            return {
                ...state,
                activePage: action.payload
            }
        default:
            return state
    }
}
