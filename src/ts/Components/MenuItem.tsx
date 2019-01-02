import React from "react";
// import CSS from "@Sass/sublimeMonokai.scss";
import { IMenuItemContainerProps } from "@Components/MenuItemContainer";

export interface IMenuItemProps extends IMenuItemContainerProps {
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
                { this.props.displayName }
            </li >
        );
    }

    private _getClassName(): string {
        return this.props.isSelected ? "current" : "";
    }
}
