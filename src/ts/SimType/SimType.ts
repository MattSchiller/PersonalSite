import CSS from "@Sass/sublimeMonokai.scss";
import { ITypedContentPayload } from "@Interfaces/IAction";
import { Constants } from "@SimType/Constants";
import { ISimTypeContent } from "@SimType/ISimTypeContent";
import { TextSegment } from "@SimType/TextSegment";

export class SimType {
    private _pausing: boolean = false;
    private _pausedMs: number = 0;
    private _startingStubbing: boolean = false;

    public async getNextTypedContentPayload(content: ISimTypeContent): Promise<ITypedContentPayload> {
        return new Promise((resolve, reject) => {
            try {
                const nextContent: ISimTypeContent = this._getNextTypedContentPayload(content);

                setTimeout(() => {
                    resolve({
                        contentIndex: nextContent.contentIndex,
                        textSegments: nextContent.textSegments,
                        status: { ...nextContent.status }
                    });
                }, this._getTypingTimeoutMs(nextContent));
            } catch (error) {
                reject(error.message);
            }
        });
    }

    private _getTypingTimeoutMs(nextContent: ISimTypeContent): number {
        let typingTimeoutMs: number;

        if (this._pausing) {
            this._pausing = false;
            typingTimeoutMs = this._pausedMs;
            this._pausedMs = 0;
        } else if (nextContent.status.isBackspacing)
            typingTimeoutMs = Constants.backTimeoutMs * Math.random();
        else
            typingTimeoutMs = Constants.typeTimeoutMs * Math.random();

        return typingTimeoutMs;
    }

    private _getNextTypedContentPayload(content: ISimTypeContent): ISimTypeContent {
        const contentIndex = content.contentIndex;

        if (!this._isContentIndexSafe(content.sourceText, content.contentIndex))
            return content;

        // Process next character;
        const nextCharacter = content.sourceText[contentIndex];

        if (nextCharacter !== Constants.escapeCharacter)
            return {
                ...content,
                contentIndex: contentIndex + 1,

                textSegments: this._appendNextCharacterToTextSegments(
                    nextCharacter,
                    [...content.textSegments],  // We spread the textSegments so we don't modify the passed references.
                    content.status.isQuoting)
            };
        else
            return {
                ...content,
                ...this._getNextContentByProcessingActionCharacter({
                    ...content,
                    contentIndex: contentIndex + Constants.escapeCharacter.length  // Skipping over the escape character
                })
            };
    }

    private _appendNextCharacterToTextSegments(
        nextCharacter: string,
        textSegments: TextSegment[],
        isQuotiing: boolean
    ): TextSegment[] {
        let nextTextSegment: TextSegment = TextSegment.clone(this._getMostRecentTextSegment(textSegments));
        let nextText = nextTextSegment.text;

        if (isQuotiing) {
            // Keep the trailing quotation mark at the end of this text segment.
            nextTextSegment.text = nextTextSegment.text.substr(0, nextTextSegment.text.length - 1);
            nextText = nextCharacter + Constants.quoteCharacter;
        } else
            nextText = nextCharacter;

        nextTextSegment.text += nextText;

        // We return a new object here so that we're not manipulating theprevious state directly
        return [...textSegments, nextTextSegment];
    }

    private _getMostRecentTextSegment(textSegments: TextSegment[]): TextSegment {
        if (textSegments.length > 0)
            return textSegments.pop()!;
        else
            return new TextSegment();
    }

