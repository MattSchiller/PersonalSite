import IAction from "@Interfaces/IAction";
import ActionTypes from "@Redux/actions";
import IStore from "@Interfaces/IStore";
import IPage from "@Interfaces/IPage";

const defaultState: IStore = {
    activePageId: "NULL",
    pages: {}
};

export default (state: IStore = defaultState, action: IAction) => {
    switch (action.type) {
        case ActionTypes.SET_ACTIVE_PAGE:
            return {
                ...state,
                activePage: action.payload.pageId
            }

        case ActionTypes.SET_PAGE_INDEX:
            const pageId = action.payload.pageId;

            const newPage: IPage = {
                content: state.pages[pageId].content,
                contentIndex: action.payload.contentIndex || 0
            };

            const pages = {
                ...state.pages,
                [pageId]: newPage
            }

            return {
                ...state,
                pages
            }

        default:
            return state
    }
}
