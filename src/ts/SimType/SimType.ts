import TextSegment from "@SimType/TextSegment";
import Constants from "@SimType/Constants";
import { ITypedContentPayload } from "@Interfaces/IAction";
import ISimTypeContent from "@Interfaces/ISimTypeContent";

// Given a string, this module simulates typing of that string into the div
export default class SimType {
    private _quoting: boolean = false;
    private _backspacing: boolean = false;
    private _contentIndex: number = -1;

    public async getNextSimTypeContentPayload(content: ISimTypeContent): Promise<ITypedContentPayload> {
        // No more text to "type".
        if (this._contentIndexIsSafe(content.sourceText, content.contentIndex))
            return content;

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this._getNextSimTypeContentPayload(content));
            }, this._getTypingTimeoutMs())
        });

    }

    private _getTypingTimeoutMs(): number {
        const typingTimeoutSeedMs = this._backspacing ? Constants.backTimeoutMs : Constants.charTimeoutMs;
        return typingTimeoutSeedMs * Math.random();
    }

    private _getNextSimTypeContentPayload(content: ISimTypeContent): ITypedContentPayload {
        let nextSimTypeContent: ITypedContentPayload = {
            contentIndex: content.contentIndex,
            textSegments: [...content.textSegments]
        };


        // Process next character;
        let contentIndex = content.contentIndex + 1;
        const nextCharacter = content.sourceText[contentIndex];

        if (nextCharacter === Constants.escapeCharacter) {
            // Process nextCharacter
        } else
            nextSimTypeContent = {
                contentIndex,
                textSegments: this._getNextTextSegments(nextCharacter, content.textSegments)
            }

        return nextSimTypeContent;
    }

    private _getNextTextSegments(nextCharacter: string, textSegments: TextSegment[]): TextSegment[] {
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

    private _contentIndexIsSafe(sourceText: string, contentIndex: number): boolean {
        return (contentIndex <= sourceText.length - 1);
    }
}


singleChar: function(textSrc, contentPos) {

    if (this._backspacing) return nullifyCall;

    contentPos++;

    var nextChar = textSrc[contentPos]
        , typed = this.state.typed
        , timeout = 0;

    if (nextChar == this._escape) {
        //Let's attempt to execute the action command
        if (contentPos + 1 < textSrc.length) {
            contentPos++;

            let actionChar = textSrc[contentPos];
            [typed, contentPos, timeout] = this.attemptAction(actionChar, contentPos, textSrc);

            if (actionChar == "b") return nullifyCall;  //Backspace handles its own looping
        }

    } else {
        //We're appending a regular character or an errored escape char
    }

    return [typed, contentPos, timeout];
},

attemptAction: function(action, contentPos, textSrc) {
    //Backspace: ~b#, # = number of backspaces
    //Pause:     ~p#, # = time in ms to wait
    if (this.escapedActions[action]) {
        contentPos++;
        let value = this.getValue(contentPos, textSrc)
            , digits = value.toString().length;

        contentPos += digits;

        //We call the respective action, returning the values necessary for processing
        return this.escapedActions[action].call(this, value, contentPos);
    }
},

getValue: function(contentPos, textSrc) {
    let str = textSrc.substring(contentPos, textSrc.length)
        , val = str.match(/[^~]+/);

    if (val.length == 0) return false;
    return val[0];
},

escapedActions: {
    b: function(iterations, contentPos) {
        //Backspace, a negative number indicates no timeout should be used

        //FOR NEGATIVE NUMBERS, SHOULD GO RIGHT TO THE NEXT CHARACTER, omit timeout entirely?

        let typed = this.state.typed
            , typedPos = typed.length - 1;

        iterations = parseInt(iterations);

        if (Number.isInteger(iterations)) {

            if (this._quoting)
                typed[typedPos].text = typed[typedPos].text.slice(0, -2) + this._qChar;
            else
                typed[typedPos].text = typed[typedPos].text.slice(0, -1);

            //RIGHT NOW WE LIMIT BEHAVIOR TO NEVER ALLOW BACKSPACING MORE THAN THE CURRENT TEXT BUCKET

            //Check if this text bucket is empty
            if (typed[typedPos].text.length == 0 || Math.abs(iterations) == 1) {
                //We're done backspacing after this call
                this._backspacing = false;
                //if (typed[ typedPos ].text.length != 0) typed.push[ new TypedBucket ];

            } else {
                this._backspacing = true;

                var self = this
                    , nextIterations = iterations > 0 ? iterations - 1 : iterations + 1;

                setTimeout(function() {
                    self.escapedActions.b.call(self, nextIterations, contentPos)
                }, (iterations > 0 ? self._backTimeout : 0))
            }
        }

        this.setState({ typed, contentPos });

        return [false, false, false];
    },

    p: function(timeout, contentPos) {
        //Pause
        return [this.state.typed, contentPos, parseInt(timeout)]
    },

    c: function(classVal, contentPos) {
        //Creates a new typedBucket for this new piece of text and applies the class immediately
        let typed = this.state.typed
            , typedPos = typed.length;

        typed.push(new TypedBucket("", classVal));

        return [typed, contentPos];
    },

    C: function(classVal, contentPos) {
        //Closes the current typedBucket and applies the given class
        let typed = this.state.typed
            , typedPos = typed.length - 1;

        typed[typedPos].className += typed[typedPos].className == "" ? classVal : " " + classVal;
        typed.push(new TypedBucket);

        return [typed, contentPos];
    },

    l: function(immaterialVar, contentPos) {
        //Inserts the number of line breaks specified
        let typed = this.state.typed;

        typed.push(new TypedBucket);
        typed[typed.length - 1].className = this._newLine;
        typed.push(new TypedBucket);

        return [typed, contentPos, self._charTimeout];
    },

    q: function(onOrOff, contentPos) {
        //Adds a double quotes and conveys that there is a trailing quotation mark
        let typed = this.state.typed;

        if (onOrOff == '+') {
            this._quoting = true;
            typed.push(new TypedBucket(this._qChar + this._qChar, this._str));
        } else {
            this._quoting = false;
            typed.push(new TypedBucket);
        }

        return [typed, contentPos];
    },

    a: function(link, contentPos) {
        //Overloads the current TypedBucket with a link value for toSpan to recognize
        let typed = this.state.typed;

        typed[typed.length - 1].link = link;

        return [typed, contentPos];
    }

}