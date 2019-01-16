import { ITypedContentPayload } from "@Interfaces/IAction";
import { constants } from "@SimType/Constants";
import { ISimTypeContent } from "@SimType/ISimTypeContent";
import { TextSegment } from "@SimType/TextSegment";

export class SimType {
    private _quoting: boolean = false;
    private _backspacing: boolean = false;
    private _backspaceInterations: number = 0;
    private _pausing: boolean = false;
    private _pausedMs: number = 0;
    private _startingStubbing: boolean = false;

    public async getNextTypedContentPayload(content: ISimTypeContent): Promise<ITypedContentPayload> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const nextContent = this._getNextTypedContentPayload(content);

                    resolve({
                        contentIndex: nextContent.contentIndex,
                        textSegments: nextContent.textSegments
                    });
                } catch (error) {
                    reject(error.message);
                }
            }, this._getTypingTimeoutMs());
        });
    }

    private _getTypingTimeoutMs(): number {
        let typingTimeoutSeedMs: number;

        if (this._pausing) {
            this._pausing = false;
            typingTimeoutSeedMs = this._pausedMs;
        } else if (this._backspacing)
            typingTimeoutSeedMs = constants.backTimeoutMs;
        else
            typingTimeoutSeedMs = constants.typeTimeoutMs;

        return typingTimeoutSeedMs * Math.random();
    }

    private _getNextTypedContentPayload(content: ISimTypeContent): ISimTypeContent {
        const contentIndex = content.contentIndex;

        if (!this._isContentIndexSafe(content.sourceText, content.contentIndex))
            return content;

        // Process next character;
        const nextCharacter = content.sourceText[contentIndex];

        if (nextCharacter !== constants.escapeCharacter)
            return {
                ...content,
                contentIndex: contentIndex + 1,
                // We spread the textSegments here so we don't accidentally modify the passed references.
                textSegments: this._appendNextCharacterToTextSegments(nextCharacter, [...content.textSegments])
            };
        else
            return {
                ...content,
                ...this._getNextContentByProcessingActionCharacter({
                    ...content,
                    contentIndex: contentIndex + 1  // Skipping over the escape character.
                })
            };
    }

    private _appendNextCharacterToTextSegments(nextCharacter: string, textSegments: TextSegment[]): TextSegment[] {
        let nextTextSegment: TextSegment = TextSegment.clone(this._getMostRecentTextSegment(textSegments));
        let nextText = nextTextSegment.text;

        if (this._quoting)
            // Keep the trailing quotation mark at the end of this text segment.
            nextText = nextText.slice(0, -1) + nextCharacter + nextText.slice(nextText.length - 1);
        else
            nextText += nextCharacter;

        nextTextSegment.text = nextText;

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
            console.log("next content:", actionCharacter)
            return this._processActionCharacter(
                actionCharacter,
                {
                    ...content,
                    contentIndex: contentIndex + 1   // Skipping over the action character.
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
            case constants.actionCharacters.startingStub:
                actionMethod = this._actions.startingStub;
                break;

            case constants.actionCharacters.pause:
                actionMethod = this._actions.pause;
                break;

            case constants.actionCharacters.backspace:
                actionMethod = this._actions.backspace;
                break;

            case constants.actionCharacters.link:
                actionMethod = this._actions.link;
                break;

            case constants.actionCharacters.preClass:
                actionMethod = this._actions.preClass;
                break;

            case constants.actionCharacters.postClass:
                actionMethod = this._actions.postClass;
                break;

            case constants.actionCharacters.quote:
                actionMethod = this._actions.quote;
                break;

            case constants.actionCharacters.line:
                actionMethod = this._actions.lines;
                break;

            default:
                actionMethod = () => content;
        }

        return actionMethod({ actionValue, content });
    }

    private _getActionValue(sourceText: string, contentIndex: number): string | number {
        const subString = sourceText.substring(contentIndex, sourceText.length);
        const regExpRule = new RegExp("^[^" + constants.escapeCharacter + "]*");
        const endOfActionValueRegExMatches: RegExpMatchArray = subString.match(regExpRule) || [];

        // console.log("remaining:", subString)
        if (endOfActionValueRegExMatches.length === 0)
            throw new CannotSimulateTypingError(
                "Failed to parse any actionValue contents from sourceText!", contentIndex, sourceText)

        return endOfActionValueRegExMatches[0];
    }

    private _actions = {
        startingStub: (actionParams: IEscapedActionParams): ISimTypeContent => {
            console.log("startingStubbing?", this._startingStubbing)
            if (!this._startingStubbing) {
                // Start whipping through processing the content, skipping any sort of timeout/promises.
                this._startingStubbing = true;
                let content = actionParams.content;





                while (this._startingStubbing && this._isContentIndexSafe(content.sourceText, content.contentIndex)) {
                    content.contentIndex++;
                    console.log("INDEX: ", content.contentIndex)




                    // Seems we need to increment the contentIndex by one more or something??




                    content = {
                        ...content,
                        ...this._getNextTypedContentPayload(content)
                    };
                }

                actionParams.content = content;

            } else
                // We've found the end of the starting stub of text.
                this._startingStubbing = false;

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
            if (this._quoting)
                actionParams.content.textSegments.push(new TextSegment());
            else {
                const textSegment = actionParams.content.textSegments.pop()!;
                textSegment.text = constants.quoteCharacter + constants.quoteCharacter;
                actionParams.content.textSegments.push(textSegment);
            }

            this._quoting = !this._quoting;

            return this._getPostActionContentWithUpdatedContentIndex(actionParams);
        },

        lines: (actionParams: IEscapedActionParams): ISimTypeContent => {
            for (let i = 0; i < actionParams.actionValue; i++) {
                actionParams.content.textSegments.push(new TextSegment("", "line"));    // TODO: CSS ADDITION.
            }

            actionParams.content.textSegments.push(new TextSegment());  // For the next bunch of text.

            return this._getPostActionContentWithUpdatedContentIndex(actionParams);
        },

        backspace: (actionParams: IEscapedActionParams): ISimTypeContent => {
            // Backspacing is a weird one. It's simulated by managing a flag on this class that on the first pass
            // sets the number of iterations and turns on the _backspacing flag and NOT changing the contentIndex.
            // Subsequent calls to get the next content will go over the same backspace command and reduce the
            // iteration count by one until we're at 0 or the're no more text in the segment.
            const textSegment = actionParams.content.textSegments.pop()!;

            if (this._backspacing) {
                this._backspaceInterations--;

                if (this._quoting) {
                    const quoteCharacter = constants.quoteCharacter;
                    textSegment.text = textSegment.text.slice(0, -(1 + quoteCharacter.length)) + quoteCharacter;
                } else
                    textSegment.text = textSegment.text.slice(0, -1);

            } else {
                this._backspacing = true;
                this._backspaceInterations = actionParams.actionValue as number - 1;
            }

            if (textSegment.text.length === 0 || this._backspaceInterations === 0)
                this._backspacing = false;

            actionParams.content.textSegments.push(textSegment);

            if (this._backspacing)
                return {
                    ...actionParams.content,
                    // TODO: remove magic number (2) by actually checking length of escape & "b" characters.
                    contentIndex: actionParams.content.contentIndex - 2
                };
            else
                return this._getPostActionContentWithUpdatedContentIndex(actionParams);
        },
    };

    private _getPostActionContentWithUpdatedContentIndex(actionParams: IEscapedActionParams): ISimTypeContent {
        const contentIndex = actionParams.content.contentIndex +
            actionParams.actionValue.toString().length +
            constants.escapeCharacter.length;   // Accounting for the closing of the actionValueContent.

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