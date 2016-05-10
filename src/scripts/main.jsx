var React   = require('react');
var SimType = require('./SimType/simType.jsx');
var Menu    = require('./menu.jsx');

var About  = require('./pages/about.js');
var Personal  = require('./pages/personal.js');
var Projects  = require('./pages/projects.js');


var App = React.createClass({
  getInitialState: function() {
    return {
        menuIndex: 0
      , menuItems: [ "about.html"
                   , "resume.pdf"
                   , "projects.js"
                   , "personal.css" ]
      , content:   [ [ About ]
                   , [ {stub: "", writing: ""} ]
                   , Projects
                   , [ Personal ] ]
    }
  },
  
  componentWillMount: function() {
    this._alreadyPlayed = [];
    for (let i = 0; i < this.state.menuItems.length; i++) {
      this._alreadyPlayed.push(false);
    }
  },
  
  menuClick: function(menuIndex) {
    this._alreadyPlayed[ this.state.menuIndex ] = true;
    this.setState({ menuIndex });
  },
  
  render: function() {
    let pages = this.state.content.map( function(content, i) {
        let myElements = [];
        for (let eachContent of content) {
          myElements.push(
              <SimType content    = { eachContent }
                       options    = { {
                                        animate:  this._alreadyPlayed[i]
                                      , show:     i == this.state.menuIndex } }
                       key        = { i + myElements.length }
                />
            )
        }
        return myElements;
      }.bind(this) );
    
    return (
      <div>
        <div id = "header">
          <h2>Matt Schiller</h2>
          <Menu
            items   = { this.state.menuItems }
            clicked = { this.menuClick }
            />
        </div>
        <div id = "codePages">
        { pages }
        </div>
      </div>
      )
  }

});
//**********************************Page initialization
ReactDOM.render(
  <App />,
  document.getElementById('content')
);