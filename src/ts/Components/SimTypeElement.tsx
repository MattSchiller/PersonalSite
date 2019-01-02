import React from "react";
import TextSegment from "@SimType/TextSegment";

export interface ISimTypeElementProps {
    textSegment: TextSegment;
}

export default class SimTypeElement extends React.PureComponent<ISimTypeElementProps> {
    public render() {
        const textSegment = this.props.textSegment;
        const DomElementType = textSegment.link ? "a" : "span";    // Dynamic component

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
