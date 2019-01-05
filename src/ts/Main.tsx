import App from "@Components/App";
import rootReducer from "@Redux/Reducers";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension";

const store = createStore(rootReducer, devToolsEnhancer({}));

render(
    <Provider store={ store }>
        <App />
    </Provider>,
    document.getElementById("content")
);
