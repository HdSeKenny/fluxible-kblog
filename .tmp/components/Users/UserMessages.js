'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FluxibleMixin = require('fluxible-addons-react/FluxibleMixin');

var _FluxibleMixin2 = _interopRequireDefault(_FluxibleMixin);

var _stores = require('../../stores');

var _UserBar = require('./UserBar');

var _UserBar2 = _interopRequireDefault(_UserBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserMessages = _react2.default.createClass({

  displayName: 'UserMessages',

  contextTypes: {
    executeAction: _react2.default.PropTypes.func
  },

  propTypes: {
    params: _react2.default.PropTypes.object,
    location: _react2.default.PropTypes.object
  },

  mixins: [_FluxibleMixin2.default],

  statics: {
    storeListeners: [_stores.UserStore]
  },

  getInitialState: function () {
    return this.getStatesFromStores();
  },
  getStatesFromStores: function () {
    return {
      currentUser: this.getStore(_stores.UserStore).getCurrentUser(),
      user: this.getStore(_stores.UserStore).getUserById(this.props.params.userId),
      isCurrentUser: this.getStore(_stores.UserStore).isCurrentUser(this.props.params.userId),
      loaded: false
    };
  },
  onChange: function () {
    this.setState(this.getStatesFromStores());
  },
  render: function () {
    const { pathname: pathname } = this.props.location;
    const { currentUser: currentUser, user: user, isCurrentUser: isCurrentUser } = this.state;
    return _react2.default.createElement(
      'div',
      { className: 'user-messages' },
      _react2.default.createElement(_UserBar2.default, { path: pathname, user: user, isCurrentUser: isCurrentUser, currentUser: currentUser }),
      _react2.default.createElement(
        'div',
        { className: 'messages-content' },
        _react2.default.createElement(
          'div',
          { className: 'well' },
          _react2.default.createElement(
            'center',
            null,
            _react2.default.createElement(
              'h2',
              null,
              'Messages - Not Finished !'
            )
          )
        )
      )
    );
  }
});

exports.default = UserMessages;
module.exports = exports['default'];
