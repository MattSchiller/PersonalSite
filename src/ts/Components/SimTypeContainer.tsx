import SimTypeComponent from "@Components/SimTypeComponent";
import IAction, { ITypedContentPayload } from "@Interfaces/IAction";
import IStore, { IPage } from "@Interfaces/IStore";
import ActionTypes from "@Redux/actions";
import { Dispatch } from "react";
import { connect } from "react-redux";

const mapStateToProps = (state: IStore, ownProps: IPage) => ({ ...ownProps });

const mapDispatchToProps = (dispatch: Dispatch<IAction>, ownProps: IPage) => {
    return {
        updateTypedContent: (updatedContent: ITypedContentPayload) => dispatch({
            type: ActionTypes.UPDATE_SIMTYPE_CONTENT,
            payload: {
                ...updatedContent,
                pageId: ownProps.pageId
            }
        })
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SimTypeComponent);
