var React       = require('react');
var TypedBucket = require('./typedBucket.js');

//Given a string, this module simulates typing of that string into the div

var SimType = React.createClass({
  getInitialState: function() {
    return {
        contentPos: -1
      , typed: [ new TypedBucket() ]
    }
  },
  
  getDefaultProps: function() {
    return {
        content: {
            stub: ""
          , writing: "" }
      , options: {
            animate: true             //NEED TO ADD ANIMATE TOGGLE, maybe
          , show:    false }
    }
  },
  
  componentDidMount: function() {
    this._charTimeout = 50;
    this._backTimeout = 100;
    this._escape      = "~";
    this._qChar       = '"';
    this._newLine     = "line";
    this._indent      = "indent";
    this._str         = "str";
    this._contentWrt  = "writing";
    this._contentStb  = "stub";
    
    this.formatStub();
    
    this.updateTyped();
  },
  
  formatStub: function() {
    let typed   = this.state.typed
      , stub    = this.props.content.stub
      , stubPos = 0;
      
    while (stubPos < stub.length) {
      
      
      stubPos++;
    }
    
    
    
    
  },
  
  componentDidUpdate: function() {
    this.updateTyped();
  },
  
  updateTyped: function() {
    if (!this.props.options.show) return;
    
    if (this.state.contentPos >= this.props.content.writing.length - 1) return;
    
    if (this._backspacing) return;
    
    var contentPos  = this.state.contentPos + 1
      , nextChar    = this.props.content.writing[contentPos];
        
    if (nextChar == this._escape) {
    //Let's attempt to execute the action command
      if (contentPos + 1 < this.props.content.writing.length) {
        contentPos ++;
        
        let actionChar = this.props.content.writing[ contentPos ];
        this.attemptAction( actionChar, contentPos );
      }
      
      return;
    }
    
    //We're appending a regular character or an errored escape char
    var typed = this.state.typed
      , self  = this;
    
    if (this._quoting) {    //Insert next char befor trailing space
      let text = typed[ typed.length-1 ].text
        , len  = text.length;
      
      typed[ typed.length-1 ].text = text.slice(0, -1) + nextChar + text.slice(len-1);
    
    } else
      typed[ typed.length-1 ].text += nextChar;
    
    setTimeout(function() {
        self.setState({ typed, contentPos });
      }, self._charTimeout * Math.random() );
  },
  
  attemptAction: function(action, contentPos, contentType = this._contentWrt) {
    //Backspace: ~b#, # = number of backspaces
    //Pause:     ~p#, # = time in ms to wait
    if (this.escapedActions[ action ]) {
      contentPos++;
      let value   = this.getValue( contentPos )
        , digits  = value.toString().length;
      
      contentPos += digits;
      this.escapedActions[ action ].call( this, value, contentPos, contentType );
    }
  },
  
  getValue: function(contentPos) {
    let str = this.props.content.writing.substring( contentPos,  this.props.content.writing.length)
      , val = str.match( /[^~]+/ );
      
    if (val.length == 0) return false;
    return val[0];
  },
  
  escapedActions: {
    b: function( iterations, contentPos ) {   //No content type, is only used in writing
      //Backspace, a negative number indicates no timeout should be used
      
      //FOR NEGATIVE NUMBERS, SHOULD GO RIGHT TO THE NEXT CHARACTER
      
      
      
      let typed    = this.state.typed
        , typedPos = typed.length - 1;
      
      iterations = parseInt( iterations );

      if (Number.isInteger(iterations)) {
      
        if (this._quoting)
          typed[ typedPos ].text = typed[ typedPos ].text.slice(0, -2) + this._qChar;
        else
          typed[ typedPos ].text = typed[ typedPos ].text.slice(0, -1);
        
  //RIGHT NOW WE LIMIT BEHAVIOR TO NEVER ALLOW BACKSPACING MORE THAN THE CURRENT TEXT BUCKET
        
        //Check if this text bucket is empty
        if (typed[ typedPos ].text.length == 0 || Math.abs(iterations) == 1) {
          //We're done backspacing after this call
          this._backspacing = false;
          //if (typed[ typedPos ].text.length != 0) typed.push[ new TypedBucket ];
        
        } else {
          this._backspacing = true;
          
          var self = this
            , nextIterations = iterations > 0 ? iterations - 1 : iterations + 1;
            
          setTimeout(function() {
              self.escapedActions.b.call( self, nextIterations, contentPos )
            }, (iterations > 0 ? self._backTimeout : 0) )
        }
      }
      
      this.setState({ typed, contentPos });
    },
  
    p: function( timeout, contentPos ) {  //No content type, is only used in writing
      //Pause
      var self = this;
      
      timeout = parseInt( timeout );
      
      setTimeout(function() {
          self.setState({ contentPos })
        }, timeout)
    },
    
    c: function( classVal, contentPos, contentType ) {
      //Creates a new typedBucket for this new piece of text and applies the class immediately
      let typed = this.state.typed
        , typedPos = typed.length;
        
      typed.push( new TypedBucket( "", classVal ) );
      
      if (contentType == this._contentWrt) this.setState({ typed, contentPos});
    },
    
    C: function( classVal, contentPos, contentType ) {
      //Closes the current typedBucket and applies the given class
      let typed = this.state.typed
        , typedPos = typed.length - 1;
      
      typed[ typedPos ].className += typed[ typedPos ].className == "" ? classVal : " " + classVal;
      typed.push( new TypedBucket );
      
      this.setState({ typed, contentPos });
    },
    
    l: function( immaterial, contentPos, contentType ) {
      //Inserts the number of line breaks specified
      let typed = this.state.typed
        , typedPos = typed.length;
      
      typed.push( new TypedBucket );
      typed[ typedPos ].className = this._newLine;
      typed.push( new TypedBucket );
      
      var self = this;
      setTimeout(function() {
          self.setState({ typed, contentPos });
        }, self._charTimeout);
    },
    
    q: function( onOrOff, contentPos ) {    //No contentType, only used in writing
      //Adds a double quotes and conveys that there is a trailing quotation mark
      let typed = this.state.typed;
      
      if (onOrOff == '+') {
        this._quoting = true;
        typed.push( new TypedBucket( this._qChar + this._qChar, this._str ));
      } else {
        this._quoting = false;
        typed.push( new TypedBucket );
      }
      
      this.setState({ typed, contentPos });
      
    },
    
    a: function( link, contentPos, contentType ) {
      //Overloads the current TypedBucket with a link value for toSpan to recognize
      let typed = this.state.typed;
      
      typed[ typed.length - 1].link = link;
      
      this.setState({ typed, contentPos });
    }
    
  },

  convertTyped: function() {
    let typed = this.state.typed
      , j = 0
      , formattedTyped = [];
      
    while (j < typed.length) {
      if (~typed[ j ].className.indexOf( this._indent ) ) {
        //Get the className etc for this div
        let thisLineClass = typed[j].className
          , lineContents = [];
        
        j++;
        //Build the spans for the line's contents
        while ( j < typed.length && typed[j].className != this._newLine) {
          lineContents.push( this.toSpan( typed[j], j ) );
          j++;
        }
        
        formattedTyped.push(
          <div
            className = { thisLineClass }
            key = { j }
              >
            { lineContents }
            <br />
          </div>
          )
      } else {
        formattedTyped.push( this.toSpan( typed[j], j ) );
      }
      
      j++;
    }
    
    return formattedTyped;
  },
  
  toSpan: function(segment, j) {
    //Handles the conversion of the TypedBuckets into spans/a hrefs
    return (segment.link == "" ?
                                <span
                                    className = { segment.className }
                                    key       = { j } >
                                      { segment.text }
                                 </span>
                               :
                                <a  href    = { segment.link }
                                    target  = "_blank"
                                    key     = { j } >
                                     { segment.text }
                                </a>
          )
  },
  
  render: function() {
    return (
      <div className = "simType" >
        { this.props.options.show ? this.convertTyped() : null }
      </div>
      )
  }
  
});

module.exports = SimType;