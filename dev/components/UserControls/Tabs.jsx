'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FluxibleMixin = require('fluxible-addons-react/FluxibleMixin');

var _FluxibleMixin2 = _interopRequireDefault(_FluxibleMixin);

var _reactRouter = require('react-router');

var _reactBootstrap = require('react-bootstrap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Tabs = _react2.default.createClass({

  displayName: 'Tabs',

  propTypes: {
    selected: _react2.default.PropTypes.number,
    children: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.array, _react2.default.PropTypes.element]).isRequired
  },

  getDefaultProps: function () {
    return {
      selected: 0
    };
  },
  getInitialState: function () {
    return {
      selected: this.props.selected
    };
  },
  _renderTitles: function () {
    function labels(child, index) {
      let activeClass = this.state.selected === index ? 'active' : '';
      return _react2.default.createElement(
        'li',
        { key: index, className: activeClass },
        _react2.default.createElement(
          _reactRouter.Link,
          { to: '#', onClick: this.handleClick.bind(this, index) },
          child.props.label
        )
      );
    }

    return _react2.default.createElement(
      'ul',
      { className: 'tabs-labels' },
      this.props.children.map(labels.bind(this))
    );
  },
  _renderContent: function () {
    return _react2.default.createElement(
      'div',
      { className: 'tabs-content' },
      this.props.children[this.state.selected]
    );
  },
  handleClick: function (index, event) {
    event.preventDefault();
    this.setState({
      selected: index
    });
  },
  render: function () {
    return _react2.default.createElement(
      'div',
      { className: 'user-tabs' },
      this._renderTitles(),
      this._renderContent()
    );
  }
});

exports.default = Tabs;
module.exports = exports['default'];
