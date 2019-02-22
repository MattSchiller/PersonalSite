import { SimTypeComponent } from "@Components/SimTypeComponent";
import { IPage } from "@Redux/Interfaces/IStore";
import CSS from "@Sass/styles.scss";
import { ISimTypeContent } from "@SimType/ISimTypeContent";
import React from "react";
import { getThemedClassName, IThemedProps, getActiveThemeProp } from "@Helpers/Theming";

export default class SimTypeContainer extends React.PureComponent<IPage & IThemedProps> {
    public render() {
        return (
            <div className={ this._getClassName() }>
                { this._renderSimTypeComponents() }
            </div>
        );
    }

    private _getClassName(): string {
        return `${CSS.simTypeContainer}
            ${getThemedClassName(`${CSS.simTypeContainer}-${this.props.language}`)}`;
    }

    private _renderSimTypeComponents(): JSX.Element[] {
        if (!this.props.simTypes)
            return [];

        return this.props.simTypes.map((simType: ISimTypeContent, index: number) =>
            <SimTypeComponent
                key={ this.props.pageId + index }
                pageId={ this.props.pageId }
                { ...simType }
                { ...getActiveThemeProp() }
            />
        );
    }
}
