import { SimTypeSegment } from "@Components/SimTypeSegment";
import CSS from "@Sass/sublimeMonokai.scss";
import { TextSegment } from "@SimType/TextSegment";
import React from "react";

interface ISimTypeLineProps {
    textSegments: TextSegment[];
    lineNumber: number;
}

export class SimTypeLine extends React.PureComponent<ISimTypeLineProps> {
    public render() {
        return (
            <div className={ CSS.wholeLine } >
                <div className={ CSS.lineNumber }>
                    { this._getSpacedLineNumber(this.props.lineNumber) }
                </div>
                { this._renderTextSegments() }
            </div>
        )
    }

    private _getSpacedLineNumber(lineNumber: number): string {
        return lineNumber > 9 ? lineNumber.toString() : " " + lineNumber;
    }

    private _renderTextSegments(): JSX.Element[] {
        return this.props.textSegments.map((textSegment: TextSegment, index: number) =>
            <SimTypeSegment key={ index } textSegment={ textSegment } />);
    }
}
