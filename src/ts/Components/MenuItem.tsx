import { IPage } from "@Interfaces/IStore";
import Resume from "@Pages/Resume";
import { Actions } from "@Redux/Actions";
import { getActivePageId } from "@Redux/Store";
import CSS from "@Sass/sublimeMonokai.scss";
import React from "react";

export class MenuItem extends React.PureComponent<IPage> {
    public render() {
        return (
            <li
                onClick={ this._onClick }
                className={ this._getClassName() }
            >
                { this.props.pageId }
            </li >
        );
    }

    private _getClassName(): string {
        return this.props.pageId === getActivePageId() ? CSS.current : "";
    }

    private _onClick = () => {
        // For the resume, open a new tab and don't interact with the store, otherwise, dispatch.
        if (Resume.isResumeId(this.props.pageId))
            window.open(Resume.getResumeUrl(), "_blank");
        else
            Actions.setActivePage({ pageId: this.props.pageId });
    }
}
