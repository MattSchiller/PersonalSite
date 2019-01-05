import React from "react";
import CSS from "@Sass/sublimeMonokai.scss";
import MenuItemContainer from "@Components/MenuItemContainer";

export interface IMenuItem {
    pageId: string;
    display: string;
}

export interface IMenuProps {
    items: IMenuItem[];
}

export default class Menu extends React.PureComponent<IMenuProps> {
    public render() {
        return (
            <nav className={ CSS.tabs }>
                <ul>
                    { this.props.items.map(this._createNavItem, this) }
                </ul>
            </nav>
        );
    }

    private _createNavItem(menuItem: IMenuItem, key: number): JSX.Element {
        return (
            <MenuItemContainer
                key={ key }
                { ...menuItem }
            />
        );
    }
}
