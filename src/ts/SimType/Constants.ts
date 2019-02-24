import CSS from "@Sass/styles.scss";

export const Constants = {
    typeTimeoutMs: 50,
    backTimeoutMs: 100,
    maxLineLength: 80,
    escapeCharacter: "~",
    quoteCharacter: "\"",
    indent: "indent",
    actionCharacters: {
        startingStub: "s",
        pause: "p",
        backspace: "b",
        link: "a",
        preClass: "c",
        postClass: "C",
        quote: "q",
        line: "l",
    }
};

export function getMaxLineLengthWithIndent(classList: string) {
    const indentWidth: number = 2;
    const deltaMaxLine: number = getIndentCount(classList) * indentWidth;
    return Constants.maxLineLength - deltaMaxLine;
}

export function getIndentCount(classList: string): number {
    return getFindStringCount(classList, Constants.indent);
}

export function getLineBreakRulerCount(classList: string): number {
    return getFindStringCount(classList, CSS.lineBreak);
}

function getFindStringCount(classList: string, findString: string): number {
    const indentIndex: number = classList.indexOf(findString);
    return (indentIndex !== -1) ? Number(classList[indentIndex + findString.length]) : 0;
}

export const renderTargetId = "renderTarget";
