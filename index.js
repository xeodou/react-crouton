/**
 * @jsx React.DOM
 */

var React = require('react')

module.exports = React.createClass({

  displayName: 'react-crouton',

  propTypes: {
    id: React.PropTypes.number.isRequired,
    onDismiss: React.PropTypes.func,
    hidden: React.PropTypes.bool,
    timeout: React.PropTypes.number,
    autoMiss: React.PropTypes.bool,
    message: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.array
      ]).isRequired,
    type: React.PropTypes.string.isRequired,
    buttons: function(props, propName, componentName) {
      var propValue = props[propName];
      if (propValue != null && typeof propValue !== 'string' && typeof propValue !== 'object' && !(typeof propValue === 'object' && propValue.name != null))
        return new Error('Expected a string or an URI for ' + propName + ' in ' + componentName );
    }
  },

  getInitialState: function() {
    return {
      // 2000 ms
      timeout: 2000,
      autoMiss: false,
      hidden: false,
      ttd: null
    };
  },

  dismiss: function() {
    this.setState({
      hidden: true
    });
    if (this.state.onDismiss) {
      this.state.onDismiss();
    }
    return this;
  },

  clearTimeout: function() {
    if(this.state.ttd)
      clearTimeout(this.state.ttd)
    return this;
  },

  handleClick: function(event) {
    this.dismiss().clearTimeout();
    var item = this.state.buttons.filter(function(button){
        return button.name.toLowerCase() === event.target.id
      })[0];
    if(item && item.listener){
      item.listener(event);
    }
  },

  componentWillMount: function() {
    this.changeState(this.props);
  },

  changeState: function(nextProps) {
    var buttons = nextProps.buttons;
    if (typeof buttons === 'string')
      buttons = [buttons];
    if (buttons) {
      buttons = buttons.map(function(button) {
        if (typeof button === 'string')
          return {
            name: button
          };
        return button;
      });
    }

    var message = nextProps.message
    if(typeof message === 'string')
      message = [message];
    var autoMiss = nextProps.autoMiss || (buttons ? false : true);
    this.setState({
      onDismiss: nextProps.onDismiss || this.state.onDismiss,
      hidden: nextProps.hidden,
      buttons: buttons,
      timeout: nextProps.timeout || this.state.timeout,
      autoMiss: autoMiss,
      message: message,
      type: nextProps.type
    });
    if(autoMiss && !nextProps.hidden){
      var ttd = setTimeout(this.dismiss.bind(this), this.state.timeout);

      this.setState({
        ttd: ttd
      });
    }
  },

  componentWillReceiveProps: function(nextProps) {
    this.changeState(nextProps);
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    if( nextProps.id === this.props.id ) {
      return nextState.hidden;
    }
    return true
  },

  render: function() {
    return (
      <div className='crouton' hidden={this.state.hidden}>
        <div className={this.state.type}>
          {this.state.message.map(function(msg, i){
            return <span key={i}>{msg}</span>
          })}
          {
            this.state.buttons ?
            <div className='buttons'>
            {this.state.buttons.map(function(button){
              return (<button
                id={button.name.toLowerCase()}
                key={button.name.toLowerCase()}
                className={button.name.toLowerCase()}
                onClick={this.handleClick}>{button.name}</button> )
            }, this)}</div>: null

          }
        </div>
      </div>
    )
  }
})
