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
        return this._renderSimTypeComponents();
    }

    private _renderSimTypeComponents(): JSX.Element[] {
        if (!this.props.simTypes)
            return [];

        return this.props.simTypes.map((simType: ISimTypeContent, index: number) =>
            <SimTypeComponent
                key={ index }
                pageId={ this.props.pageId }
                { ...simType }
            />
        );
    }
}
