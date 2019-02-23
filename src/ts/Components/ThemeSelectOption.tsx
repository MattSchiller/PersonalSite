import { Actions } from "@Redux/Actions";
import { IThemeEnum } from "@TS/Helpers/IThemeEnum";
import React from "react";
import { IThemedProps, getThemedClassName } from "@TS/Helpers/Theming";
import { IStore } from "@TS/Redux/Interfaces/IStore";
import { connect } from "react-redux";
import CSS from "@Sass/styles.scss";

interface IThemeOptionProps extends IThemedProps {
    theme: IThemeEnum;
}

class ThemeSelectOption extends React.PureComponent<IThemeOptionProps> {
    public render() {
        return (
            <div className={ this._getClassName() } onClick={ this._onClick }>
                { this._renderThemeName() }
                { this._renderPreview() }
            </div>
        )
    }

    private _getClassName(): string {
        return `${CSS.themeOption}
            ${ this._isSelected() ? "selected" : ""}
            ${getThemedClassName(CSS.simType, this.props.theme)}`;
    }

    private _renderThemeName(): string {
        return `${this._isSelected() ? ">" : " "} ${this.props.theme}`;
    }

    private _renderPreview(): JSX.Element {
        return (
            <div className={ `` }>
                <span className={ CSS.func }>function</span>
            </div>
        );
    }

    private _onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        Actions.setActiveTheme(this.props.theme);
    }

    private _isSelected(): boolean {
        return this.props.activeTheme === this.props.theme;
    }
}

function mapStateToProps(state: IStore) {
    return {
        activeTheme: state.activeTheme
    };
}

const ConnectedThemeSelectOption = connect(mapStateToProps)(ThemeSelectOption);
export { ConnectedThemeSelectOption as ThemeSelectOption };
