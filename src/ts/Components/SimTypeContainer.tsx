import SimTypeComponent from "@Components/SimTypeComponent";
import { IPage } from "@Interfaces/IStore";
import { ISimTypeContent } from "@SimType/ISimTypeContent";
import React from "react";

export default class SimTypeContainer extends React.PureComponent<IPage> {
    public render() {
        // console.log("PAGE:", this.props.simTypes![0])
        return this._renderSimTypeComponents();
    }

    private _renderSimTypeComponents(): JSX.Element[] {
        if (!this.props.simTypes)
            return [];

        return this.props.simTypes.map((simType: ISimTypeContent, index: number) =>
            <SimTypeComponent
                key={ this.props.pageId + index }
                pageId={ this.props.pageId }
                { ...simType }
            />
        );
    }
}
