import { IMenuItem } from "@Components/Menu";
import MenuItemComponent from "@Components/MenuItem";
import IAction from "@Interfaces/IAction";
import IStore from "@Interfaces/IStore";
import Resume from "@Pages/Resume";
import ActionTypes from "@Redux/Actions";
import { connect } from 'react-redux';
import { Dispatch } from "redux";

const mapStateToProps = (state: IStore, ownProps: IMenuItem) => {
    return {
        ...ownProps,
        isSelected: state.activePageId === ownProps.pageId
    };
}

const mapDispatchToProps = (dispatch: Dispatch<IAction>, ownProps: IMenuItem) => {
    return {
        onClick: () => {
            // For the resume, open a new tab and don't interact with the store, otherwise, dispatch.
            if (Resume.isResumeId(ownProps.pageId))
                window.open(Resume.getResumeUrl(), "_blank");
            else
                dispatch({
                    type: ActionTypes.SET_ACTIVE_PAGE,
                    payload: { pageId: ownProps.pageId }
                });
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuItemComponent);
