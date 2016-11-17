'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isValidityValid;

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _baseEvery = require('lodash/_baseEvery');

var _baseEvery2 = _interopRequireDefault(_baseEvery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isValidityValid(validity) {
  if ((0, _isPlainObject2.default)(validity)) {
    return (0, _baseEvery2.default)(validity, isValidityValid);
  }

  return !!validity;
}