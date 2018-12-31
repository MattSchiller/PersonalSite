import { connect } from 'react-redux'
import ActionTypes from "@Redux/actions.js";
import { Dispatch } from "redux";
import IAction from "@Interfaces/IAction.js";
import IStore from "@Interfaces/IStore";
import MenuItem from "@Components/MenuItem";

export interface IMenuItemContainerProps {
    pageId: string;
    displayName: string;
}

const mapStateToProps = (state: IStore, ownProps: IMenuItemContainerProps) => {
    return {
        ...ownProps,
        isSelected: state.activePageId === ownProps.pageId
    };
}

const mapDispatchToProps = (dispatch: Dispatch<IAction>, ownProps: IMenuItemContainerProps) => {
    return {
        onClick: () => {
            dispatch({
                type: ActionTypes.SET_ACTIVE_PAGE,
                payload: { pageId: ownProps.pageId }
            })
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuItem)
