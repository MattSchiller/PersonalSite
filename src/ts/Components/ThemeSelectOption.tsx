import { IThemeEnum } from "@Helpers/IThemeEnum";
import { getThemedClassName } from "@Helpers/Theming";
import { Actions } from "@Redux/Actions";
import { IStore, IStoreTheme } from "@Redux/Interfaces/IStore";
import { getActiveTheme } from "@Redux/Store";
import CSS from "@Sass/styles.scss";
import React from "react";
import { connect } from "react-redux";

interface IThemeOptionProps extends IStoreTheme {
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
        );
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
                <span className={ CSS.key }>const </span>
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
            "I'm a randomly chosen comment!",
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
        activeTheme: getActiveTheme(),
    };
}

const ConnectedThemeSelectOption = connect(mapStateToProps)(ThemeSelectOption);
export { ConnectedThemeSelectOption as ThemeSelectOption };
