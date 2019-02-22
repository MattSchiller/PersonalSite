import { Actions } from "@Redux/Actions";
import { IThemeEnum } from "@TS/Helpers/IThemeEnum";
import React from "react";
import { IThemedProps } from "@TS/Helpers/Theming";
import { IStore } from "@TS/Redux/Interfaces/IStore";
import { connect } from "react-redux";

interface IThemeOptionProps extends IThemedProps {
    theme: IThemeEnum;
}

class ThemeSelectOption extends React.PureComponent<IThemeOptionProps> {
    public render() {
        console.log("renderin:", this.props.activeTheme)
        return (
            <div className={ this._getClassName() } onClick={ this._onClick }>
                { this.props.theme }
            </div>
        )
    }

    private _onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        Actions.setActiveTheme(this.props.theme);
    }

    private _getClassName(): string {
        return this.props.activeTheme === this.props.theme ? "selected" : "";
    }
}

function mapStateToProps(state: IStore) {
    return {
        activeTheme: state.activeTheme
    };
}

const ConnectedThemeSelectOption = connect(mapStateToProps)(ThemeSelectOption);
export { ConnectedThemeSelectOption as ThemeSelectOption };
