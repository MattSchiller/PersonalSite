import TextSegment from "@SimType/TextSegment";
import Constants from "@SimType/Constants";
import { ITypedContentPayload } from "@Interfaces/IAction";
import ISimTypeContent from "@Interfaces/ISimTypeContent";

export default class SimType {
    private _processingStartingStub: boolean = false;
    private _quoting: boolean = false;
    private _backspacing: boolean = false;
    private _backspaceInterations: number = 0;
    private _pausing: boolean = false;
    private _pausedMs: number = 0;

    public async getNextTypedContentPayload(content: ISimTypeContent): Promise<ITypedContentPayload> {
        // No more text to "type".
        if (content.contentIndex >= content.sourceText.length)
            return content;

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this._getNextTypedContentPayload(content));
            }, this._getTypingTimeoutMs());
        });
    }

    private _getTypingTimeoutMs(): number {
        let typingTimeoutSeedMs: number;

        if (this._processingStartingStub) {
            this._processingStartingStub = false;
            typingTimeoutSeedMs = 0;
        } else if (this._pausing) {
            this._pausing = false;
            typingTimeoutSeedMs = this._pausedMs;
        } else if (this._backspacing)
            typingTimeoutSeedMs = Constants.backTimeoutMs;
        else
            typingTimeoutSeedMs = Constants.typeTimeoutMs;

        return typingTimeoutSeedMs * Math.random();
    }

    private _getNextTypedContentPayload(content: ISimTypeContent): ITypedContentPayload {
        // Process next character;
        const nextContentIndex = content.contentIndex + 1;
        const nextCharacter = content.sourceText[nextContentIndex];

        if (nextCharacter !== Constants.escapeCharacter)
            return {
                contentIndex: nextContentIndex,
                // We spread the textSegments here so we don't accidentally modify the passed references.
                textSegments: this._appendNextCharacterToTextSegments(nextCharacter, [...content.textSegments])
            };
        else
            return this._getNextContentByProcessingActionCharacter(content);
    }

    private _appendNextCharacterToTextSegments(nextCharacter: string, textSegments: TextSegment[]): TextSegment[] {
        const textSegment = textSegments.pop() || new TextSegment();
        let nextText: string = textSegment.text;

        if (this._quoting)
            // Keep the trailing quotation mark at the end of this text segment.
            nextText = nextText.slice(0, -1) + nextCharacter + nextText.slice(nextText.length - 1);
        else
            nextText += nextCharacter;

        textSegment.text = nextText;
        textSegments.push(textSegment);

        return textSegments;
    }

    private _getNextContentByProcessingActionCharacter(content: ISimTypeContent): ITypedContentPayload {
        const nextContentIndex = content.contentIndex + 2;    // Skipping over the escape character;
        const sourceText = content.sourceText;

        if (this._isContentIndexSafe(sourceText, nextContentIndex)) {
            const actionCharacter = sourceText[nextContentIndex];
            return this._processActionCharacter(
                actionCharacter,
                {
                    ...content,
                    contentIndex: nextContentIndex
                }
            );
        } else {
            console.warn(`Content has open escaped character at end of source text! ${content}`);
            return content;
        }
    }

    private _processActionCharacter(actionCharacter: string, content: ISimTypeContent): ITypedContentPayload {
        const actionValue = this._getActionValue(content.sourceText, content.contentIndex + 1);

        let actionMethod: (actionParams: IEscapedActionParams) => ITypedContentPayload;

        switch (actionCharacter) {
            case "s":
                actionMethod = this._actions.startingStub;
                break;

            case "p":
                actionMethod = this._actions.pause;
                break;

            case "b":
                actionMethod = this._actions.backspace;
                break;

            case "a":
                actionMethod = this._actions.link;
                break;

            case "c":
                actionMethod = this._actions.preClass;
                break;

            case "C":
                actionMethod = this._actions.postClass;
                break;

            case "q":
                actionMethod = this._actions.quote;
                break;

            case "l":
                actionMethod = this._actions.lines;
                break;

            default:
                actionMethod = () => content;
        }

        return actionMethod({ actionValue, content });
    }

    private _getActionValue(sourceText: string, contentIndex: number): string | number {
        const subString = sourceText.substring(contentIndex, sourceText.length);
        const regExpRule = new RegExp("/[^" + Constants.escapeCharacter + "]+/");
        const endOfActionValueRegExMatches: RegExpMatchArray = subString.match(regExpRule) || [];

        if (endOfActionValueRegExMatches.length === 0) {
            console.warn(`Failed to parse any actionValue contents from sourceText! Index: ${contentIndex},
                \n ${sourceText}, }`);
            return 0;
        }
        return endOfActionValueRegExMatches[0];
    }

    private _actions = {
        startingStub: (actionParams: IEscapedActionParams): ITypedContentPayload => {

            // TODO: Write stub functionality that will iterate over the text between ~s~ and return it all at
            // once without a timeout.

            // Find next stub icon
            // Get sourceContent for intervening stuff

            // while contentIndex != sub-sourceContent.length _getNextTypedContentPayload

            // pass sourceContent as "value" to _getPostAction...

            return this._getPostActionContentWithUpdatedContentIndex(actionParams);
        },

        pause: (actionParams: IEscapedActionParams): ITypedContentPayload => {
            this._pausing = true;
            this._pausedMs = actionParams.actionValue as number;

            return this._getPostActionContentWithUpdatedContentIndex(actionParams);
        },

        link: (actionParams: IEscapedActionParams): ITypedContentPayload => {
            const textSegment = actionParams.content.textSegments.pop()!;
            textSegment.link = actionParams.actionValue as string;
            actionParams.content.textSegments.push(textSegment);

            return this._getPostActionContentWithUpdatedContentIndex(actionParams);
        },

        preClass: (actionParams: IEscapedActionParams): ITypedContentPayload => {
            const textSegment = new TextSegment("", actionParams.actionValue as string);
            actionParams.content.textSegments.push(textSegment);

            return this._getPostActionContentWithUpdatedContentIndex(actionParams);
        },

        postClass: (actionParams: IEscapedActionParams): ITypedContentPayload => {
            const textSegment: TextSegment = actionParams.content.textSegments.pop()!;

            textSegment.className += " " + actionParams.actionValue;
            actionParams.content.textSegments.push(textSegment);

            return this._getPostActionContentWithUpdatedContentIndex(actionParams);
        },

        quote: (actionParams: IEscapedActionParams): ITypedContentPayload => {
            if (this._quoting)
                actionParams.content.textSegments.push(new TextSegment());
            else {
                const textSegment = actionParams.content.textSegments.pop()!;
                textSegment.text = Constants.quoteCharacter + Constants.quoteCharacter;
                actionParams.content.textSegments.push(textSegment);
            }

            this._quoting = !this._quoting;

            return this._getPostActionContentWithUpdatedContentIndex(actionParams);
        },

        lines: (actionParams: IEscapedActionParams): ITypedContentPayload => {
            for (let i = 0; i < actionParams.actionValue; i++) {
                actionParams.content.textSegments.push(new TextSegment("", "line"));    // TODO: CSS ADDITION.
            }

            actionParams.content.textSegments.push(new TextSegment());  // For the next bunch of text.

            return this._getPostActionContentWithUpdatedContentIndex(actionParams);
        },

        backspace: (actionParams: IEscapedActionParams): ITypedContentPayload => {
            // Backspacing is a weird one. It's simulated by managing a flag on this class that on the first pass
            // sets the number of iterations and turns on the _backspacing flag and NOT changing the contentIndex.
            // Subsequent calls to get the next content will go over the same backspace command and reduce the
            // iteration count by one until we're at 0 or the're no more text in the segment.
            const textSegment = actionParams.content.textSegments.pop()!;

            if (this._backspacing) {
                this._backspaceInterations--;

                if (this._quoting) {
                    const quoteCharacter = Constants.quoteCharacter;
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

    private _getPostActionContentWithUpdatedContentIndex(actionParams: IEscapedActionParams): ITypedContentPayload {
        const contentIndex = actionParams.content.contentIndex + actionParams.actionValue.toString().length;
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
