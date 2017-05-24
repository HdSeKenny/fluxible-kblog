'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MainSliders extends _react2.default.Component {

  render() {
    const { show: show } = this.props;
    if (!show) {
      return null;
    }
    return _react2.default.createElement(
      'section',
      { className: 'main-sliders tac' },
      _react2.default.createElement('p', { className: 'welcome' }),
      _react2.default.createElement('div', { className: 'sliders-btns mt-15' })
    );
  }
}
exports.default = MainSliders;
MainSliders.propTypes = {
  show: _propTypes2.default.bool
};
module.exports = exports['default'];
