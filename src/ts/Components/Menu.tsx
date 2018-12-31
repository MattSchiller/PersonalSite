import React from "react";
import CSS from "@Sass/sublimeMonokai.scss";
import Resume from "@Pages/Resume";

interface IMenuItemProps {
    pageId: string;
    display: string;
}

interface IMenuProps {
    items: IMenuItemProps[];
    onMenuClick: (pageId: string) => {};
}

export default class Menu extends React.PureComponent<IMenuProps> {
    public render() {
        return (
            <nav className={ CSS.tabs }>
                { this.props.items.map(this._createNavItem, this) }
            </nav>
        )
    }

    private _onClick = (menuItem: IMenuItem) => {
        if (Resume.isResumeId(menuItem.pageId))
            window.open(Resume.getResumeUrl(), "_blank");
        else
            this.props.onMenuClick(menuItem.pageId);
    }

    private _createNavItem(menuItem: IMenuItem, key: number) {
        return (
            <li key={ key }
                onClick={ this._onClick {

                }.bind(this)
    }
    className = { i == this.props.currInd ? "current" : ""
}
            >
    <span>{ item }</span>
            </li >
        )
    }.bind(this));

return (<ul> { myItems }</ul >);
    }

}

class MenuItem extends React.PureComponent