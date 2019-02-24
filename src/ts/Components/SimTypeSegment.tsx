import { TextSegment } from "@SimType/TextSegment";
import React from "react";

export interface ISimTypeElementProps {
    textSegment: TextSegment;
}

export class SimTypeSegment extends React.PureComponent<ISimTypeElementProps> {
    public render() {
        const textSegment = this.props.textSegment;
        const DomElementType = textSegment.link ? "a" : "span"; // Dynamic DOM element acting as a React Component.

        return (
            <DomElementType
                className={ textSegment.className }
                // These a-specific attributes won't hurt the span.
                href={ textSegment.link }
                target="_blank"
            >
                { textSegment.text }
                <br />
            </DomElementType>
        );
    }
}
