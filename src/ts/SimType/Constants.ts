export const Constants = {
    typeTimeoutMs: 50,
    backTimeoutMs: 100,
    maxLineLength: 80,
    escapeCharacter: "~",
    quoteCharacter: "\"",
    indent: "indent",
    str: "str",
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
    let deltaMaxLine: number = 0;
    const indentWidth: number = 2;
    const indentIndex: number = classList.indexOf(Constants.indent);

    if (indentIndex !== -1)
        deltaMaxLine = Number(classList[indentIndex + Constants.indent.length]) * indentWidth;

    return Constants.maxLineLength - deltaMaxLine;
}

export const renderTargetId = "renderTarget";
