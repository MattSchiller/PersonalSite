import { MenuItem } from "@Components/MenuItem";
import { ThemeSelector } from "@Components/ThemeSelector";
import { IThemedProps } from "@Helpers/Theming";
import { IPage, IStore, IActivePageProps } from "@Redux/Interfaces/IStore";
import CSS from "@Sass/styles.scss";
import React from "react";
import { connect } from "react-redux";

interface IMenuProps extends IThemedProps, IActivePageProps {
    items: IPage[];
}

class Menu extends React.PureComponent<IMenuProps> {
    public render() {
        return (
            <nav className={ CSS.tabs }>
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
