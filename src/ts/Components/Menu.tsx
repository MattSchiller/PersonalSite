import { MenuItem } from "@Components/MenuItem";
import { IPage } from "@Redux/Interfaces/IStore";
import CSS from "@Sass/styles.scss";
import React from "react";
import { getThemedClassName } from "@TS/Helpers/Theming";
import { ThemeSelector } from "@TS/Components/ThemeSelector";
import { IThemeEnum } from "@TS/Helpers/IThemeEnum";

interface IMenuProps {
    items: IPage[];
    activePageId: string;
    activeTheme: IThemeEnum;
}

export class Menu extends React.PureComponent<IMenuProps> {
    public render() {
        return (
            <nav className={ getThemedClassName(CSS.tabs) }>
                <ThemeSelector key={ "themeSelecter" } />
                { this.props.items.map(this._renderMenuItem, this) }
            </nav>
        );
    }

    private _renderMenuItem(menuItem: IPage, key: number): JSX.Element {
        return (
            <MenuItem
                key={ key }
                { ...menuItem }
                isSelected={ menuItem.pageId === this.props.activePageId }
            />
        );
    }
}
