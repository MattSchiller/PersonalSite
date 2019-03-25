import { Actions } from "@Redux/Actions";
import { IPage } from "@Redux/Interfaces/IStore";
import CSS from "@Sass/styles.scss";
import { history } from "@Helpers/History";
import React from "react";

interface IMenuItemProps extends IPage {
    isSelected: boolean;
}

export class MenuItem extends React.PureComponent<IMenuItemProps> {
    public render() {
        return (
            <li
                onClick={ this._onClick }
                className={ this._getClassName() }
            >
                <img src={ this.props.iconUrl } />
                { this.props.pageTitle }
            </li >
        );
    }

    private _getClassName(): string {
        return this.props.isSelected ? CSS.selected : "";
    }

    private _onClick = () => history.push(this.props.pageId);
}
