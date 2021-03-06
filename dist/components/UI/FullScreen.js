'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FullScreen = function (_React$Component) {
  (0, _inherits3.default)(FullScreen, _React$Component);

  function FullScreen() {
    (0, _classCallCheck3.default)(this, FullScreen);
    return (0, _possibleConstructorReturn3.default)(this, (FullScreen.__proto__ || (0, _getPrototypeOf2.default)(FullScreen)).apply(this, arguments));
  }

  (0, _createClass3.default)(FullScreen, [{
    key: 'getClassName',
    value: function getClassName() {
      return (0, _classnames2.default)({
        'fullscreen': true,
        'fullscreen-scroll': this.props.scroll
      }, this.props.className);
    }
  }, {
    key: 'render',
    value: function render() {
      var className = this.getClassName();
      return _react2.default.createElement(
        'div',
        (0, _extends3.default)({}, this.props, { className: className }),
        this.props.children
      );
    }
  }]);
  return FullScreen;
}(_react2.default.Component);

FullScreen.displayName = 'FullScreen';
FullScreen.propTypes = {
  className: _propTypes2.default.string,
  scroll: _propTypes2.default.bool,
  children: _propTypes2.default.array
};
exports.default = FullScreen;
module.exports = exports['default'];