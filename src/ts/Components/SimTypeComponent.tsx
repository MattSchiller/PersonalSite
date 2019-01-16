import { SimTypeElement } from "@Components/SimTypeElement";
import { ITypedContentPayload } from "@Interfaces/IAction";
import { Actions } from "@Redux/Actions";
import CSS from "@Sass/sublimeMonokai.scss";
import { Constants } from "@SimType/Constants";
import { ISimTypeContent } from "@SimType/ISimTypeContent";
import { SimType } from "@SimType/SimType";
import { TextSegment } from "@SimType/TextSegment";
import React from "react";

// This is supplied by the container.
interface ISimTypeComponentProps extends ISimTypeContent {
    pageId: string,
}

// Given a string, this module simulates typing of that string into the div
export class SimTypeComponent extends React.PureComponent<ISimTypeComponentProps> {
    private _simType = new SimType();

    public render() {
        return (
            <div className={ CSS.simType } >
                { this._renderLines() }
            </div>
        );
    }

    private _renderLines(): JSX.Element[] {
        let lines: TextSegment[][] = [[]];

        this.props.textSegments.forEach((textSegment: TextSegment) => {
            if (this._isTextSegmentNewLine(textSegment)) {
                const newLine: TextSegment[] = [textSegment];
                lines.push(newLine);
            } else {
                const linesIndex = lines.length === 0 ? 0 : lines.length - 1;
                lines[linesIndex].push(textSegment);
            }
        });

        // Clean lines for specific char width

        const lineNumberStart = this.props.lineNumberStart || 1;
        return lines.map((line: TextSegment[], index: number) =>
            <SimTypeLine
                key={ index }
                lineNumber={ index + lineNumberStart }
                textSegments={ line } />
        );
    }

    private _isTextSegmentNewLine(textSegment: TextSegment): boolean {
        return ~textSegment.className.indexOf(CSS.lineBreak) ? true : false;
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



    public componentDidMount() {
        this._simulateTyping();
    }

    public componentDidUpdate() {
        this._simulateTyping();
    }

    private _simulateTyping() {
        // Asyncronously wait on the newTypedContentPayload promise and then run the update function
        // when the promise resolves (to handle the timeouts that simulate human typing).
        this._simType.getNextTypedContentPayload({ ...this.props })
            .then(updatedContent => {
                if (this._isUpdatedContentDifferent(updatedContent))
                    Actions.updateSimTypeContent(this.props.pageId, this.props.simTypeId, updatedContent);
                else
                    console.log("Finished typing.")
            })
            .catch(console.log);    // Prints whatever error/return message the library returns.
    }

    private _isUpdatedContentDifferent(updatedContent: ITypedContentPayload): boolean {
        return (
            Object.keys(updatedContent).some((key: string) =>
                updatedContent[key] !== (this.props as ITypedContentPayload)[key]
            )
        );
    }
}

interface ISimTypeLineProps {
    textSegments: TextSegment[];
    lineNumber: number;
}

class SimTypeLine extends React.PureComponent<ISimTypeLineProps> {
    public render() {
        return (
            <div className={ CSS.wholeLine } >
                <div className={ CSS.lineNumber }>{ this.props.lineNumber }</div>
                { this._renderTextSegments() }
            </div>
        )
    }

    private _renderTextSegments(): JSX.Element[] {
        return this.props.textSegments.map((textSegment: TextSegment, index: number) =>
            <SimTypeElement key={ index } textSegment={ textSegment } />);
    }
}
