import { AppContainer } from "@Components/App";
import { store } from "@Redux/Store";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

render(
    <Provider store={ store }>
        <AppContainer />
    </Provider>,
    document.getElementById("content")
);
