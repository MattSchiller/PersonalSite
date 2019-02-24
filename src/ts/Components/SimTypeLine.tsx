import { SimTypeSegment } from "@Components/SimTypeSegment";
import CSS from "@Sass/styles.scss";
import { TextSegment } from "@SimType/TextSegment";
import React from "react";
import { ISimTypeStatus } from "@SimType/ISimTypeContent";

interface ISimTypeLineProps {
    textSegments: TextSegment[];
    lineNumber: number;
    isCurrentLine: boolean;
    status: ISimTypeStatus;
}

export class SimTypeLine extends React.PureComponent<ISimTypeLineProps> {
    public render() {
        return (
            <div className={ this._getClassName() } >
                <div className={ CSS.lineNumber }>
                    { this._getSpacedLineNumber(this.props.lineNumber) }
                </div>
                { this._renderTextSegments() }
                { this._renderCaret() }
            </div>
        );
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

    private _renderCaret(): JSX.Element | null {
        const caretClass: string = `${CSS.simTypeCaret}
            ${this.props.status.isQuoting ? CSS.simTypeQuoting : ""}`;

        return (this.props.isCurrentLine ? (
            <div className={ caretClass }>
                |
            </ div>
        ) : null);
    }
}
