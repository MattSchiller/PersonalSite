import CSS from "@Sass/styles.scss";
import React from "react";

export class RotateMobile extends React.PureComponent {
    public render() {
        return (
            <div className={ CSS.rotateMobile }>
                <img src={ this._getRotateUrl() } />
                This site is best viewed in landscape mode
            </div>
        );
    }

    private _getRotateUrl() {
        return "./assets/images/rotateToLandscape.png"
    }
}

function shouldRenderRotateMobile(): boolean {
    return true;
}

export function renderRotateMobile(): JSX.Element | null {
    if (shouldRenderRotateMobile)
        return <RotateMobile />
    return null;
}
