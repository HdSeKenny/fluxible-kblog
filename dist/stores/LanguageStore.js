'use strict';

var _createStore = require('fluxible/addons/createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * LanguageStore that supports:
 * 1) initial loading and update
 * s) rehydrate and dehydrate
 */
const LanguageStore = (0, _createStore2.default)({
    storeName: 'LanguageStore',
    handlers: {
        'LOAD_LANGUAGE': 'loadLanguage',
        'CHANGE_LANGUAGE': 'changeLanguage'
    },

    initialize: function () {
        this.language = null;
        this.save = null;
    },
    loadLanguage: function (res) {
        this.save = res.save;
        this.language = res.data;
        this.emitChange();
    },
    changeLanguage: function (res) {
        this.save = res.save;
        this.language = res.data;
        this.emitChange();
    },
    getLanguage: function () {
        return this.language;
    },
    dehydrate: function () {
        return {
            language: this.language,
            save: this.save
        };
    },
    rehydrate: function (state) {
        this.language = state.language;
        this.save = state.save;
        if (this.save) {
            store.set(decodeURIComponent(this.save.key), this.language, this.save.expired);
        }
    }
});
// import store from '../utils/sessionStorage';


module.exports = LanguageStore;
