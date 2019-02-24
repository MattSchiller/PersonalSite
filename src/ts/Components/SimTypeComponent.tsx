import { SimTypeLine } from "@Components/SimTypeLine";
import { getThemedClassName, IThemedProps } from "@Helpers/Theming";
import { Actions } from "@Redux/Actions";
import { ITypedContentPayload } from "@Redux/Interfaces/IAction";
import { IStore } from "@Redux/Interfaces/IStore";
import CSS from "@Sass/styles.scss";
import { Constants, getIndentCount, getLineBreakRulerCount, getMaxLineLengthWithIndent } from "@SimType/Constants";
import { ISimTypeContent } from "@SimType/ISimTypeContent";
import { getNextTypedContentPayloadPromise } from "@SimType/SimType";
import { TextSegment } from "@SimType/TextSegment";
import React from "react";
import { connect } from "react-redux";

// This is supplied by the container.
interface ISimTypeComponentProps extends ISimTypeContent, IThemedProps {
    pageId: string,
}

interface ISimTypeComponentState {
    isFinishedTyping: boolean;
}

// Given a string, this module simulates typing of that string into the div.
class SimTypeComponent extends React.PureComponent<ISimTypeComponentProps, ISimTypeComponentState> {
    // This is important to keep from any other updates (like them changes) from kicking off another typing increment.
    private _isDuringTypingTimeout: boolean = false;

    constructor(props: ISimTypeComponentProps) {
        super(props);
        this.state = { isFinishedTyping: false };
    }

    public componentDidMount() {
        this._simulateTyping();
    }

    public componentDidUpdate() {
        this._simulateTyping();
    }

    private _simulateTyping() {
        if (this._isDuringTypingTimeout)
            return;

        this._isDuringTypingTimeout = true;
        // Asyncronously wait on the newTypedContentPayload promise and then run the update function
        // when the promise resolves (to handle the timeouts that simulate human typing).
        getNextTypedContentPayloadPromise({ ...this.props })
            .then(updatedContent => {
                this._isDuringTypingTimeout = false;

                if (this._isUpdatedContentDifferent(updatedContent))
                    Actions.updateSimTypeContent(this.props.pageId, this.props.simTypeId, updatedContent);
                else
                    this.setState({ isFinishedTyping: true });
            })
            .catch(console.log);
    }

    private _isUpdatedContentDifferent(updatedContent: ITypedContentPayload): boolean {
        const typedProps: ITypedContentPayload = this.props as ITypedContentPayload;

        return Object.keys(updatedContent).some((key: string) => {
            const objectValue: any = updatedContent[key];

            if (typeof objectValue === "object")
                // We only go one-layer deep in our state comparison.
                return Object.keys(objectValue).some((subKey: string) =>
                    objectValue[subKey] !== typedProps[key][subKey]);
            else
                return updatedContent[key] !== typedProps[key];
        });
    }

    public render() {
        return (
            <div className={ this._getClassName() } >
                { this._renderLines(this._getTrimmedLines()) }
            </div>
        );
    }

    private _getClassName(): string {
        return `${getThemedClassName(CSS.simType)}
            ${this.state.isFinishedTyping ? "" : CSS.typing}`;
    }

    private _renderLines(lines: TextSegment[][]): JSX.Element[] {
        const lineNumberStart = this.props.lineNumberStart || 1;

        return lines.map((textSegments: TextSegment[], index: number) =>
            <SimTypeLine
                key={ index }
                lineNumber={ lineNumberStart + index }
                textSegments={ textSegments }
                isCurrentLine={ (lines.length - 1) === index }
                status={ this.props.status } />
        );
    }

    private _getTrimmedLines(): TextSegment[][] {
        let lines: TextSegment[][] = new Array<TextSegment[]>([]);
        let lineLength: number = 0;

        this.props.textSegments.forEach((textSegment: TextSegment) => {
            const clonedTextSegment: TextSegment = TextSegment.clone(textSegment);

            if (this._isTextSegmentNewLine(clonedTextSegment)) {
                lines.push([]);
                this._addIndentRulerToLineBreak(clonedTextSegment, lines);
                lineLength = 0;
            } else
                lineLength = this._getTrimmedTextSegment(clonedTextSegment, lineLength, lines);
        });

        return lines;
    }

    private _isTextSegmentNewLine(textSegment: TextSegment): boolean {
        return textSegment.className.indexOf(CSS.lineBreak) > -1;
    }

    private _addIndentRulerToLineBreak(textSegment: TextSegment, lines: TextSegment[][]) {
        const rulerCount: number = getLineBreakRulerCount(textSegment.className);
        for (let i = 0; i < rulerCount; i++)
            this._addToLine(new TextSegment("", CSS.rulerMark), lines);
    }

    private _getTrimmedTextSegment(textSegment: TextSegment, lineLength: number, lines: TextSegment[][]): number {
        const effectiveMaxLineLength = getMaxLineLengthWithIndent(textSegment.className);
        const text: string = textSegment.text;
        lineLength += text.length;
        const overage = lineLength - effectiveMaxLineLength;

        this._addIndentSegmentsToLine(textSegment, lines);

        if (overage > 0) {
            const trimmedOffTextSegment: TextSegment = TextSegment.clone(textSegment);
            [textSegment.text, trimmedOffTextSegment.text] = this._getSplitText(textSegment.text, overage);

            lineLength = trimmedOffTextSegment.text.length;

            this._addToLine(textSegment, lines);
            lines.push([]);

            if (lineLength > effectiveMaxLineLength)
                lineLength = this._getTrimmedTextSegment(trimmedOffTextSegment, 0, lines);
            else {
                this._addIndentSegmentsToLine(trimmedOffTextSegment, lines);
                this._addToLine(trimmedOffTextSegment, lines);
            }
        } else
            this._addToLine(textSegment, lines);

        return lineLength;
    }

    private _addIndentSegmentsToLine(textSegment: TextSegment, lines: TextSegment[][]) {
        const textSegments: TextSegment[] = [];
        const indentCount: number = getIndentCount(textSegment.className);
        const singleIndentTextSegment = new TextSegment("", Constants.indent);

        for (let i = 0; i < indentCount; i++)
            this._addToLine(singleIndentTextSegment, lines);

        return textSegments;
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
            this._trimTrailingSpaces(text.substr(0, splitIndex)),
            this._trimLeadingSpaces(text.substr(splitIndex))
        ];
    }

    private _trimLeadingSpaces(text: string): string {
        while (text.length > 0 && text[0] === " ")
            text = text.substr(1);
        return text;
    }

    private _trimTrailingSpaces(text: string): string {
        while (text.length > 0 && text[text.length - 1] === " ")
            text = text.substr(0, text.length - 1);
        return text;
    }

    private _addToLine(textSegment: TextSegment, lines: TextSegment[][]) {
        lines[lines.length - 1].push(textSegment);
    }
}

function mapStateToProps(state: IStore) {
    return {
        activeTheme: state.activeTheme
    };
}

const ConnectedSimTypeComponent = connect(mapStateToProps)(SimTypeComponent);
export { ConnectedSimTypeComponent as SimTypeComponent };
