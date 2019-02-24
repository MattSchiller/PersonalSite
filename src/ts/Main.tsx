import { App } from "@Components/App";
import { store } from "@Redux/Store";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { renderTargetId } from "@SimType/Constants";

ReactDOM.render(
    <Provider store={ store }>
        <App />
    </Provider>,
    document.getElementById(renderTargetId)
);
