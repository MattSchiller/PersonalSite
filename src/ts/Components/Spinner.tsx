import CSS from "@Sass/styles.scss";
import React from "react";

interface ISpinnerProps {
    className: string;
}

export class Spinner extends React.PureComponent<ISpinnerProps> {
    public render() {
        const className: string = `${this.props.className} ${CSS.spinner}`;
        return (
            <div className={ className }>
                <div className={ CSS.ldsEllipsis }>
                    <div /><div /><div /><div />
                </div>
            </div>
        );
    }
}
