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
    private _previewComment = this._getPreviewComment();

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

    private _renderThemeName(): JSX.Element {
        return (
            <div className={ CSS.themeOptionName }>
                { `${this._isSelected() ? ">" : " "} ${this.props.theme}:` }
            </div>
        );
    }

    private _renderPreview(): JSX.Element {
        return (
            <div className={ CSS.themeOptionPreview }>
                <span className={ CSS.reserved }>export </span>
                <span className={ CSS.key }>class </span>
                <span className={ CSS.func }>Example</span>
                <span className={ CSS.symbol }> = </span>
                <span className={ CSS.string }>"Also example"</span>
                <span className={ CSS.symbol }>;</span>
                <span className={ CSS.comment }>{ "  " + this._previewComment }</span>
            </div>
        );
    }

    private _getPreviewComment(): string {
        const comments = [
            "Cool",
            "Awesome",
            "1337",
            "Gnarly",
            "Bodacious",
            "Tubular",
            "Uh-oh",
            "Here we go...",
            "<-- ???",
            "Help, let me out of your computer!",
        ];

        return "// " + comments[
            Math.round(Math.random() * comments.length)
        ];
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
