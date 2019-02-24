import { SimTypeComponent } from "@Components/SimTypeComponent";
import { getThemedClassName } from "@Helpers/Theming";
import { IPage, IStore } from "@Redux/Interfaces/IStore";
import CSS from "@Sass/styles.scss";
import { ISimTypeContent } from "@SimType/ISimTypeContent";
import React from "react";
import { getActivePage, getActiveTheme } from "@Redux/Store";
import { connect } from "react-redux";

class SimTypeContainer extends React.PureComponent<IPage> {
    public render() {
        return (
            <div className={ this._getClassName() }>
                { this._renderSimTypeComponents() }
            </div>
        );
    }

    private _getClassName(): string {
        return `${CSS.simTypeContainer}
            ${getThemedClassName(`${CSS.simTypeContainer}-${this.props.language}`)}`;
    }

    private _renderSimTypeComponents(): JSX.Element[] {
        if (!this.props.simTypes)
            return [];

        return this.props.simTypes.map(
            (simType: ISimTypeContent, index: number) => (
                <SimTypeComponent
                    key={ this.props.pageId + index }
                    pageId={ this.props.pageId }
                    { ...simType }
                />
            )
        );
    }
}

function mapStateToProps(state: IStore) {
    return {
        ...getActivePage(),
        activeTheme: getActiveTheme()
    };
}

const ConnectedSimTypeContainer = connect(mapStateToProps)(SimTypeContainer);
export { ConnectedSimTypeContainer as SimTypeContainer };
