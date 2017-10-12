'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _configs = require('../configs');

var _configs2 = _interopRequireDefault(_configs);

var _seed = require('./seed');

var _seed2 = _interopRequireDefault(_seed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongo = _configs2.default.mongo;


var insertDefaultData = function insertDefaultData(url, db) {
  if (url === mongo.sweeter.url) {
    db.collection('users').insert(_seed2.default.user, function (err) {
      _assert2.default.equal(null, err);
      db.close();
    });

    db.collection('blogs').insert(_seed2.default.blogs, function (err) {
      _assert2.default.equal(null, err);
      db.close();
    });
  } else {
    db.collection('test').insert({ 'test': 'test' }, function (err) {
      _assert2.default.equal(null, err);
      db.close();
    });
  }

  console.log('[' + _chalk2.default.keyword('orange')('mongodb') + '] ' + _chalk2.default.green.bold('==>') + ' Finish insert default data... ');
};

var connectMongodbPromise = function connectMongodbPromise(url) {
  return new _promise2.default(function (resolve, reject) {
    _mongodb2.default.connect(url, function (connectErr, db) {
      if (connectErr) {
        return reject('[' + _chalk2.default.keyword('orange')('mongodb') + '] ' + _chalk2.default.red('==> Database connectErr, please check your database'));
      }

      db.listCollections().toArray(function (err, items) {
        if (items.length == 0) {
          console.log('[' + _chalk2.default.keyword('orange')('mongodb') + '] ' + _chalk2.default.gray('==>') + ' Database unavaliable: ' + url);
          insertDefaultData(url, db);
        } else {
          console.log('[' + _chalk2.default.keyword('orange')('mongodb') + '] ' + _chalk2.default.green.bold('==>') + ' Database avaliable: ' + _chalk2.default.blue(url));
        }

        db.close();
        resolve();
      });
    });
  });
};

exports.default = function () {
  var mongodbPromises = [];
  mongodbPromises.push(connectMongodbPromise(mongo.sweeter.url), connectMongodbPromise(mongo.session.url));

  console.log('[' + _chalk2.default.keyword('orange')('mongodb') + '] ' + _chalk2.default.green.bold('==>') + ' Start to check database......');

  return mongodbPromises;
};

module.exports = exports['default'];