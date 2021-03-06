'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright 2017 - developed by Kenny
 * ui - Input
 */

var SweetInput = function (_React$Component) {
  (0, _inherits3.default)(SweetInput, _React$Component);

  function SweetInput() {
    (0, _classCallCheck3.default)(this, SweetInput);
    return (0, _possibleConstructorReturn3.default)(this, (SweetInput.__proto__ || (0, _getPrototypeOf2.default)(SweetInput)).apply(this, arguments));
  }

  (0, _createClass3.default)(SweetInput, [{
    key: 'handleChange',
    value: function handleChange(e) {
      this.props.onChange(e);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          icon = _props.icon,
          format = _props.format,
          errorMessage = _props.errorMessage,
          placeholder = _props.placeholder,
          autoComplete = _props.autoComplete;

      return _react2.default.createElement(
        'div',
        { className: '' + (icon ? 'iconic-input' : '') },
        icon ? _react2.default.createElement('i', { className: icon }) : null,
        _react2.default.createElement('input', { type: format, autoComplete: autoComplete, className: 'form-control', onChange: function onChange(e) {
            return _this2.handleChange(e);
          }, placeholder: placeholder }),
        !errorMessage ? null : _react2.default.createElement(
          'p',
          { className: 'help-block text-left' },
          errorMessage
        )
      );
    }
  }]);
  return SweetInput;
}(_react2.default.Component);

SweetInput.propTypes = {
  icon: _propTypes2.default.string,
  format: _propTypes2.default.string,
  errorMessage: _propTypes2.default.string,
  onChange: _propTypes2.default.func,
  required: _propTypes2.default.bool,
  valid: _propTypes2.default.bool,
  placeholder: _propTypes2.default.string,
  autoComplete: _propTypes2.default.string
};
exports.default = SweetInput;
module.exports = exports['default'];