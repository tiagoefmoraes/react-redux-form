'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = changeActionReducer;

var _actionTypes = require('../../action-types');

var _actionTypes2 = _interopRequireDefault(_actionTypes);

var _icepick = require('icepick');

var _icepick2 = _interopRequireDefault(_icepick);

var _get = require('../../utils/get');

var _get2 = _interopRequireDefault(_get);

var _shallowEqual = require('../../utils/shallow-equal');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _compact = require('lodash/compact');

var _compact2 = _interopRequireDefault(_compact);

var _mapValues = require('../../utils/map-values');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _formReducer = require('../form-reducer');

var _initialFieldState = require('../../constants/initial-field-state');

var _initialFieldState2 = _interopRequireDefault(_initialFieldState);

var _updateParentForms = require('../../utils/update-parent-forms');

var _updateParentForms2 = _interopRequireDefault(_updateParentForms);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function updateFieldValue(field, action) {
  var parentModel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  var value = action.value,
      removeKeys = action.removeKeys,
      silent = action.silent,
      load = action.load,
      model = action.model;


  var fieldState = field && field.$form ? field.$form : field;

  var changedFieldProps = {
    validated: false,
    retouched: fieldState.submitted ? true : fieldState.retouched,
    intents: [{ type: 'validate' }],
    pristine: silent ? fieldState.pristine : false,
    initialValue: load ? value : fieldState.initialValue
  };

  if ((0, _shallowEqual2.default)(field.value, value)) {
    return _icepick2.default.merge(field, changedFieldProps);
  }

  if (removeKeys) {
    var _ret = function () {
      var valueIsArray = Array.isArray(field.$form.value);
      var removeKeysArray = Array.isArray(removeKeys) ? removeKeys : [removeKeys];

      var result = void 0;

      if (valueIsArray) {
        result = [];

        Object.keys(field).forEach(function (key) {
          if (!!~removeKeysArray.indexOf(+key) || key === '$form') return;

          result[key] = field[key];
        });

        return {
          v: _icepick2.default.set((0, _compact2.default)(result), '$form', field.$form)
        };
      }

      result = _extends({}, field);

      Object.keys(field).forEach(function (key) {
        if (!!~removeKeysArray.indexOf(key)) {
          delete result['' + key];
        }
      });

      return {
        v: result
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }

  if (!Array.isArray(value) && !(0, _isPlainObject2.default)(value)) {
    return _icepick2.default.merge(field, _icepick2.default.set(changedFieldProps, 'value', value));
  }

  var updatedField = (0, _mapValues2.default)(value, function (subValue, index) {
    // TODO: refactor
    var subField = field[index] || (0, _formReducer.createInitialState)('' + (parentModel ? parentModel + '.' : '') + model + '.' + index, subValue);

    if (Object.hasOwnProperty.call(subField, '$form')) {
      return updateFieldValue(subField, {
        model: index,
        value: subValue
      }, parentModel ? parentModel + '.' + model : model);
    }

    if ((0, _shallowEqual2.default)(subValue, subField.value)) {
      return subField;
    }

    return _icepick2.default.merge(subField, _icepick2.default.assign(changedFieldProps, {
      value: subValue,
      initialValue: load ? subValue : subField.initialValue
    }));
  });

  var dirtyFormState = _icepick2.default.merge(field.$form || _initialFieldState2.default, _icepick2.default.set(changedFieldProps, 'retouched', field.submitted || field.$form && field.$form.retouched));

  return _icepick2.default.set(updatedField, '$form', _icepick2.default.set(dirtyFormState, 'value', value));
}

function getFormValue(form) {
  if (!form.$form) return form.initialValue;

  var result = (0, _mapValues2.default)(form, function (field, key) {
    if (key === '$form') return undefined;

    return getFormValue(field);
  });

  delete result.$form;

  return result;
}

function changeActionReducer(state, action, localPath) {
  if (action.type !== _actionTypes2.default.CHANGE) return state;

  var field = (0, _get2.default)(state, localPath, (0, _formReducer.createInitialState)(action.model, action.value));

  var updatedField = updateFieldValue(field, action);

  if (!localPath.length) return updatedField;

  var updatedState = _icepick2.default.setIn(state, localPath, updatedField);

  if (action.silent) {
    return (0, _updateParentForms2.default)(updatedState, localPath, function (form) {
      var formValue = getFormValue(form);

      return {
        value: formValue,
        initialValue: formValue
      };
    });
  }

  return (0, _updateParentForms2.default)(updatedState, localPath, { pristine: false });
}