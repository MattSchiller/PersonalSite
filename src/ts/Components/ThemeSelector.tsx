import { ThemeSelectOption } from "@Components/ThemeSelectOption";
import { IThemeEnum } from "@Helpers/IThemeEnum";
import CSS from "@Sass/styles.scss";
import { renderTargetId } from "@SimType/Constants";
import React from "react";

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

        document.getElementById(renderTargetId)!.addEventListener(
            "click",
            this._listenForClicksOutsideOfElement
        );
    }

    public componentWillUnmount() {
        document.getElementById(renderTargetId)!.removeEventListener(
            "click",
            this._listenForClicksOutsideOfElement
        );
    }

    private _listenForClicksOutsideOfElement = (event: MouseEvent) => {
        if (event.target &&
            !(event.target! as HTMLElement).closest(`.${this._getThemeSelectorClassName()}`) &&
            this.state.isSelected
        )
            this._setIsSelected(false);
    }

    private _getThemeSelectorClassName(): string {
        return CSS.themeSelector;
    }

    public render() {
        return (
            <li
                onClick={ this._toggleIsSelected }
                className={ this._getThemeSelectorClassName() + this._getSelectedClassName() }
            >
                <img src={ themeIconUrl } />
                Theme
                { this._renderOptions() }
            </li >
        );
    }

    private _toggleIsSelected = () => {
        this._setIsSelected(!this.state.isSelected);
    }

    private _setIsSelected = (isSelected: boolean) => {
        this.setState({ isSelected });
    }

    private _renderOptions(): JSX.Element {
        return (
            <div className={ CSS.themeOptions } >
                { Object.values(IThemeEnum).map(theme => <ThemeSelectOption key={ theme } theme={ theme } />) }
            </div>
        );
    }

    private _getSelectedClassName(): string {
        return ` ${this.state.isSelected ? CSS.selected : ""}`;
    }
}
