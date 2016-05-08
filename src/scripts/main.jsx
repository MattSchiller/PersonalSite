var React   = require('react');
var SimType = require('./simType.jsx');
var Menu    = require('./menu.jsx');

var App = React.createClass({
  getInitialState: function() {
    return { menuIndex: 0 }
  },
  
  menuClick: function(index) {
    console.log("translate this into an effect for index:", index);
  },
  
  render: function() {
    let content = "~Cindent0~" + "function " + "~Cfunc~" + "getModuleName" + "~CfuncName~" + "() {"  + "~l0~"
    + "~p350~" + "~Cindent1~"
                    + "var" + "~Cfunc~" + " src   " + "~ckey~" + "= " + "~q+~" + "~p350~" + "index.html" + "~q-~" + ";" + "~l0~"
    + "~p350~" + "~Cindent1~"
                    + "var" + "~Cfunc~" + " author " + "~ckey~" + "= " + "~q+~" + "~p350~" + "Matt Schiller (c) 1987" + "~p500~" + "~b4~" + "2016" + "~q-~" + ";" + "~l0~"
                + "~Cindent0~" + "}" + "~l0~"
                + "~Cindent0~" + " " + "~l0~" //Dummy line
                + "~Cindent0~" + "function " + "~Cfunc~" + "getContactInfo" + "~CfuncName~" + "() {"  + "~l0~"
    + "~p350~" + "~Cindent1~"
                    + "var" + "~Cfunc~" + " email " + "~ckey~" + "= " + "~q+~" + "~p350~" + "matt.s.schiller@gmail.com" + "~q-~" + ";" + "~l0~"
                + "~Cindent0~" + "}" + "~l0~" //Dummy line
                + "~Cindent0~" + " " + "~l0~" //Dummy line
                + "~Cindent0~" + "function " + "~Cfunc~" + "thankVisitor" + "~CfuncName~" + "() {"  + "~l0~"
    + "~p350~" + "~Cindent1~"
                    + "console." + "~c0~" + "log" + "~CfuncName~" + "(" + "~q+~" + "~p350~" + "Thanks for checking out my site, much of it is still"
                    + "~p200~" + "." + "~p200~" + "." + "~p200~" + "." + "~p200~" + "~b3~" + " under construction" + "~q-~" + ");" + "~l0~"
                + "~Cindent0~" + "}";
               
    
    let items = ["Menu1.js", "Menu2.jpg", "Menu3.orange"];
    return (
      <div>
        <Menu
          items   = { items }
          clicked = { this.menuClick }
          />
        <SimType content = { content } />
      </div>
      )

  }

});
//**********************************Page initialization
ReactDOM.render(
  <App />,
  document.getElementById('content')
);