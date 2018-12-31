import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "@Redux/Reducers";

const store = createStore(rootReducer);

render(
    <Provider store={ store }>
        <div />
        {/* MAIN APP HERE */ }
    </Provider>,
    document.getElementById("content")
);

// import React from "react";
// import SimType from "./SimType/simType.jsx";
// import Menu from "./menu.jsx";
// import "@Sass/styles";

// var About = require("./pages/about.js");
// var Hobbies = require("./pages/hobbies.js");
// var Projects = require("./pages/projects.js");
// var Contact = require("./pages/contact.js");

// var App = React.createClass({
//     getInitialState: function() {
//         return {
//             menuIndex: 0
//             , menuItems: ["about.html"
//                 , "projects.js"
//                 , "resume.pdf"
//                 , "hobbies.css"
//                 , "contact.json"]
//             , content: [[About]
//                 , Projects
//                 , [{ stub: "", writing: "" }]
//                 , [Hobbies]
//                 , [Contact]
//             ]
//         }
//     },

//     menuClick: function(menuIndex) {
//         if (menuIndex != this.state.menuIndex)
//             this.setState({ menuIndex });
//     },

//     render: function() {
//         let pages = this.state.content.map(function(content, i) {
//             let myElements = [];
//             for (let eachContent of content) {
//                 myElements.push(
//                     <SimType content={ eachContent }
//                         options={ {
//                             show: i == this.state.menuIndex
//                         } }
//                         key={ i + myElements.length }
//                     />
//                 )
//             }
//             return myElements;
//         }.bind(this));

//         return (
//             <div>
//                 <div id="header">
//                     <h2 onClick={ function() {
//                         this.menuClick(0)
//                     }.bind(this) }
//                     >Matt Schiller</h2>
//                     <Menu
//                         items={ this.state.menuItems }
//                         clicked={ this.menuClick }
//                         currInd={ this.state.menuIndex }
//                         resume={ this.state.menuItems[2] }
//                     />
//                 </div>
//                 <div id="codePages">
//                     { pages }
//                 </div>
//             </div>
//         )
//     }

// });
// //**********************************Page initialization
// ReactDOM.render(
//     <App />,
//     document.getElementById("content")
// );