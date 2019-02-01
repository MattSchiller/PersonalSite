import { TextSegment } from "@SimType/TextSegment";

export interface ISimTypeContentWithFlags extends ISimTypeContent {
    pausing?: boolean;
    pausedMs?: number;
    stubbing?: boolean;
}

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
    isQuoting: boolean;
}
