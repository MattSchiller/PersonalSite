import { SimTypeSegment } from "@Components/SimTypeSegment";
import CSS from "@Sass/sublimeMonokai.scss";
import { TextSegment } from "@SimType/TextSegment";
import React from "react";

interface ISimTypeLineProps {
    textSegments: TextSegment[];
    lineNumber: number;
    isCurrentLine: boolean;
}

export class SimTypeLine extends React.PureComponent<ISimTypeLineProps> {
    public render() {
        return (
            <div className={ this._getClassName() } >
                <div className={ CSS.lineNumber }>
                    { this._getSpacedLineNumber(this.props.lineNumber) }
                </div>
                { this._renderTextSegments() }
            </div>
        )
    }

    private _getClassName(): string {
        return `${CSS.wholeLine} ${this.props.isCurrentLine ? CSS.currLine : ""}`;
    }

    private _getSpacedLineNumber(lineNumber: number): string {
        return lineNumber > 9 ? lineNumber.toString() : " " + lineNumber;
    }

    private _renderTextSegments(): JSX.Element[] {
        return this.props.textSegments.map((textSegment: TextSegment, index: number) =>
            <SimTypeSegment key={ index } textSegment={ textSegment } />);
    }
}
