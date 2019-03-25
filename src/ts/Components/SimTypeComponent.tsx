import { SimTypeLine } from "@Components/SimTypeLine";
import { getThemedClassName } from "@Helpers/Theming";
import { Actions } from "@Redux/Actions";
import { ITypedContentPayload } from "@Redux/Interfaces/IAction";
import { IStore, IStoreTheme } from "@Redux/Interfaces/IStore";
import { getActiveTheme } from "@Redux/Store";
import CSS from "@Sass/styles.scss";
import { ISimTypeContent } from "@SimType/ISimTypeContent";
import { getNextTypedContentPayloadPromise } from "@SimType/SimType";
import { getTrimmedLines } from "@SimType/SimTypePrerendering";
import { TextSegment } from "@SimType/TextSegment";
import React from "react";
import { connect } from "react-redux";

// This is supplied by the container.
interface ISimTypeComponentProps extends ISimTypeContent, IStoreTheme {
    pageId: string;
}

interface ISimTypeComponentState {
    isFinishedTyping: boolean;
}

// Given a string, this module simulates typing of that string into the div.
class SimTypeComponent extends React.PureComponent<ISimTypeComponentProps, ISimTypeComponentState> {
    // This is important to keep from any other updates (like them changes) from kicking off another typing increment.
    private _isDuringTypingTimeout: boolean = false;

    constructor(props: ISimTypeComponentProps) {
        super(props);
        this.state = { isFinishedTyping: false };
    }

    public componentDidMount() {
        this._simulateTyping();
    }

    public componentDidUpdate() {
        this._simulateTyping();
    }

    private _simulateTyping() {
        if (this._isDuringTypingTimeout)
            return;

        this._isDuringTypingTimeout = true;
        // Asyncronously wait on the newTypedContentPayload promise and then run the update function
        // when the promise resolves (to handle the timeouts that simulate human typing).
        getNextTypedContentPayloadPromise({ ...this.props })
            .then(updatedContent => {
                this._isDuringTypingTimeout = false;

                if (this._isUpdatedContentDifferent(updatedContent))
                    Actions.updateSimTypeContent(this.props.pageId, this.props.simTypeId, updatedContent);
                else
                    this.setState({ isFinishedTyping: true });
            })
            .catch(console.log);
    }

    private _isUpdatedContentDifferent(updatedContent: ITypedContentPayload): boolean {
        const typedProps: ITypedContentPayload = this.props as ITypedContentPayload;

        return Object.keys(updatedContent).some((key: string) => {
            const objectValue: any = updatedContent[key];

            if (typeof objectValue === "object")
                // We only go one-layer deep in our state comparison, which is weak.
                return Object.keys(objectValue).some((subKey: string) =>
                    objectValue[subKey] !== typedProps[key][subKey]);
            else
                return updatedContent[key] !== typedProps[key];
        });
    }

    public render() {
        return (
            <div className={ this._getClassName() } >
                { this._renderLines(getTrimmedLines(this.props.textSegments)) }
            </div>
        );
    }

    private _getClassName(): string {
        return `${getThemedClassName(CSS.simType)}
            ${this.state.isFinishedTyping ? "" : CSS.typing}`;
    }

    private _renderLines(lines: TextSegment[][]): JSX.Element[] {
        const lineNumberStart = this.props.lineNumberStart || 1;

        return lines.map(
            (textSegments: TextSegment[], index: number) => (
                <SimTypeLine
                    key={ index }
                    lineNumber={ lineNumberStart + index }
                    textSegments={ textSegments }
                    isCurrentLine={ (lines.length - 1) === index }
                    status={ this.props.status }
                />
            )
        );
    }
}

function mapStateToProps(state: IStore) {
    return {
        activeTheme: getActiveTheme()
    };
}

const ConnectedSimTypeComponent = connect(mapStateToProps)(SimTypeComponent);
export { ConnectedSimTypeComponent as SimTypeComponent };
