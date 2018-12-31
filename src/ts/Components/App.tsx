
import React from "react";
// import SimType from "../SimType/simType";
// import Menu from "../menu.js";
import "@Sass/styles";
import { connect } from 'react-redux'
import ActionTypes from "@Redux/actions.js";
import { Dispatch } from "redux";
import IAction from "@Interfaces/IAction.js";
import IStore from "@Interfaces/IStore";

var About = require("./pages/about.js");
var Hobbies = require("./pages/hobbies.js");
var Projects = require("./pages/projects.js");
var Contact = require("./pages/contact.js");



const mapStateToProps = (state: IStore) => ({ ...state });

const mapDispatchToProps = (dispatch: Dispatch<IAction>) => {
    setActivePage: (pageId: string) => {
        dispatch({
            type: ActionTypes.SET_ACTIVE_PAGE,
            payload: { pageId }
        })
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)





class App extends React.PureComponent {

    private _onClick = () => {
        this.props.setActivePage(this.props.pageId);
    };

    render: function() {
    let pages = this.state.content.map(function(content, i) {
        let myElements = [];
        for (let eachContent of content) {
            myElements.push(
                <SimType content={ eachContent }
                    options={ {
                        show: i == this.state.menuIndex
                    } }
                    key={ i + myElements.length }
                />
            )
        }
        return myElements;
    }.bind(this));

    return (
        <div>
            <div id="header">
                <h2 onClick={ function() {
                    this.menuClick(0)
                }.bind(this) }
                >Matt Schiller</h2>
                <Menu
                    items={ this.state.menuItems }
                    clicked={ this.menuClick }
                    currInd={ this.state.menuIndex }
                    resume={ this.state.menuItems[2] }
                />
            </div>
            <div id="codePages">
                { pages }
            </div>
        </div>
    )
}
}



    // getInitialState: function() {
    //     return {
    //         menuIndex: 0
    //         , menuItems: ["about.html"
    //             , "projects.js"
    //             , "resume.pdf"
    //             , "hobbies.css"
    //             , "contact.json"]
    //         , content: [[About]
    //             , Projects
    //             , [{ stub: "", writing: "" }]
    //             , [Hobbies]
    //             , [Contact]
    //         ]
    //     }
    // },