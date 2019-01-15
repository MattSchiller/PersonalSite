import { TextSegment } from "@SimType/TextSegment";

export interface ISimTypeContent extends IRawSimTypeContent {
    contentIndex: number;
    textSegments: TextSegment[];
    lineNumberStart?: number;
}

export interface IRawSimTypeContent {
    simTypeId: string;
    sourceText: string;
}
