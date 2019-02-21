import { IPage } from "@Redux/Interfaces/IStore";
import { Resume } from "@Pages/Resume";
import { Actions } from "@Redux/Actions";
import CSS from "@Sass/styles.scss";
import React from "react";
import { Link } from "react-router-dom";
import { history } from "../history";

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

    private _onClick = () => {
        // For the resume, open a new tab and don't interact with the store, otherwise, dispatch.
        // if (Resume.isResumeId(this.props.pageId))
        //     window.open(Resume.getResumeUrl(), "_blank");
        // else
        history.push(this.props.pageId);
        Actions.setActivePage({ pageId: this.props.pageId });
    }
}
