/**
 * @jsx React.DOM
 */

var React = require('react')

module.exports = React.createClass({

  displayName: 'react-crouton',

  propTypes: {
    onDismiss: React.PropTypes.func,
    hidden: React.PropTypes.bool,
    timeout: React.PropTypes.number,
    autoMiss: React.PropTypes.bool,
    message: React.PropTypes.string.isRequired,
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

  componentWillMount: function() {
    var self = this;
    if(this.props.autoMiss){
      var ttd = setTimeout(function() {
        self.dismiss()
      }, this.props.timeout);
      self.setState({
        ttd: ttd
      });
    }
  },

  handleClick: function(event) {
    this.dismiss().clearTimeout();
    var item = this.state.buttons.filter(function(button){
        return button.name === event.target.innerHTML
      })[0];
    if(item.listener){
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

    this.setState({
      onDismiss: nextProps.onDismiss || this.state.onDismiss,
      hidden: nextProps.hidden,
      buttons: buttons || this.state.buttons,
      timeout: nextProps.timeout || this.state.timeout,
      autoMiss: nextProps.autoMiss || (buttons ? this.state.autoMiss : true),
      message: nextProps.message,
      type: nextProps.type
    });
  },

  componentWillReceiveProps: function(nextProps) {
    this.changeState(nextProps);
  },

  render: function() {
    var self = this;
    return (
      <div className='crouton' hidden={this.state.hidden}>
        <div className={this.state.type}>
          {this.state.message}
          {
            this.state.buttons ?
            this.state.buttons.map(function(button){
              return (<button key={button.name.toLowerCase()} className={button.name.toLowerCase()} onClick={self.handleClick} >{button.name}</button> )
            }): null
          }
        </div>
      </div>
    )
  }
})
