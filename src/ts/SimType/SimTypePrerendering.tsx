import CSS from "@Sass/styles.scss";
import { Constants, getIndentCount, getLineBreakRulerCount, getMaxLineLengthWithIndent } from "@SimType/Constants";
import { TextSegment } from "@SimType/TextSegment";

let lines: TextSegment[][];

export function getTrimmedLines(textSegments: TextSegment[]): TextSegment[][] {
    lines = new Array<TextSegment[]>([]);
    let lineLength: number = 0;

    textSegments.forEach((textSegment: TextSegment) => {
        const clonedTextSegment: TextSegment = TextSegment.clone(textSegment);

        if (isTextSegmentNewLine(clonedTextSegment)) {
            lines.push([]);
            addIndentRulerToLineBreak(clonedTextSegment);
            lineLength = 0;
        } else
            lineLength = getTrimmedTextSegment(clonedTextSegment, lineLength);
    });

    return lines;
}

function isTextSegmentNewLine(textSegment: TextSegment): boolean {
    return textSegment.className.indexOf(CSS.lineBreak) > -1;
}

function addIndentRulerToLineBreak(textSegment: TextSegment) {
    const rulerCount: number = getLineBreakRulerCount(textSegment.className);
    for (let i = 0; i < rulerCount; i++)
        addToCurrentLine(new TextSegment("", CSS.rulerMark));
}

function getTrimmedTextSegment(textSegment: TextSegment, lineLength: number): number {
    const effectiveMaxLineLength = getMaxLineLengthWithIndent(textSegment.className);
    const text: string = textSegment.text;
    lineLength += text.length;
    const overage = lineLength - effectiveMaxLineLength;

    addIndentSegmentsToLine(textSegment);

    if (overage > 0) {
        const trimmedOffTextSegment: TextSegment = TextSegment.clone(textSegment);
        [textSegment.text, trimmedOffTextSegment.text] = getSplitText(textSegment.text, overage);

        lineLength = trimmedOffTextSegment.text.length;

        addToCurrentLine(textSegment);
        lines.push([]);

        if (lineLength > effectiveMaxLineLength)
            lineLength = getTrimmedTextSegment(trimmedOffTextSegment, 0);
        else {
            addIndentSegmentsToLine(trimmedOffTextSegment);
            addToCurrentLine(trimmedOffTextSegment);
        }
    } else
        addToCurrentLine(textSegment);

    return lineLength;
}

function addIndentSegmentsToLine(textSegment: TextSegment) {
    const textSegments: TextSegment[] = [];
    const indentCount: number = getIndentCount(textSegment.className);
    const singleIndentTextSegment = new TextSegment("", Constants.indent);

    for (let i = 0; i < indentCount; i++)
        addToCurrentLine(singleIndentTextSegment);

    return textSegments;
}

function getSplitText(text: string, overage: number): string[] {
    const defaultSplitIndex: number = text.length - overage;
    const lastSpaceIndex: number = text.substr(0, defaultSplitIndex).lastIndexOf(" ");

    const charBeforeSplit: string = text[defaultSplitIndex - 1];
    const charAfterSplit: string = text[defaultSplitIndex];

    const splitIndex = (
        charBeforeSplit === " " ||
        charAfterSplit === " " ||
        lastSpaceIndex === -1
    ) ? defaultSplitIndex
        : lastSpaceIndex;

    return [
        trimTrailingSpaces(text.substr(0, splitIndex)),
        trimLeadingSpaces(text.substr(splitIndex))
    ];
}

function trimLeadingSpaces(text: string): string {
    while (text.length > 0 && text[0] === " ")
        text = text.substr(1);
    return text;
}

function trimTrailingSpaces(text: string): string {
    while (text.length > 0 && text[text.length - 1] === " ")
        text = text.substr(0, text.length - 1);
    return text;
}

function addToCurrentLine(textSegment: TextSegment) {
    lines[lines.length - 1].push(textSegment);
}
