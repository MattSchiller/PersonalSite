import TextSegment from "@SimType/TextSegment";
import Constants from "@SimType/Constants";
import { ITypedContentPayload } from "@Interfaces/IAction";
import ISimTypeContent from "@Interfaces/ISimTypeContent";

// Given a string, this module simulates typing of that string into the div
export default class SimType {
    private _backspacing: boolean = false;

    public getNewTypedContentPayload(content: ISimTypeContent): ITypedContentPayload {
        // No more text to write.
        if (content.contentIndex >= content.sourceText.length - 1)
            return content;



        // Check if the next character is escape string
        let nextCharacter = this._getNextCharacter(contentIndex);

        // if it is, do the thing, if not, append to the textSegment

        let nextTextSegments: TextSegment[] = [...currentTextSegments];

        if (contentType == this._contentWrt) return;

        let textSrc;
        if (contentType == this._contentWrt)
            textSrc = this.props.content.writing;
        else if (contentType == this._contentStb)
            textSrc = this.props.content.stub;

        let contentPos = this.state.contentPos
            , typed
            , timeout
            , loopLen = contentType == this._contentStb ? textSrc.length : contentPos + 1;

        while (contentPos < loopLen)
            [typed, contentPos, timeout] = this.singleChar(textSrc, contentPos);

        if (typed == false) return;

        if (contentType == this._contentStb)  //Reset contentPos
            contentPos = this.getInitialState().contentPos;


        let self = this;
        if (timeout) {
            setTimeout(function() {
                self.setState({ typed, contentPos });
            }, timeout);

        } else    //To avoid any race conditions with backspace and so on
            this.setState({ typed, contentPos });

    },

    singleChar: function(textSrc, contentPos) {
    //Given the marked up source, returns the variables needed to create the next state
    let nullifyCall = [false, contentPos + 1, false];

    if (this.state.contentPos >= textSrc.length - 1) return nullifyCall;

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

        if (this._quoting) {    //Insert next char before trailing space
            let text = typed[typed.length - 1].text
                , len = text.length;

            typed[typed.length - 1].text = text.slice(0, -1) + nextChar + text.slice(len - 1);

        } else
            typed[typed.length - 1].text += nextChar;

        timeout = this._charTimeout * Math.random();
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

},

// This goes into the SimTypeComponent.tsx
convertTyped: function() {
    let typed = this.state.typed
        , j = 0
        , formattedTyped = [];

    while (j < typed.length) {
        if (~typed[j].className.indexOf(this._indent)) {
            //Get the className etc for this div
            let thisLineClass = typed[j].className
                , lineContents = [];

            j++;
            //Build the spans for the line's contents
            while (j < typed.length && typed[j].className != this._newLine) {
                lineContents.push(this.toSpan(typed[j], j));
                j++;
            }

            let lineNum = formattedTyped.length + 1 + (this.props.content.numStart || 0);

            lineNum = lineNum < 10 ? " " + (lineNum).toString() : lineNum;

            let lineData = this.toSpan(new TypedBucket(lineNum, "lineNum", ""));

            formattedTyped.push(
                <div key={ j }
                    className = "wholeLine" >
                { lineData }
                < div
                        className = { thisLineClass } >
                { lineContents }
                < br />
                </div>
                < /div>
            )
        } else {
            formattedTyped.push(this.toSpan(typed[j], j));
        }

        j++;
    }

    return formattedTyped;
},

toSpan: function(segment, j) {
    //Handles the conversion of the TypedBuckets into spans/a hrefs
    return (segment.link == "" ?
        <span
            className= { segment.className }
    key = { j } >
        { segment.text }
        < /span>
        :
    <a href={ segment.link }
    target = "_blank"
    key = { j } >
        { segment.text }
        < /a>
    )
},


}
}