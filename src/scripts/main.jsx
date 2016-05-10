var React   = require('react');
var SimType = require('./SimType/simType.jsx');
var Menu    = require('./menu.jsx');

var About     = "";
var mainPage  = require('./pages/mainPage.js');
var Personal  = require('./pages/personal.js');


var App = React.createClass({
  getInitialState: function() {
    return {
        menuIndex: 0
      , menuItems: [ "index.html"
                   , "projects.js"
                   , "personal.css" ]
      , content:   [ mainPage
                   , {stub: "", writing: ""}
                   , Personal ]
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
        return (
            <SimType content    = { content }
                     options    = { {
                                      animate:  this._alreadyPlayed[i]
                                    , show:     i == this.state.menuIndex } }
                     key        = { i }
              />
          )
      }.bind(this) );
    
    return (
      <div>
        <div id = "header">
          <h1>Matt Schiller</h1>
          <Menu
            items   = { this.state.menuItems }
            clicked = { this.menuClick }
            />
        </div>
        { pages }
      </div>
      )
  }

});
//**********************************Page initialization
ReactDOM.render(
  <App />,
  document.getElementById('content')
);