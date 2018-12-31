var React = require('react');

var Menu = React.createClass({
    getDefaultProps: function() {
        return {
            items: []
        }
    },

    formatItems: function() {
        let resumeURL = "./assets/MattSchillerCV.pdf";
        let myItems = this.props.items.map(function(item, i) {
            return (
                <li key={ i }
                    id={ "menu" + i }
                    onClick={ function() {
                        if (item == this.props.resume) {
                            window.open(resumeURL, "_blank");
                        } else {
                            this.props.clicked(i);
                        }
                    }.bind(this) }
                    className={ i == this.props.currInd ? "current" : "" }
                >
                    <span>{ item }</span>
                </li>
            )
        }.bind(this));

        return (<ul>{ myItems }</ul>);
    },

    render: function() {
        return (
            <div className="tabs">
                <nav>
                    { this.formatItems() }
                </nav>
            </div>
        )
    }
});


module.exports = Menu;