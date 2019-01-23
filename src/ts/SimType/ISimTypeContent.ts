import { TextSegment } from "@SimType/TextSegment";

export interface ISimTypeContent extends IRawSimTypeContent {
    contentIndex: number;
    textSegments: TextSegment[];
    lineNumberStart?: number;
    status: ISimTypeStatus;
}

export interface IRawSimTypeContent {
    simTypeId: string;
    sourceText: string;
}

export interface ISimTypeStatus {
    [key: string]: any;
    isBackspacing: boolean;
    backspaceIterations: number;
}
