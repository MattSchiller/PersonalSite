import { Actions } from "@Redux/Actions";
import { IPage } from "@Redux/Interfaces/IStore";
import CSS from "@Sass/styles.scss";
import React from "react";
import { IThemeEnum } from "@TS/Helpers/IThemeEnum";
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

        // TODO: Add listener for if the user clicks somewhere else to collapse this div.
    }

    public render() {
        return [
            <li
                onClick={ this._toggleSelected }
                className={ CSS.themeSelector + this._getSelectedClassName() }
            >
                <img src={ themeIconUrl } />
                Theme
                { this._renderOptions() }
            </li >,
        ];
    }

    private _toggleSelected = () => {
        this.setState({
            isSelected: !this.state.isSelected
        });
    }

    private _renderOptions(): JSX.Element {
        return (
            <div className={ CSS.themeOptions } >
                { Object.values(IThemeEnum).map(theme => <ThemeOption theme={ theme } />) }
            </div>
        );
    }

    private _getSelectedClassName(): string {
        return ` ${this.state.isSelected ? CSS.selected : ""}`;
    }
}

interface IThemeOptionProps {
    theme: IThemeEnum;
}

export class ThemeOption extends React.PureComponent<IThemeOptionProps> {
    public render() {
        return (
            <div onClick={ this._onClick }>
                { this.props.theme }
            </div>
        )
    }

    private _onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        Actions.setActiveTheme(this.props.theme);
    }
}