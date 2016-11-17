'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = map;

var _arrayMap = require('lodash/_arrayMap');

var _arrayMap2 = _interopRequireDefault(_arrayMap);

var _baseMap = require('lodash/_baseMap');

var _baseMap2 = _interopRequireDefault(_baseMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function map(values, iteratee) {
  var func = Array.isArray(values) ? _arrayMap2.default : _baseMap2.default;

  return func(values, iteratee);
}