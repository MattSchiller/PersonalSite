import { ITypedContentPayload } from "@Redux/Interfaces/IAction";
import { Constants } from "@SimType/Constants";
import { ISimTypeContent, ISimTypeContentWithFlags } from "@SimType/ISimTypeContent";
import { processActionCharacter } from "@SimType/SimTypeActions";
import { TextSegment } from "@SimType/TextSegment";

export async function getNextTypedContentPayloadPromise(content: ISimTypeContent): Promise<ITypedContentPayload> {
    return new Promise((resolve, reject) => {
        try {
            const nextContent: ISimTypeContentWithFlags = getNextTypedContentPayload(content);

            setTimeout(() => {
                resolve({
                    contentIndex: nextContent.contentIndex,
                    textSegments: nextContent.textSegments,
                    status: { ...nextContent.status }
                });
            }, getTypingTimeoutMs(nextContent));
        } catch (error) {
            reject(error.message);
        }
    });
}

function getTypingTimeoutMs(nextContent: ISimTypeContentWithFlags): number {
    let typingTimeoutMs: number;

    if (nextContent.pausing && nextContent.pausedMs) {
        typingTimeoutMs = nextContent.pausedMs;
        nextContent.pausedMs = undefined;
        nextContent.pausing = undefined;
    } else if (nextContent.status.isBackspacing)
        typingTimeoutMs = Constants.backTimeoutMs * Math.random();
    else
        typingTimeoutMs = Constants.typeTimeoutMs * Math.random();

    return typingTimeoutMs;
}

export function getNextTypedContentPayload(content: ISimTypeContentWithFlags): ISimTypeContentWithFlags {
    const contentIndex = content.contentIndex;

    if (!isContentIndexSafe(content.sourceText, content.contentIndex))
        return content;

    // Process next character;
    const nextCharacter = content.sourceText[contentIndex];

    if (nextCharacter !== Constants.escapeCharacter)
        return {
            ...content,
            contentIndex: contentIndex + 1,

            textSegments: appendNextCharacterToTextSegments(
                nextCharacter,
                [...content.textSegments],  // We spread the textSegments so we don't modify the passed references.
                content.status.isQuoting)
        };
    else
        return {
            ...content,
            ...getNextContentByProcessingActionCharacter({
                ...content,
                contentIndex: contentIndex + Constants.escapeCharacter.length  // Skipping over the escape character
            })
        };
}

function appendNextCharacterToTextSegments(
    nextCharacter: string,
    textSegments: TextSegment[],
    isQuoting: boolean
): TextSegment[] {
    const nextTextSegment: TextSegment = TextSegment.clone(getMostRecentTextSegment(textSegments));
    let nextText = nextTextSegment.text;

    if (isQuoting) {
        // Keep the trailing quotation mark at the end of this text segment.
        nextTextSegment.text = nextTextSegment.text.substr(0, nextTextSegment.text.length - 1);
        nextText = nextCharacter + Constants.quoteCharacter;
    } else
        nextText = nextCharacter;

    nextTextSegment.text += nextText;

    // We return a new object here so that we're not manipulating theprevious state directly
    return [...textSegments, nextTextSegment];
}

function getMostRecentTextSegment(textSegments: TextSegment[]): TextSegment {
    if (textSegments.length > 0)
        return textSegments.pop()!;
    else
        return new TextSegment();
}

function getNextContentByProcessingActionCharacter(content: ISimTypeContentWithFlags): ISimTypeContentWithFlags {
    const contentIndex = content.contentIndex;
    const sourceText = content.sourceText;

    if (isContentIndexSafe(sourceText, contentIndex)) {
        const actionCharacter = sourceText[contentIndex];
        return processActionCharacter(
            actionCharacter,
            {
                ...content,
                contentIndex: contentIndex + actionCharacter.length   // Skipping over the action character.
            }
        );
    } else
        throw new CannotSimulateTypingError(
            "Content has open escaped character at end of source text!", contentIndex, sourceText);
}

export function isContentIndexSafe(sourceText: string, contentIndex: number): boolean {
    return (contentIndex <= sourceText.length - 1);
}

export class CannotSimulateTypingError extends Error {
    constructor(message: string, index: number, source: string) {
        super(`${message} \n Index: ${index}, \n ${source}`);
    }
}
