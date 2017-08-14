'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fluxible = require('fluxible');

var _fluxible2 = _interopRequireDefault(_fluxible);

var _fluxiblePluginFetchr = require('fluxible-plugin-fetchr');

var _fluxiblePluginFetchr2 = _interopRequireDefault(_fluxiblePluginFetchr);

var _configs = require('./configs');

var _configs2 = _interopRequireDefault(_configs);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _stores = require('./stores');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// init namespace for current App
// sessionStorage.setNamespace('sweeter');

const app = new _fluxible2.default({ component: _routes2.default });

// import sessionStorage from './utils/sessionStorage';

app.plug((0, _fluxiblePluginFetchr2.default)({
  xhrPath: `${_configs2.default.path_prefix}/api`,
  xhrTimeout: 30000
}));

app.plug(require('./plugins/cookie'));
app.plug(require('./plugins/config'));

app.registerStore(_stores.BlogStore);
app.registerStore(_stores.UserStore);
app.registerStore(_stores.ErrorStore);

exports.default = app;
module.exports = exports['default'];
