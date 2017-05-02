'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Layout = require('./Layout');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const shallowCompare = require('react-addons-shallow-compare');

class ModalsFactory extends _react.Component {

  // shouldComponentUpdate(nextProps, nextState) {
  //   return shallowCompare(this, nextProps, nextState);
  // }

  _renderModalHeader(title) {
    return _react2.default.createElement(
      'div',
      { className: 'modal-header' },
      _react2.default.createElement(
        'button',
        { type: 'button', className: 'text-muted close', 'data-dismiss': 'modal', 'aria-hidden': 'true' },
        'x'
      ),
      _react2.default.createElement(
        'h3',
        { className: 'modal-title mt-20' },
        title
      )
    );
  }

  _renderModalFooter() {

    return _react2.default.createElement('div', { className: 'modal-footer mb-10' });
  }

  _renderModalBody(ModalComponent) {
    return _react2.default.createElement(
      _Layout.Row,
      null,
      _react2.default.createElement(
        _Layout.Col,
        { size: '12' },
        _react2.default.createElement(
          'div',
          { className: 'modal-body' },
          _react2.default.createElement(ModalComponent, this.props)
        )
      )
    );
  }
  render() {
    const { size: size, modalref: modalref, title: title, ModalComponent: ModalComponent, showHeaderAndFooter: showHeaderAndFooter } = this.props;

    return _react2.default.createElement(
      'div',
      { className: 'modal fade', id: modalref, tabIndex: '-1', role: 'dialog', 'aria-labelledby': 'myModalLabel', 'aria-hidden': 'true' },
      _react2.default.createElement(
        'div',
        { className: `modal-dialog mt-80 ${size}` },
        _react2.default.createElement(
          'div',
          { className: 'modal-content' },
          showHeaderAndFooter && this._renderModalHeader(title),
          this._renderModalBody(ModalComponent),
          showHeaderAndFooter && this._renderModalFooter()
        )
      )
    );
  }
}
exports.default = ModalsFactory;
ModalsFactory.displayName = 'ModalsFactory';
ModalsFactory.propTypes = {
  size: _react2.default.PropTypes.string,
  factory: _react2.default.PropTypes.func,
  modalref: _react2.default.PropTypes.string,
  title: _react2.default.PropTypes.string,
  showHeaderAndFooter: _react2.default.PropTypes.bool,
  ModalComponent: _react2.default.PropTypes.func
};

ModalsFactory.show = modalRef => {
  $(`#${modalRef}`).modal('show');
  $(`#${modalRef}`).find('.modal-dialog').css({ 'height': 'auto', 'max-height': '100%' });
};

ModalsFactory.hide = modalRef => {
  $(`#${modalRef}`).modal('hide');
};

module.exports = exports['default'];
