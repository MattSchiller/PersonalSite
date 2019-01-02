import React from "react";
// import "@Sass/styles";
import { connect } from "react-redux";
import IStore from "@Interfaces/IStore";
import Menu, { IMenuItem } from "@Components/Menu";

// var About = require("./pages/about.js");
// var Hobbies = require("./pages/hobbies.js");
// var Projects = require("./pages/projects.js");
// var Contact = require("./pages/contact.js");

class App extends React.PureComponent {
    public render() {
        const items: IMenuItem[] = [{
            pageId: "id1",
            display: "ONE"
        }, {
            pageId: "id2",
            display: "TWO"
        }];

        return [
            <Menu key={ "menu" } items={ items } />,
            // <SimTypePage content={ "" } contentIndex={ 0 } />
        ];
    }
}

const mapStateToProps = (state: IStore) => ({ ...state });

export default connect(
    mapStateToProps
)(App);
