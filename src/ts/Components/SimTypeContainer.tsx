import SimTypeComponent from "@Components/SimTypeComponent";
import { IAction, ITypedContentPayload } from "@Interfaces/IAction";
import { IStore, IPage } from "@Interfaces/IStore";
import { ActionTypes, Actions } from "@Redux/Actions";
import { Dispatch } from "react";
import { connect } from "react-redux";
import React from "react";
import { ISimTypeContent } from "@SimType/ISimTypeContent";

export default class SimTypeContainer extends React.PureComponent<IPage> {
    public render() {
        return (
            <div >
                { this.props.simType.map() }
            </div>
        );
    }


}


function mapStateToProps(state: IStore, ownProps: IPage) {


    return {};
}
