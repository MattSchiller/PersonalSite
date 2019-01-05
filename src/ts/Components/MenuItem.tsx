import React from "react";
import { IPage } from "@Interfaces/IStore";
// import CSS from "@Sass/sublimeMonokai.scss";

export interface IMenuItemProps extends IPage {
    isSelected: boolean;
    onClick: () => void;
}

export default class MenuItem extends React.PureComponent<IMenuItemProps> {
    public render() {
        return (
            <li
                onClick={ this.props.onClick }
                className={ this._getClassName() }
            >
                { this.props.pageId }
            </li >
        );
    }

    private _getClassName(): string {
        return this.props.isSelected ? "current" : "";
    }
}
