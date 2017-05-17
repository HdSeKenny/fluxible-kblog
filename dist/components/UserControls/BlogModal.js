'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _actions = require('../../actions');

var _Layout = require('../UI/Layout');

var _UI = require('../UI');

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BlogModal extends _react.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser: props.currentUser,
      welcomeText: 'Create a sweet here !',
      blogText: ''
    };
  }

  onCreateSweet() {
    const { currentUser: currentUser, blogText: blogText } = this.state;
    if (!currentUser) {
      _utils.sweetAlert.alertWarningMessage('Login first !');
      return;
    }

    const newBlog = {
      text: blogText,
      created_at: new Date(),
      type: 'moment',
      author: currentUser._id
    };

    this.context.executeAction(_actions.BlogActions.AddBlog, newBlog);
  }

  onCloseBlogModal() {
    _UI.ModalsFactory.hide('createBlogModal');
  }

  onChangeBlogText(e) {
    this.setState({ blogText: e.target.value });
  }

  goToArticleCreatePage() {
    const { currentUser: currentUser } = this.state;
    if (!currentUser) {
      return _utils.sweetAlert.alertWarningMessage('Login first!');
    }
  }

  _renderCreateBtns(isDisabled) {
    const { isUserHome: isUserHome } = this.props;
    return _react2.default.createElement(
      'div',
      { className: '' },
      _react2.default.createElement(
        'button',
        { disabled: isDisabled, className: 'btn btn-info', onClick: () => this.onCreateSweet() },
        'Create'
      ),
      !isUserHome && _react2.default.createElement(
        'button',
        { className: 'btn btn-primary', onClick: () => this.onCloseBlogModal() },
        'Cancel'
      ),
      isUserHome && _react2.default.createElement(
        'button',
        { className: 'btn btn-primary', onClick: () => this.goToArticleCreatePage() },
        'Article'
      )
    );
  }

  _renderCreateTips(isLimmitWords, blogTextLength) {
    if (isLimmitWords) {
      return _react2.default.createElement(
        'p',
        null,
        'You can still write ',
        _react2.default.createElement(
          'span',
          { className: 'len-span' },
          140 - blogTextLength
        ),
        ' words'
      );
    } else {
      return _react2.default.createElement(
        'p',
        null,
        'Words can\'t be more than ',
        _react2.default.createElement(
          'span',
          { className: 'len-span-red' },
          '140'
        ),
        ' words'
      );
    }
  }

  render() {
    const { welcomeText: welcomeText, blogText: blogText } = this.state;
    const blogTextLength = blogText.length;
    const isDisabled = blogTextLength > 140 || blogTextLength === 0;
    const isLimmitWords = blogTextLength < 141;
    return _react2.default.createElement(
      'div',
      { className: 'create-well' },
      _react2.default.createElement(
        _Layout.Row,
        { className: 'text-row' },
        _react2.default.createElement(
          _Layout.Col,
          { size: '12', className: 'p-0' },
          _react2.default.createElement(
            'p',
            { className: 'welcomeText' },
            welcomeText
          ),
          _react2.default.createElement(
            'div',
            { className: 'create-tip mt-5' },
            this._renderCreateTips(isLimmitWords, blogTextLength)
          )
        )
      ),
      _react2.default.createElement(
        _Layout.Row,
        { className: 'textarea-row' },
        _react2.default.createElement('textarea', { type: 'text', rows: '4', value: blogText, onChange: e => this.onChangeBlogText(e) })
      ),
      _react2.default.createElement(
        _Layout.Row,
        { className: 'btn-row' },
        this._renderCreateBtns(isDisabled)
      )
    );
  }
}
exports.default = BlogModal; /**
                              * Copyright 2017, created by Kuan Lu
                              * @ui BlogModal
                              */

BlogModal.displayName = 'BlogModal';
BlogModal.contextTypes = {
  executeAction: _react.PropTypes.func
};
BlogModal.propTypes = {
  location: _react.PropTypes.object,
  children: _react.PropTypes.object,
  currentUser: _react.PropTypes.object,
  isUserHome: _react.PropTypes.bool
};
module.exports = exports['default'];
