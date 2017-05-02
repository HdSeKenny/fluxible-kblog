'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _FluxibleMixin = require('fluxible-addons-react/FluxibleMixin');

var _FluxibleMixin2 = _interopRequireDefault(_FluxibleMixin);

var _stores = require('../../stores');

var _actions = require('../../actions');

var _reactBootstrap = require('react-bootstrap');

var _reactRouter = require('react-router');

var _UserControls = require('../UserControls');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserFollowsTabs = _react2.default.createClass({

  displayName: 'UserFollowsTabs',

  contextTypes: {
    executeAction: _react2.default.PropTypes.func
  },

  mixins: [_FluxibleMixin2.default],

  statics: {
    storeListeners: [_stores.UserStore]
  },

  getInitialState: function () {
    return this.getStatesFromStores();
  },
  getStatesFromStores: function () {
    return {};
  },
  onChange: function (res) {
    this.setState(this.getStatesFromStores());
  },
  isFollowedThisUser: function (currentUser, user) {
    let isFollowed = false;
    if (currentUser && user) {
      currentUser.focuses.forEach(focus => {
        if (focus.strId === user.strId) {
          isFollowed = true;
        }
      });
    }
    return isFollowed;
  },
  _renderUserFollowing: function (currentUser, user) {
    return _react2.default.createElement(
      _UserControls.Tabs,
      null,
      _react2.default.createElement(
        _UserControls.Pane,
        { label: 'Following' },
        this._renderUserFocuses(currentUser, user)
      ),
      _react2.default.createElement(
        _UserControls.Pane,
        { label: 'Fans' },
        this._renderUserFans(currentUser, user)
      ),
      _react2.default.createElement(
        _UserControls.Pane,
        { label: 'Friends' },
        _react2.default.createElement(
          'center',
          null,
          _react2.default.createElement(
            'h2',
            null,
            'Friends - Not Finished !'
          )
        )
      )
    );
  },
  _renderUserFocuses: function (currentUser, user) {
    if (user.focuses.length > 0) {
      return _react2.default.createElement(
        'div',
        { className: '' },
        user.focuses.map(focus => {
          const isFollowed = this.isFollowedThisUser(currentUser, focus);
          const isFocusCurrentUser = currentUser ? focus.strId === currentUser.strId : false;
          const focusObj = { type: 'FOCUS', user: focus };
          return _react2.default.createElement(
            'div',
            { key: focus._id, className: 'well following' },
            _react2.default.createElement(
              'div',
              { className: 'row' },
              _react2.default.createElement(
                'div',
                { className: 'col-xs-1 following-image' },
                _react2.default.createElement('img', { alt: 'following-image', src: focus.image_url })
              ),
              _react2.default.createElement(
                'div',
                { className: 'col-xs-8 following-info' },
                _react2.default.createElement(
                  'h4',
                  null,
                  focus.username
                ),
                _react2.default.createElement(
                  'p',
                  null,
                  focus.profession
                )
              ),
              _react2.default.createElement(
                'div',
                { className: 'col-xs-3 following-btn' },
                currentUser && isFollowed && _react2.default.createElement(
                  _reactBootstrap.Button,
                  { className: 'cancel-follow-btn',
                    onClick: this.props.onCancelFollowThisUser.bind(null, focusObj) },
                  _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'heart' }),
                  ' Following'
                ),
                currentUser && !isFollowed && !isFocusCurrentUser && _react2.default.createElement(
                  _reactBootstrap.Button,
                  { className: 'follow-btn',
                    onClick: this.props.onFollowThisUser.bind(null, focusObj) },
                  _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'heart' }),
                  ' Follow'
                )
              )
            )
          );
        })
      );
    }
  },
  _renderUserFans: function (currentUser, user) {
    if (user.fans.length > 0) {
      return _react2.default.createElement(
        'div',
        { className: '' },
        user.fans.map(fan => {
          const isFollowed = this.isFollowedThisUser(currentUser, fan);
          const isFanCurrentUser = currentUser ? fan.strId === currentUser.strId : false;
          const fanObj = { type: 'FAN', user: fan };
          return _react2.default.createElement(
            'div',
            { key: fan._id, className: 'well following' },
            _react2.default.createElement(
              'div',
              { className: 'row' },
              _react2.default.createElement(
                'div',
                { className: 'col-xs-1 following-image' },
                _react2.default.createElement('img', { alt: 'following-image', src: fan.image_url })
              ),
              _react2.default.createElement(
                'div',
                { className: 'col-xs-8 following-info' },
                _react2.default.createElement(
                  'h4',
                  null,
                  fan.username
                ),
                _react2.default.createElement(
                  'p',
                  null,
                  fan.profession
                )
              ),
              _react2.default.createElement(
                'div',
                { className: 'col-xs-3 following-btn' },
                currentUser && isFollowed && _react2.default.createElement(
                  _reactBootstrap.Button,
                  { className: 'cancel-follow-btn',
                    onClick: this.props.onCancelFollowThisUser.bind(null, fanObj) },
                  _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'heart' }),
                  ' Following'
                ),
                currentUser && !isFollowed && !isFanCurrentUser && _react2.default.createElement(
                  _reactBootstrap.Button,
                  { className: 'follow-btn',
                    onClick: this.props.onFollowThisUser.bind(null, fanObj) },
                  _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'heart' }),
                  ' Follow'
                )
              )
            )
          );
        })
      );
    }
  },
  render: function () {
    const { currentUser: currentUser, user: user } = this.props;
    return _react2.default.createElement(
      'div',
      { className: 'user-follows-tabs' },
      this._renderUserFollowing(currentUser, user)
    );
  }
});

exports.default = UserFollowsTabs;
module.exports = exports['default'];
