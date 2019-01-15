import { MenuItem } from "@Components/MenuItem";
import { IPage } from "@Interfaces/IStore";
import CSS from "@Sass/sublimeMonokai.scss";
import React from "react";

interface IMenuProps {
    items: IPage[];
}

export class Menu extends React.PureComponent<IMenuProps> {
    public render() {
        return (
            <nav className={ CSS.tabs }>
                { this.props.items.map(this._renderMenuItem, this) }
            </nav>
        );
    }

    private _renderMenuItem(menuItem: IPage, key: number): JSX.Element {
        return (
            <MenuItem
                key={ key }
                { ...menuItem }
            />
        );
    }
}
