var React = require('react')
var emptyFunction = require('react/lib/emptyFunction');
var PropTypes = React.PropTypes

module.exports = React.createClass({

  displayName: 'react-crouton',

  propTypes: {
    id: PropTypes.number.isRequired,
    onDismiss: PropTypes.func,
    hidden: PropTypes.bool,
    timeout: PropTypes.number,
    autoMiss: PropTypes.bool,
    message: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array
    ]).isRequired,
    type: PropTypes.string.isRequired,
    buttons: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string
      })), PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        listener: PropTypes.func
      }))
    ])
  },

  getDefaultProps: function () {
    return {
      onDismiss: emptyFunction,
      timeout: 2000,
      autoMiss: false
    };
  },

  getInitialState: function () {
    return {
      // 2000 ms
      timeout: 2000,
      autoMiss: false,
      hidden: false,
      ttd: null
    };
  },

  dismiss: function () {
    this.setState({
      hidden: true
    });
    this.props.onDismiss();
    this.clearTimeout();
    return this;
  },

  clearTimeout: function () {
    if (this.state.ttd) {
      clearTimeout(this.state.ttd);
      this.setState({
        ttd: null
      });
    }
    return this;
  },

  handleClick: function (event) {
    this.dismiss();
    var item = this.state.buttons.filter(function (button) {
      return button.name.toLowerCase() === event.target.id
    })[0];
    if (item && item.listener) {
      item.listener(event);
    }
  },

  componentWillMount: function () {
    this.changeState(this.props);
  },

  componentWillUnmount: function () {
    this.clearTimeout();
  },

  changeState: function (nextProps) {
    var buttons = nextProps.buttons;
    if (typeof buttons === 'string')
      buttons = [buttons];
    if (buttons) {
      buttons = buttons.map(function (button) {
        if (typeof button === 'string')
          return {
            name: button
          };
        return button;
      });
    }

    var message = nextProps.message
    if (typeof message === 'string')
      message = [message];
    var autoMiss = nextProps.autoMiss || (buttons ? false : true);
    this.setState({
      hidden: nextProps.hidden,
      buttons: buttons,
      timeout: nextProps.timeout || this.state.timeout,
      autoMiss: autoMiss,
      message: message,
      type: nextProps.type
    });
    if (autoMiss && !nextProps.hidden) {
      var ttd = setTimeout(this.dismiss, this.state.timeout);
      this.setState({
        ttd: ttd
      });
    }
  },

  componentWillReceiveProps: function (nextProps) {
    this.changeState(nextProps);
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    if (nextProps.id === this.props.id) {
      return !!nextState.hidden;
    }
    return true
  },

  render: function () {
    return React.createElement('div', {
        className: 'crouton',
        hidden: this.state.hidden
      },
      React.createElement('div', {
          className: this.state.type
        },
        this.state.message.map(function (msg, i) {
          return React.createElement('span', {
            key: i
          }, msg);
        }),
        this.state.buttons ? React.createElement('div', {
            className: 'buttons'
          },
          this.state.buttons.map(function (button, i) {
            return React.createElement('button', {
              id: button.name.toLowerCase(),
              key: i,
              className: button.name.toLowerCase(),
              onClick: this.handleClick
            }, button.name)
          }, this)
        ) : null
      )
    )
  }
})
