import React from "react";
import { IMenuItem } from "@Components/Menu";
// import CSS from "@Sass/sublimeMonokai.scss";

export interface IMenuItemProps extends IMenuItem {
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
                { this.props.display }
            </li >
        );
    }

    private _getClassName(): string {
        return this.props.isSelected ? "current" : "";
    }
}
