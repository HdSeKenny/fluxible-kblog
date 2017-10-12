'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ChatBox = require('./ChatBox');

var _ChatBox2 = _interopRequireDefault(_ChatBox);

var _stores = require('../../../stores');

var _Layout = require('../../UI/Layout');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * User messages component - Kenny
 *
 * @export
 * @class Messages
 * @extends {React.Component}
 */
var Messages = function (_React$Component) {
  (0, _inherits3.default)(Messages, _React$Component);

  function Messages(props, context) {
    (0, _classCallCheck3.default)(this, Messages);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Messages.__proto__ || (0, _getPrototypeOf2.default)(Messages)).call(this, props));

    _this._onStoreChange = _this._onStoreChange.bind(_this);
    _this.context = context;
    _this.UserStore = context.getStore(_stores.UserStore);
    _this.state = {
      currentUser: _this.UserStore.getCurrentUser(),
      activeUser: _this.UserStore.getActiveUserId(),
      localChat: _this.UserStore.getUserConnection(),
      newMessagesNumSum: _this.UserStore.getNewMessagesNumSum(_this.props.showMessages)
    };
    return _this;
  }

  (0, _createClass3.default)(Messages, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.UserStore.addChangeListener(this._onStoreChange);

      // Chat socket receive messages from server
      socket.on('message:receive', function (messageObj) {
        return _this2._recieveMessages(messageObj);
      });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.jumpToMessagsBottom();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.showMessages) {
        var newMessagesNumSum = this.UserStore.getNewMessagesNumSum(nextProps.showMessages);
        this.setState({ newMessagesNumSum: newMessagesNumSum });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.UserStore.removeChangeListener(this._onStoreChange);
    }
  }, {
    key: '_recieveMessages',
    value: function _recieveMessages(messageObj) {
      var _this3 = this;

      var _state = this.state,
          currentUser = _state.currentUser,
          localChat = _state.localChat,
          activeUser = _state.activeUser;
      var user_from = messageObj.user_from,
          user_to = messageObj.user_to;

      if (user_from !== user_to && user_to === currentUser.id_str) {
        var connections = localChat.recent_chat_connections;
        var thisUserConnect = connections.find(function (c) {
          return c.this_user_id === user_from;
        });
        thisUserConnect.messages.push(messageObj);
        if (activeUser !== user_from) {
          thisUserConnect.new_messages_number += 1;
        } else if (!this.props.showMessages) {
          thisUserConnect.new_messages_number += 1;
        }

        this.setState({ localChat: localChat }, function () {
          _this3.UserStore.setUserConnection(localChat);
        });
      }
    }
  }, {
    key: 'jumpToMessagsBottom',
    value: function jumpToMessagsBottom() {
      if ($('.chat')[0]) {
        $('.chat')[0].scrollTop = $('.chat')[0].scrollHeight;
      }
    }
  }, {
    key: '_onStoreChange',
    value: function _onStoreChange(res) {
      var authMessages = ['USER_LOGIN_SUCCESS', 'LOGOUT_SUCCESS'];
      var connectMessages = ['ADD_MESSAGE_CONNECTION_SUCCESS', 'SET_ACTIVE_USER_SUCCESS', 'DELETE_MESSAGE_CONNECTION_SUCCESS', 'SET_USER_CONNECTION_SUCCESS'];

      var result = {};
      if (connectMessages.includes(res.msg)) {
        result.activeUser = this.UserStore.getActiveUserId();
        result.localChat = this.UserStore.getUserConnection();
        result.newMessagesNumSum = this.UserStore.getNewMessagesNumSum();
      }

      if (authMessages.includes(res.msg)) {
        result.currentUser = this.UserStore.getCurrentUser();
      }

      if ((0, _keys2.default)(result).length > 0) this.setState(result);
    }
  }, {
    key: 'hideMessages',
    value: function hideMessages() {
      this.props.hideMessages();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _state2 = this.state,
          currentUser = _state2.currentUser,
          localChat = _state2.localChat,
          activeUser = _state2.activeUser,
          newMessagesNumSum = _state2.newMessagesNumSum;
      var showMessages = this.props.showMessages;

      if (!currentUser) return null;

      return _react2.default.createElement(
        'div',
        { className: 'messages' },
        !showMessages && _react2.default.createElement(
          _Layout.Row,
          { className: 'small-chat-box' },
          _react2.default.createElement(
            _Layout.Col,
            { size: '2 p-0 msg-event' },
            _react2.default.createElement('i', { className: 'fa fa-envelope' })
          ),
          _react2.default.createElement(
            _Layout.Col,
            { size: '8 p-0 msg-event' },
            _react2.default.createElement(
              'p',
              null,
              'Chat Messages ',
              newMessagesNumSum ? _react2.default.createElement(
                'b',
                { className: 'badge bg-danger ml-5' },
                newMessagesNumSum
              ) : ''
            )
          ),
          _react2.default.createElement(
            _Layout.Col,
            { size: '2 pr-0 msg-event' },
            _react2.default.createElement('i', { className: 'fa fa-cog' })
          )
        ),
        showMessages && _react2.default.createElement(_ChatBox2.default, {
          hideMessages: function hideMessages() {
            return _this4.hideMessages();
          },
          currentUser: currentUser,
          localChat: localChat,
          activeUser: activeUser
        })
      );
    }
  }]);
  return Messages;
}(_react2.default.Component);

Messages.displayName = 'Messages';
Messages.contextTypes = {
  getStore: _propTypes2.default.func,
  executeAction: _propTypes2.default.func
};
Messages.propTypes = {
  hideMessages: _propTypes2.default.func,
  showMessages: _propTypes2.default.bool
};
exports.default = Messages;
module.exports = exports['default'];