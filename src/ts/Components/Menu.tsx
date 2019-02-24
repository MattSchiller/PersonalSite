import { MenuItem } from "@Components/MenuItem";
import { IPage, IStore } from "@Redux/Interfaces/IStore";
import CSS from "@Sass/styles.scss";
import { ThemeSelector } from "@Components/ThemeSelector";
import { getThemedClassName, IThemedProps } from "@Helpers/Theming";
import React from "react";
import { connect } from "react-redux";

interface IMenuProps extends IThemedProps {
    items: IPage[];
    activePageId: string;
}

class Menu extends React.PureComponent<IMenuProps> {
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

function mapStateToProps(state: IStore) {
    return {
        items: state.pages,
        activePageId: state.activePageId,
        activeTheme: state.activeTheme,
    };
}

const ConnectedMenu = connect(mapStateToProps)(Menu);
export { ConnectedMenu as Menu };
