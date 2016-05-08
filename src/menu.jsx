var React = require('react');

var Menu = React.createClass({
  getDefaultProps: function() {
    return { items: [] }
  },
  
  componentWillMount: function() {
    this._tabShape =
      <svg class="hidden">
        <defs>
          <path id="tabshape" d="M80,60C34,53.5,64,417,0,0,0v60H80z" />
        </defs>
      </svg>
  },
  
  formatItems: function() {
    
  },
  
  render: function() {
    return (
      <div>
        { this.formatItems() }
      </div>
      )
  }
};


module.exports = Menu;