    private _getNextContentByProcessingActionCharacter(content: ISimTypeContent): ISimTypeContent {
        const contentIndex = content.contentIndex;
        const sourceText = content.sourceText;

        if (this._isContentIndexSafe(sourceText, contentIndex)) {
            const actionCharacter = sourceText[contentIndex];
            return this._processActionCharacter(
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

    private _processActionCharacter(actionCharacter: string, content: ISimTypeContent): ISimTypeContent {
        const actionValue = this._getActionValue(content.sourceText, content.contentIndex);

        let actionMethod: (actionParams: IEscapedActionParams) => ISimTypeContent;

        switch (actionCharacter) {
            case Constants.actionCharacters.startingStub:
                actionMethod = this._actions.startingStub;
                break;

            case Constants.actionCharacters.pause:
                actionMethod = this._actions.pause;
                break;

            case Constants.actionCharacters.backspace:
                actionMethod = this._actions.backspace;
                break;

            case Constants.actionCharacters.link:
                actionMethod = this._actions.link;
                break;

            case Constants.actionCharacters.preClass:
                actionMethod = this._actions.preClass;
                break;

            case Constants.actionCharacters.postClass:
                actionMethod = this._actions.postClass;
                break;

            case Constants.actionCharacters.quote:
                actionMethod = this._actions.quote;
                break;

            case Constants.actionCharacters.line:
                actionMethod = this._actions.line;
                break;

            default:
                actionMethod = () => content;
        }

        return actionMethod({ actionValue, content });
    }

    private _getActionValue(sourceText: string, contentIndex: number): string | number {
        const subString = sourceText.substring(contentIndex, sourceText.length);
        const regExpRule = new RegExp("^[^" + Constants.escapeCharacter + "]*");
        const endOfActionValueRegExMatches: RegExpMatchArray = subString.match(regExpRule) || [];

        console.log("index:", contentIndex)
        console.log("matches:", endOfActionValueRegExMatches)
        if (endOfActionValueRegExMatches.length === 0)
            throw new CannotSimulateTypingError(
                "Failed to parse any actionValue contents from sourceText!", contentIndex, sourceText)

        return endOfActionValueRegExMatches[0];
    }

    private _actions = {
        startingStub: (actionParams: IEscapedActionParams): ISimTypeContent => {
            if (!this._startingStubbing) {
                // Start whipping through processing the content, skipping any sort of timeout/promises.
                this._startingStubbing = true;

                let content = actionParams.content;

                // Account for having to skip over own character.
                content.contentIndex += Constants.actionCharacters.startingStub.length;

                while (this._startingStubbing && this._isContentIndexSafe(content.sourceText, content.contentIndex)) {
                    content = {
                        ...content,
                        ...this._getNextTypedContentPayload(content)
                    };
                }

                actionParams.content = content;

            } else {
                // We've found the end of the starting stub of text.
                this._startingStubbing = false;

                // Undo having to skip over own character.
                actionParams.content.contentIndex -= Constants.actionCharacters.startingStub.length;
            }

            return this._getPostActionContentWithUpdatedContentIndex(actionParams);
        },

        pause: (actionParams: IEscapedActionParams): ISimTypeContent => {
            this._pausing = true;
            this._pausedMs = actionParams.actionValue as number;

            return this._getPostActionContentWithUpdatedContentIndex(actionParams);
        },

        link: (actionParams: IEscapedActionParams): ISimTypeContent => {
            const textSegment = actionParams.content.textSegments.pop()!;
            textSegment.link = actionParams.actionValue as string;
            actionParams.content.textSegments.push(textSegment);

            return this._getPostActionContentWithUpdatedContentIndex(actionParams);
        },

        preClass: (actionParams: IEscapedActionParams): ISimTypeContent => {
            const textSegment = new TextSegment("", actionParams.actionValue as string);
            actionParams.content.textSegments.push(textSegment);

            return this._getPostActionContentWithUpdatedContentIndex(actionParams);
        },

        postClass: (actionParams: IEscapedActionParams): ISimTypeContent => {
            const textSegment: TextSegment = actionParams.content.textSegments.pop() || new TextSegment();

            textSegment.className += " " + actionParams.actionValue;
            actionParams.content.textSegments.push(textSegment);

            return this._getPostActionContentWithUpdatedContentIndex(actionParams);
        },

        quote: (actionParams: IEscapedActionParams): ISimTypeContent => {


            if (!actionParams.content.status.isQuoting) {
                const textSegment: TextSegment = actionParams.content.textSegments.pop()!;
                textSegment.text += Constants.quoteCharacter + Constants.quoteCharacter;
                actionParams.content.textSegments.push(textSegment);
            }

            actionParams.content.status.isQuoting = !actionParams.content.status.isQuoting;

            return this._getPostActionContentWithUpdatedContentIndex(actionParams);
        },

        line: (actionParams: IEscapedActionParams): ISimTypeContent => {
            actionParams.content.textSegments.push(new TextSegment("", CSS.lineBreak));

            actionParams.content.textSegments.push(new TextSegment());  // For the next bunch of text.

            return this._getPostActionContentWithUpdatedContentIndex(actionParams);
        },

        backspace: (actionParams: IEscapedActionParams): ISimTypeContent => {
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

            const nextContent: ISimTypeContent = {
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
                return this._getPostActionContentWithUpdatedContentIndex({ ...actionParams, content: nextContent });
        },
    };

    private _getPostActionContentWithUpdatedContentIndex(actionParams: IEscapedActionParams): ISimTypeContent {
        const contentIndex = actionParams.content.contentIndex +
            actionParams.actionValue.toString().length +
            Constants.escapeCharacter.length;   // Accounting for the closing of the actionValueContent.

        return {
            ...actionParams.content,
            contentIndex
        };
    }

    private _isContentIndexSafe(sourceText: string, contentIndex: number): boolean {
        return (contentIndex <= sourceText.length - 1);
    }
}

interface IEscapedActionParams {
    actionValue: string | number;
    content: ISimTypeContent;
}

class CannotSimulateTypingError extends Error {
    constructor(message: string, index: number, source: string) {
        super(`${message} \n Index: ${index}, \n ${source}`);
    }
}