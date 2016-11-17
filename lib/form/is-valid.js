'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isValid;
exports.fieldsValid = fieldsValid;

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isValid(formState) {
  if (!formState) return true;

  if (!formState.$form) {
    var errors = formState.errors;


    if (!Array.isArray(errors) && !(0, _isPlainObject2.default)(errors)) {
      return !errors;
    }

    return Object.keys(formState.errors).every(function (errorKey) {
      var valid = !formState.errors[errorKey];

      return valid;
    });
  }

  return Object.keys(formState).every(function (key) {
    return isValid(formState[key]);
  });
}

function fieldsValid(formState) {
  return Object.keys(formState).every(function (key) {
    return key === '$form' || isValid(formState[key]);
  });
}