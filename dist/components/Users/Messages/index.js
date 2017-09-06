'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ChatBox = require('./ChatBox');

var _ChatBox2 = _interopRequireDefault(_ChatBox);

var _stores = require('../../../stores');

var _Layout = require('../../UI/Layout');

var _utils = require('../../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * User messages component
 *
 * @export
 * @class Messages
 * @extends {React.Component}
 */
class Messages extends _react2.default.Component {

  constructor(props, context) {
    super(props);
    this._onStoreChange = this._onStoreChange.bind(this);
    this.context = context;
    this.UserStore = context.getStore(_stores.UserStore);
    this.state = {
      currentUser: this.UserStore.getCurrentUser(),
      activeUser: this.UserStore.getActiveUserId(),
      localChat: this.UserStore.getUserConnection()
    };
  }

  // initialize(currentUser) {
  //   const { recent_chat_connections } = currentUser;
  //   const activeUser = this.UserStore.getActiveUserId();
  //   const localChat = this.UserStore.getUserConnection();
  //   if (!activeUser || !localChat) {
  //     {
  //       current_user: id_str,
  //       active_user: thisUserId || firstConnection ? firstConnection.this_user_id : '',
  //       recent_chat_connections
  //     }
  //   }
  // }

  componentDidMount() {
    this.UserStore.addChangeListener(this._onStoreChange);

    // Chat socket receive messages from server
    socket.on('message:receive', messageObj => this._recieveMessages(messageObj));

    if (this.state.currentUser) {
      // this.checkUserConnectionWithAdmin();
    }
  }

  componentWillUnmount() {
    this.UserStore.removeChangeListener(this._onStoreChange);
  }

  checkUserConnectionWithAdmin() {
    console.log('checkUserConnectionWithAdmin');
    const activeUserId = this.state.activeUser;
    const currentUser = this.state.currentUser;
    const localChat = this.state.localChat || currentUser.recent_chat_connections;
    const connections = localChat.recent_chat_connections;
    const connection = connections.find(c => c.this_user_id === activeUserId);
    const activeUser = this.UserStore.getUserById(activeUserId);
    if (activeUser.username === 'Kenny' && !connection.messages.length) {
      const newMessage = {
        content: 'My name is Kenny, the developer of this website. If you have any questions, ask me please!',
        date: new Date(),
        user_to: currentUser.id_str,
        user_from: activeUserId,
        class: 'you'
      };
      connection.connect_date = new Date();
      socket.emit('message:send', newMessage);
    }
  }

  _recieveMessages(messageObj) {
    const { currentUser: currentUser, localChat: localChat } = this.state;
    const { user_from: user_from, user_to: user_to } = messageObj;
    if (user_from !== user_to && user_to === currentUser.id_str) {
      const connections = localChat.recent_chat_connections;
      const thisUserConnect = connections.find(c => c.this_user_id === user_from);
      thisUserConnect.messages.push(messageObj);
      this.setState({ localChat: localChat }, () => {
        this.UserStore.setUserConnection(localChat);
      });
    }
  }

  _onStoreChange(res) {
    const authMessages = ['USER_LOGIN_SUCCESS', 'LOGOUT_SUCCESS'];
    const connectMessages = ['ADD_MESSAGE_CONNECTION_SUCCESS', 'SET_ACTIVE_USER_SUCCESS', 'DELETE_MESSAGE_CONNECTION_SUCCESS', 'SET_USER_CONNECTION_SUCCESS'];

    const result = {};
    if (connectMessages.includes(res.msg)) {
      result.activeUser = this.UserStore.getActiveUserId();
      result.localChat = this.UserStore.getUserConnection();
    }

    if (authMessages.includes(res.msg)) {
      result.currentUser = this.UserStore.getCurrentUser();
    }

    if (Object.keys(result).length > 0) {
      this.setState(result);
    }
  }

  hideMessages() {
    this.props.hideMessages();
  }

  render() {
    const { currentUser: currentUser, localChat: localChat, activeUser: activeUser } = this.state;
    const { showMessages: showMessages } = this.props;
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
            'Chat Messages 0'
          )
        ),
        _react2.default.createElement(
          _Layout.Col,
          { size: '2 pr-0 msg-event' },
          _react2.default.createElement('i', { className: 'fa fa-cog' })
        )
      ),
      showMessages && _react2.default.createElement(_ChatBox2.default, {
        hideMessages: () => this.hideMessages(),
        currentUser: currentUser,
        localChat: localChat,
        activeUser: activeUser
      })
    );
  }
}
exports.default = Messages;
Messages.displayName = 'Messages';
Messages.contextTypes = {
  getStore: _propTypes2.default.func,
  executeAction: _propTypes2.default.func
};
Messages.propTypes = {
  hideMessages: _propTypes2.default.func,
  showMessages: _propTypes2.default.bool
};
module.exports = exports['default'];
