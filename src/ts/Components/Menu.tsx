import React from "react";
import CSS from "@Sass/sublimeMonokai.scss";
import MenuItemContainer from "@Components/MenuItemContainer";
import { IPage } from "@Interfaces/IStore";


export interface IMenuProps {
    items: IPage[];
}

export default class Menu extends React.PureComponent<IMenuProps> {
    public render() {
        return (
            <nav className={ CSS.tabs }>
                { this.props.items.map(this._createNavItem, this) }
            </nav>
        );
    }

    private _createNavItem(menuItem: IPage, key: number): JSX.Element {
        return (
            <MenuItemContainer
                key={ key }
                { ...menuItem }
            />
        );
    }
}
