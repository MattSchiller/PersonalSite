import { Actions } from "@Redux/Actions";
import { IPage } from "@Redux/Interfaces/IStore";
import CSS from "@Sass/styles.scss";
import React from "react";
import { IThemesEnum } from "@Helpers/Theming";
import { getActiveTheme } from "@Redux/Store";

const themeIconUrl = "assets/images/paletteIcon.png";

interface IThemeSelectorState {
    isSelected: boolean;
}

export class ThemeSelector extends React.PureComponent<any, IThemeSelectorState> {
    constructor(props: any) {
        super(props);
        this.state = {
            isSelected: false
        };
    }

    public render() {
        return (
            <li
                onClick={ this._toggleSelected }
                className={ this._getClassName() }
            >
                <img src={ themeIconUrl } />
                Theme
            </li >
        );
    }

    private _getClassName(): string {
        return `${CSS.themeSelector}
            ${this.state.isSelected ? CSS.selected : ""}`;
    }

    private _toggleSelected = () => {
        this.setState({
            isSelected: !this.state.isSelected
        });
    }
}
