import { ITypedContentPayload } from "@Interfaces/IAction";
import ISimTypeContent from "@Interfaces/ISimTypeContent";
import SimType from "@SimType/SimType";
import React from "react";
import TextSegment from "@SimType/TextSegment";
import SimTypeElement from "@Components/SimTypeElement";

// This is supplied by the container.
export interface ISimTypeComponentProps extends ISimTypeContent {
    lineNumberStart: number;
    updateTypedContent: (typedContentPayload: ITypedContentPayload) => void;
}

// Given a string, this module simulates typing of that string into the div
export default class SimTypeComponent extends React.PureComponent<ISimTypeComponentProps> {
    private _simType = new SimType();

    public render() {
        return (
            <div className="simType" >
                { this._createElementsFromTextSegments() }
            </div>
        );
    }

    private _createElementsFromTextSegments(): JSX.Element[] {
        return this.props.textSegments.map((textSegment: TextSegment, index: number) =>
            <SimTypeElement key={ index } textSegment={ textSegment } />
        );
    }

    public componentDidUpdate() {
        // Asyncronously wait on the newTypedContentPayload promise and then run the update function
        // when the promise resolves (to handle the timeouts that simulate human typing).
        this._simType.getNextTypedContentPayload({ ...this.props })
            .then(this.props.updateTypedContent);
    }
}

// Output needs to be

// [ <lineNumberElement>, ...All elements until newLine or Indent class]

// let typed = this.state.typed
//     , j = 0
//     , formattedTyped = [];

// while (j < typed.length) {
//     if (~typed[j].className.indexOf(this._indent)) {
//         //Get the className etc for this div
//         let thisLineClass = typed[j].className
//             , lineContents = [];

//         j++;
//         //Build the spans for the line's contents
//         while (j < typed.length && typed[j].className != this._newLine) {
//             lineContents.push(this.toSpan(typed[j], j));
//             j++;
//         }

//         let lineNum = formattedTyped.length + 1 + (this.props.content.numStart || 0);

//         lineNum = lineNum < 10 ? " " + (lineNum).toString() : lineNum;

//         let lineData = this.toSpan(new TypedBucket(lineNum, "lineNum", ""));

//         formattedTyped.push(
//             <div key={ j }
//                 className="wholeLine" >
//                 { lineData }
//                 < div
//                     className={ thisLineClass } >
//                     { lineContents }
//                     < br />
//                 </div>
//                 < /div>
//             )
//         } else {
//                     formattedTyped.push(this.toSpan(typed[j], j));
//                 }

//                 j++;
//             }

//             return formattedTyped;
//         },