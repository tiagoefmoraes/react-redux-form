'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isValidityInvalid;

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _arraySome = require('lodash/_arraySome');

var _arraySome2 = _interopRequireDefault(_arraySome);

var _baseSome = require('lodash/_baseSome');

var _baseSome2 = _interopRequireDefault(_baseSome);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isValidityInvalid(errors) {
  var some = Array.isArray(errors) ? _arraySome2.default : _baseSome2.default;

  if ((0, _isPlainObject2.default)(errors)) {
    return some(errors, isValidityInvalid);
  }

  return !!errors;
}