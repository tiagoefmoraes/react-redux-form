'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = formActionsReducer;

var _actionTypes = require('../action-types');

var _actionTypes2 = _interopRequireDefault(_actionTypes);

var _updateField = require('../utils/update-field');

var _updateField2 = _interopRequireDefault(_updateField);

var _updateParentForms = require('../utils/update-parent-forms');

var _updateParentForms2 = _interopRequireDefault(_updateParentForms);

var _updateSubFields = require('../utils/update-sub-fields');

var _updateSubFields2 = _interopRequireDefault(_updateSubFields);

var _getFieldForm = require('../utils/get-field-form');

var _getFieldForm2 = _interopRequireDefault(_getFieldForm);

var _isPristine = require('../form/is-pristine');

var _isPristine2 = _interopRequireDefault(_isPristine);

var _map = require('../utils/map');

var _map2 = _interopRequireDefault(_map);

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _mapValues = require('../utils/map-values');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _inverse = require('../utils/inverse');

var _inverse2 = _interopRequireDefault(_inverse);

var _isValid = require('../form/is-valid');

var _isValid2 = _interopRequireDefault(_isValid);

var _isValidityValid = require('../utils/is-validity-valid');

var _isValidityValid2 = _interopRequireDefault(_isValidityValid);

var _isValidityInvalid = require('../utils/is-validity-invalid');

var _isValidityInvalid2 = _interopRequireDefault(_isValidityInvalid);

var _fieldActions = require('../actions/field-actions');

var _fieldActions2 = _interopRequireDefault(_fieldActions);

var _toPath = require('../utils/to-path');

var _toPath2 = _interopRequireDefault(_toPath);

var _initialFieldState = require('../constants/initial-field-state');

var _initialFieldState2 = _interopRequireDefault(_initialFieldState);

var _icepick = require('icepick');

