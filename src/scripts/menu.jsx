var React = require('react');

var Menu = React.createClass({
  getInitialState: function() {
    return { current: 0 }
  },
  
  getDefaultProps: function() {
    return {
        items: []
    }
  },
  
  makeCurrent: function(i) {
    this.setState({ current: i });
  },
  
  formatItems: function() {
    let myItems = this.props.items.map(function(item, i) {
      return (
        <li key       = { i }
            onClick   = { function() {
                                      this.makeCurrent( i );
                                      this.props.clicked( i );
                                  }.bind(this) }
            className = { i == this.state.current ? "current" : "" }
          >
          <span>{ item }</span>
        </li>
        )
    }.bind(this) );
    
    return ( <ul>{ myItems }</ul> );
  },
  
  render: function() {
    return (
      <div className = "tabs">
        <nav>
          { this.formatItems() }
        </nav>
      </div>
      )
  }
});


module.exports = Menu;