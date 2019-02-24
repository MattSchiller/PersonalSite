import CSS from "@Sass/styles.scss";
import { Constants } from "@SimType/Constants";
import { ISimTypeContentWithFlags } from "@SimType/ISimTypeContent";
import { CannotSimulateTypingError, getNextTypedContentPayload, isContentIndexSafe } from "@SimType/SimType";
import { TextSegment } from "@SimType/TextSegment";

export function processActionCharacter(
    actionCharacter: string,
    content: ISimTypeContentWithFlags
): ISimTypeContentWithFlags {
    const actionValue = getActionValue(content.sourceText, content.contentIndex);

    let actionMethod: (actionParams: IEscapedActionParams) => ISimTypeContentWithFlags;

    switch (actionCharacter) {
        case Constants.actionCharacters.startingStub:
            actionMethod = actions.startingStub;
            break;

        case Constants.actionCharacters.pause:
            actionMethod = actions.pause;
            break;

        case Constants.actionCharacters.backspace:
            actionMethod = actions.backspace;
            break;

        case Constants.actionCharacters.link:
            actionMethod = actions.link;
            break;

        case Constants.actionCharacters.preClass:
            actionMethod = actions.preClass;
            break;

        case Constants.actionCharacters.postClass:
            actionMethod = actions.postClass;
            break;

        case Constants.actionCharacters.quote:
            actionMethod = actions.quote;
            break;

        case Constants.actionCharacters.line:
            actionMethod = actions.line;
            break;

        default:
            actionMethod = () => content;
    }

    return actionMethod({ actionValue, content });
}

function getActionValue(sourceText: string, contentIndex: number): string | number {
    const subString = sourceText.substring(contentIndex, sourceText.length);
    const regExpRule = new RegExp("^[^" + Constants.escapeCharacter + "]*");
    const endOfActionValueRegExMatches: RegExpMatchArray = subString.match(regExpRule) || [];

    if (endOfActionValueRegExMatches.length === 0)
        throw new CannotSimulateTypingError(
            "Failed to parse any actionValue contents from sourceText!",
            contentIndex,
            sourceText);

    return endOfActionValueRegExMatches[0];
}

const actions = {
    startingStub: (actionParams: IEscapedActionParams): ISimTypeContentWithFlags => {
        if (!actionParams.content.stubbing) {
            // Start whipping through processing the content, skipping any sort of timeout/promises.
            actionParams.content.stubbing = true;

            let content = actionParams.content;

            // Account for having to skip over own character.
            content.contentIndex += Constants.actionCharacters.startingStub.length;

            while (content.stubbing && isContentIndexSafe(content.sourceText, content.contentIndex)) {
                content = {
                    ...content,
                    ...getNextTypedContentPayload(content),
                };
            }

            actionParams.content = content;
        } else {
            // We've found the end of the starting stub of text.
            actionParams.content.stubbing = false;

            // Undo having to skip over own character.
            actionParams.content.contentIndex -= Constants.actionCharacters.startingStub.length;
        }

        return getPostActionContentWithUpdatedContentIndex(actionParams);
    },

    pause: (actionParams: IEscapedActionParams): ISimTypeContentWithFlags => {
        actionParams.content = {
            ...actionParams.content,
            pausing: true,
            pausedMs: actionParams.actionValue as number
        };

        return getPostActionContentWithUpdatedContentIndex(actionParams);
    },

    link: (actionParams: IEscapedActionParams): ISimTypeContentWithFlags => {
        const textSegment = actionParams.content.textSegments.pop()!;
        textSegment.link = actionParams.actionValue as string;
        actionParams.content.textSegments.push(textSegment);

        return getPostActionContentWithUpdatedContentIndex(actionParams);
    },

    preClass: (actionParams: IEscapedActionParams): ISimTypeContentWithFlags => {
        const textSegment = new TextSegment("", actionParams.actionValue as string);
        actionParams.content.textSegments.push(textSegment);

        return getPostActionContentWithUpdatedContentIndex(actionParams);
    },

    postClass: (actionParams: IEscapedActionParams): ISimTypeContentWithFlags => {
        const textSegment: TextSegment = actionParams.content.textSegments.pop() || new TextSegment();

        textSegment.className += " " + actionParams.actionValue;
        actionParams.content.textSegments.push(textSegment);

        return getPostActionContentWithUpdatedContentIndex(actionParams);
    },

    quote: (actionParams: IEscapedActionParams): ISimTypeContentWithFlags => {
        if (!actionParams.content.status.isQuoting) {
            const textSegment: TextSegment = actionParams.content.textSegments.pop()!;
            textSegment.text += Constants.quoteCharacter + Constants.quoteCharacter;
            actionParams.content.textSegments.push(textSegment);
        }

        actionParams.content.status.isQuoting = !actionParams.content.status.isQuoting;

        return getPostActionContentWithUpdatedContentIndex(actionParams);
    },

    line: (actionParams: IEscapedActionParams): ISimTypeContentWithFlags => {
        actionParams.content.textSegments.push(
            new TextSegment("", `${CSS.lineBreak + actionParams.actionValue} ${CSS.lineBreak}`));

        actionParams.content.textSegments.push(new TextSegment());  // For the next bunch of text.

        return getPostActionContentWithUpdatedContentIndex(actionParams);
    },

    backspace: (actionParams: IEscapedActionParams): ISimTypeContentWithFlags => {
        // Backspacing is a weird one. It's simulated by managing a flag that on the first pass
        // sets the number of iterations and turns on the _backspacing flag and NOT changing the contentIndex.
        // Subsequent calls to get the next content will go over the same backspace command and reduce the
        // iteration count by one until we're at 0 or the're no more text in the segment.
        const textSegment = actionParams.content.textSegments.pop()!;

        let isBackspacing: boolean = actionParams.content.status.isBackspacing;
        let backspaceIterations: number = actionParams.content.status.backspaceIterations;

        if (isBackspacing) {
            backspaceIterations--;

            if (actionParams.content.status.quoting) {
                const quoteCharacter = Constants.quoteCharacter;
                textSegment.text = textSegment.text.slice(0, -(1 + quoteCharacter.length)) + quoteCharacter;
            } else
                textSegment.text = textSegment.text.slice(0, -1);

        } else {
            isBackspacing = true;
            backspaceIterations = actionParams.actionValue as number;
        }

        if (textSegment.text.length === 0 || backspaceIterations === 0)
            isBackspacing = false;

        actionParams.content.textSegments.push(textSegment);

        const nextContent: ISimTypeContentWithFlags = {
            ...actionParams.content,
            status: {
                ...actionParams.content.status,
                isBackspacing,
                backspaceIterations
            }
        };

        if (isBackspacing) {
            return {
                ...nextContent,
                contentIndex: nextContent.contentIndex - (
                    Constants.actionCharacters.backspace.length + Constants.escapeCharacter.length),
            };
        } else
            return getPostActionContentWithUpdatedContentIndex({ ...actionParams, content: nextContent });
    },
};

function getPostActionContentWithUpdatedContentIndex(actionParams: IEscapedActionParams): ISimTypeContentWithFlags {
    const contentIndex = actionParams.content.contentIndex +
        actionParams.actionValue.toString().length +
        Constants.escapeCharacter.length;   // Accounting for the closing of the actionValueContent.

    return {
        ...actionParams.content,
        contentIndex
    };
}

interface IEscapedActionParams {
    actionValue: string | number;
    content: ISimTypeContentWithFlags;
}
