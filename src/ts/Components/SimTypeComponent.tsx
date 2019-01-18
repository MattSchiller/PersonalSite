import { ITypedContentPayload } from "@Interfaces/IAction";
import { Actions } from "@Redux/Actions";
import CSS from "@Sass/sublimeMonokai.scss";
import { Constants, getMaxLineLengthWithIndent } from "@SimType/Constants";
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
                lineLength = 0;
            } else
                lineLength = this._getTrimmedTextSegment(clonedTextSegment, lineLength, lines);
        });

        return lines;
    }

    private _isTextSegmentNewLine(textSegment: TextSegment): boolean {
        return textSegment.className.indexOf(CSS.lineBreak) > -1;
    }

    private _getTrimmedTextSegment(textSegment: TextSegment, lineLength: number, lines: TextSegment[][]): number {
        const effectiveMaxLineLength = getMaxLineLengthWithIndent(textSegment.className);
        const text: string = textSegment.text;
        lineLength += text.length;
        const overage = lineLength - effectiveMaxLineLength;

        if (overage > 0) {
            const trimmedOffTextSegment: TextSegment = TextSegment.clone(textSegment);
            [textSegment.text, trimmedOffTextSegment.text] = this._getSplitText(textSegment.text, overage);

            lineLength = trimmedOffTextSegment.text.length;

            this._addToLine(textSegment, lines);
            lines.push([]);

            if (lineLength > effectiveMaxLineLength)
                lineLength = this._getTrimmedTextSegment(trimmedOffTextSegment, 0, lines);
            else
                this._addToLine(trimmedOffTextSegment, lines);
        } else
            this._addToLine(textSegment, lines);

        return lineLength;
    }

    private _getSplitText(text: string, overage: number): string[] {
        const defaultSplitIndex: number = text.length - overage;
        const lastSpaceIndex: number = text.substr(0, defaultSplitIndex).lastIndexOf(" ");
        let splitIndex: number;

        const charBeforeSplit: string = text[defaultSplitIndex - 1];
        const charAfterSplit: string = text[defaultSplitIndex];

        if (charBeforeSplit === " " || charAfterSplit === " " || lastSpaceIndex === -1)
            splitIndex = defaultSplitIndex
        else
            splitIndex = lastSpaceIndex;

        return [
            this._trimOutsideSpaces(text.substr(0, splitIndex)),
            this._trimOutsideSpaces(text.substr(splitIndex))
        ];
    }

    private _trimOutsideSpaces(text: string): string {
        while (text.length > 0 && text[0] === " ")
            text = text.substr(1);
        while (text.length > 0 && text[text.length - 1] === " ")
            text = text.substr(0, text.length - 1);

        return text;
    }

    private _addToLine(textSegment: TextSegment, lines: TextSegment[][]) {
        lines[lines.length - 1].push(textSegment);
    }
}
