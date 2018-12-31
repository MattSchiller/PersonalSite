import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "@Redux/Reducers";
import App from "src/ts/Components/App";

const store = createStore(rootReducer);

render(
    <Provider store={ store }>
        <App />
    </Provider>,
    document.getElementById("content")
);
