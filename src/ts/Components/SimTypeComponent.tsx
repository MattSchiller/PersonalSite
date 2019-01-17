import { ITypedContentPayload } from "@Interfaces/IAction";
import { Actions } from "@Redux/Actions";
import CSS from "@Sass/sublimeMonokai.scss";
import { Constants } from "@SimType/Constants";
import { ISimTypeContent } from "@SimType/ISimTypeContent";
import { SimType } from "@SimType/SimType";
import { TextSegment } from "@SimType/TextSegment";
import React from "react";
import { SimTypeLine } from "@Components/SimTypeLine";

// This is supplied by the container.
interface ISimTypeComponentProps extends ISimTypeContent {
    pageId: string,
}

// Given a string, this module simulates typing of that string into the div
export class SimTypeComponent extends React.PureComponent<ISimTypeComponentProps> {
    private _simType = new SimType();

    public componentDidMount() {
        this._simulateTyping();
    }

    public componentDidUpdate() {
        this._simulateTyping();
    }

    private _simulateTyping() {
        // Asyncronously wait on the newTypedContentPayload promise and then run the update function
        // when the promise resolves (to handle the timeouts that simulate human typing).
        this._simType.getNextTypedContentPayload({ ...this.props })
            .then(updatedContent => {
                if (this._isUpdatedContentDifferent(updatedContent))
                    Actions.updateSimTypeContent(this.props.pageId, this.props.simTypeId, updatedContent);
                else
                    console.log("Finished typing.")
            })
            .catch(console.log);
    }

    private _isUpdatedContentDifferent(updatedContent: ITypedContentPayload): boolean {
        return (
            Object.keys(updatedContent).some((key: string) =>
                updatedContent[key] !== (this.props as ITypedContentPayload)[key]
            )
        );
    }

    public render() {
        return (
            <div className={ CSS.simType } >
                { this._renderLines(this._getTrimmedLines()) }
            </div>
        );
    }

    private _renderLines(lines: TextSegment[][]): JSX.Element[] {
        const lineNumberStart = this.props.lineNumberStart || 1;

        return lines.map((textSegments: TextSegment[], index: number) =>
            <SimTypeLine
                key={ index }
                lineNumber={ lineNumberStart + index }
                textSegments={ textSegments } />
        );
    }

    private _getTrimmedLines(): TextSegment[][] {
        let lines: TextSegment[][] = new Array<TextSegment[]>([]);

        let lineLength: number = 0;

        this.props.textSegments.forEach((textSegment: TextSegment) => {
            const clonedTextSegment: TextSegment = TextSegment.clone(textSegment);

            if (this._isTextSegmentNewLine(clonedTextSegment)) {
                lines.push([]);
                this._addToLine(clonedTextSegment, lines);
                lineLength = 0;
            } else
                lineLength = this._getTrimmedTextSegment(clonedTextSegment, lineLength, lines);
        });

        return lines;
    }

    private _isTextSegmentNewLine(textSegment: TextSegment): boolean {
        return ~textSegment.className.indexOf(CSS.lineBreak) ? true : false;
    }

    private _getTrimmedTextSegment(textSegment: TextSegment, lineLength: number, lines: TextSegment[][]): number {
        const text: string = textSegment.text;
        lineLength += text.length;
        const overage = lineLength - Constants.maxLineLength;

        if (overage > 0) {
            const trimmedOffTextSegment: TextSegment = TextSegment.clone(textSegment);
            textSegment.text = text.substr(0, text.length - overage);
            trimmedOffTextSegment.text = text.substr(text.length - overage);

            lineLength = trimmedOffTextSegment.text.length;

            this._addToLine(textSegment, lines);

            lines.push([]);

            if (lineLength > Constants.maxLineLength)
                lineLength = this._getTrimmedTextSegment(trimmedOffTextSegment, lineLength, lines);
            else
                this._addToLine(trimmedOffTextSegment, lines);
        } else
            this._addToLine(textSegment, lines);

        return lineLength;
    }

    private _addToLine(textSegment: TextSegment, lines: TextSegment[][]) {
        lines[lines.length - 1].push(textSegment);
    }
}