var _icepick2 = _interopRequireDefault(_icepick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var resetFieldState = function resetFieldState(field, key) {
  if (!(0, _isPlainObject2.default)(field)) return field;

  if (key === '$form') {
    return _icepick2.default.assign(_initialFieldState2.default, {
      value: field.initialValue,
      model: field.model,
      intents: [{ type: 'validate' }, { type: 'load', value: field.initialValue }]
    });
  }

  if (field.$form) return (0, _mapValues2.default)(field, resetFieldState);

  return _icepick2.default.assign(_initialFieldState2.default, {
    value: field.initialValue,
    model: field.model,
    intents: [{ type: 'validate' }, { type: 'load', value: field.initialValue }]
  });
};

function formActionsReducer(state, action, localPath) {
  var _getFieldAndForm = (0, _updateField.getFieldAndForm)(state, localPath),
      _getFieldAndForm2 = _slicedToArray(_getFieldAndForm, 1),
      field = _getFieldAndForm2[0];

  var fieldState = field && field.$form ? field.$form : field;

  var fieldUpdates = {};
  var subFieldUpdates = {};
  var parentFormUpdates = void 0;

  switch (action.type) {
    case _actionTypes2.default.FOCUS:
      {
        fieldUpdates = {
          focus: true,
          intents: action.silent ? [] : [action]
        };

        break;
      }

    case _actionTypes2.default.BLUR:
    case _actionTypes2.default.SET_TOUCHED:
      {
        var fieldForm = (0, _getFieldForm2.default)(state, localPath).$form;

        fieldUpdates = {
          focus: action.type === _actionTypes2.default.BLUR ? false : field.focus,
          touched: true,
          retouched: fieldForm ? !!(fieldForm.submitted || fieldForm.submitFailed) : false
        };

        break;
      }

    case _actionTypes2.default.SET_UNTOUCHED:
      {
        fieldUpdates = {
          focus: false,
          touched: false
        };

        break;
      }

    case _actionTypes2.default.SET_PRISTINE:
    case _actionTypes2.default.SET_DIRTY:
      {
        var pristine = action.type === _actionTypes2.default.SET_PRISTINE;

        fieldUpdates = {
          pristine: pristine
        };

        subFieldUpdates = {
          pristine: pristine
        };

        parentFormUpdates = function parentFormUpdates(form) {
          return { pristine: (0, _isPristine2.default)(form) };
        };

        break;
      }

    case _actionTypes2.default.SET_VALIDATING:
      {
        fieldUpdates = {
          validating: action.validating,
          validated: !action.validating
        };

        break;
      }

    case _actionTypes2.default.SET_VALIDITY:
    case _actionTypes2.default.SET_ERRORS:
      {
        var _fieldUpdates;

        var isErrors = action.type === _actionTypes2.default.SET_ERRORS;
        var validity = isErrors ? action.errors : action.validity;

        var inverseValidity = (0, _isPlainObject2.default)(validity) ? (0, _mapValues2.default)(validity, _inverse2.default) : !validity;

        // If the field is a form, its validity is
        // also based on whether its fields are all valid.
        var areFieldsValid = field && field.$form ? (0, _isValid.fieldsValid)(field) : true;

        fieldUpdates = (_fieldUpdates = {}, _defineProperty(_fieldUpdates, isErrors ? 'errors' : 'validity', validity), _defineProperty(_fieldUpdates, isErrors ? 'validity' : 'errors', inverseValidity), _defineProperty(_fieldUpdates, 'validating', false), _defineProperty(_fieldUpdates, 'validated', true), _defineProperty(_fieldUpdates, 'valid', areFieldsValid && (isErrors ? !(0, _isValidityInvalid2.default)(validity) : (0, _isValidityValid2.default)(validity))), _fieldUpdates);

        parentFormUpdates = function parentFormUpdates(form) {
          return { valid: (0, _isValid2.default)(form) };
        };

        break;
      }

    case _actionTypes2.default.SET_FIELDS_VALIDITY:
      {
        return (0, _map2.default)(action.fieldsValidity, function (fieldValidity, subField) {
          return _fieldActions2.default.setValidity(subField, fieldValidity, action.options);
        }).reduce(function (accState, subAction) {
          return formActionsReducer(accState, subAction, localPath.concat((0, _toPath2.default)(subAction.model)));
        }, state);
      }

    case _actionTypes2.default.RESET_VALIDITY:
      {
        fieldUpdates = {
          valid: _initialFieldState2.default.valid,
          validity: _initialFieldState2.default.validity,
          errors: _initialFieldState2.default.errors
        };

        subFieldUpdates = {
          valid: _initialFieldState2.default.valid,
          validity: _initialFieldState2.default.validity,
          errors: _initialFieldState2.default.errors
        };

        break;
      }

    case _actionTypes2.default.SET_PENDING:
      {
        fieldUpdates = {
          pending: action.pending,
          submitted: false,
          submitFailed: false,
          retouched: false
        };

        parentFormUpdates = { pending: action.pending };

        break;
      }

    case _actionTypes2.default.SET_SUBMITTED:
      {
        var submitted = !!action.submitted;

        fieldUpdates = {
          pending: false,
          submitted: submitted,
          submitFailed: submitted ? false : fieldState && fieldState.submitFailed,
          touched: true,
          retouched: false
        };

        subFieldUpdates = {
          submitted: submitted,
          submitFailed: submitted ? false : fieldUpdates.submitFailed,
          retouched: false
        };

        break;
      }

    case _actionTypes2.default.SET_SUBMIT_FAILED:
      {
        fieldUpdates = {
          pending: false,
          submitted: fieldState.submitted && !action.submitFailed,
          submitFailed: !!action.submitFailed,
          touched: true,
          retouched: false
        };

        subFieldUpdates = {
          pending: false,
          submitted: !action.submitFailed,
          submitFailed: !!action.submitFailed,
          touched: true,
          retouched: false
        };

        break;
      }

    case _actionTypes2.default.RESET:
    case _actionTypes2.default.SET_INITIAL:
      {
        return (0, _updateField2.default)(state, localPath, resetFieldState, resetFieldState);
      }

    case _actionTypes2.default.ADD_INTENT:
      {
        fieldUpdates = {
          intents: [action.intent]
        };

        break;
      }

    case _actionTypes2.default.CLEAR_INTENTS:
      {
        fieldUpdates = {
          intents: []
        };

        break;
      }

    default:
      return state;
  }

  var updatedField = (0, _updateField2.default)(state, localPath, fieldUpdates);
  var updatedSubFields = Object.keys(subFieldUpdates).length ? (0, _updateSubFields2.default)(updatedField, localPath, subFieldUpdates) : updatedField;
  var updatedParentForms = parentFormUpdates ? (0, _updateParentForms2.default)(updatedSubFields, localPath, parentFormUpdates) : updatedSubFields;

  return updatedParentForms;
}