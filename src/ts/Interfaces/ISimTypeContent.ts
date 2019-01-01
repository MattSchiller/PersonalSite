import TextSegment from "@SimType/TextSegment";

export default interface ISimTypeContent {
    sourceText: string;
    contentIndex: number;
    textSegments: TextSegment[];
}
