'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = updateSubFields;

var _get = require('./get');

var _get2 = _interopRequireDefault(_get);

var _icepick = require('icepick');

var _icepick2 = _interopRequireDefault(_icepick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function updateSubField(subField, newSubState) {
  // Form
  if (subField && subField.$form) {
    var _ret = function () {
      // intermediate value - not mutated outside function
      var result = {};

      Object.keys(subField).forEach(function (key) {
        if (key === '$form') {
          result.$form = _icepick2.default.assign(subField.$form, newSubState);
        } else {
          result[key] = updateSubField(subField[key], newSubState);
        }
      });

      return {
        v: result
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }

  // Field
  return _icepick2.default.assign(subField, newSubState);
}

function updateSubFields(state, localPath, newState) {
  var field = (0, _get2.default)(state, localPath);

  // only forms can have fields -
  // skip if field is not a form
  if (!field.$form) return state;

  // intermediate value - not mutated outside function
  var updatedField = {};

  Object.keys(field).forEach(function (key) {
    if (key === '$form') {
      updatedField.$form = field.$form;
    } else {
      updatedField[key] = updateSubField(field[key], newState);
    }
  });

  if (!localPath.length) return updatedField;

  return _icepick2.default.assocIn(state, localPath, updatedField);
}