'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.getFieldAndForm = getFieldAndForm;
exports.default = updateField;

var _icepick = require('icepick');

var _icepick2 = _interopRequireDefault(_icepick);

var _get = require('./get');

var _get2 = _interopRequireDefault(_get);

var _mapValues = require('./map-values');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _formReducer = require('../reducers/form-reducer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function assocIn(state, path, value, fn) {
  if (!path.length) return _icepick2.default.assign(state, value);
  if (!fn) return _icepick2.default.assocIn(state, path, value);

  var key0 = path[0];

  if (path.length === 1) {
    return fn(_icepick2.default.assoc(state, key0, value));
  }

  return fn(_icepick2.default.assoc(state, key0, assocIn(state[key0] || {}, path.slice(1), value, fn)));
}

function tempInitialState(path) {
  var initialValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (path.length === 1) return _defineProperty({}, path[0], initialValue);

  return _defineProperty({}, path[0], tempInitialState(path.slice(1), initialValue));
}

function getFieldAndForm(formState, modelPath) {
  var field = (0, _get2.default)(formState, modelPath);
  var form = formState;

  if (!field) {
    var initialValue = (0, _get2.default)(formState.$form.initialValue, modelPath);

    form = _icepick2.default.merge((0, _formReducer.createInitialState)(formState.$form.model, tempInitialState(modelPath, initialValue)), formState);

    field = (0, _get2.default)(form, modelPath);
  }

  return [field, form];
}

function updateField(state, path, newState, newSubState, updater) {
  var _getFieldAndForm = getFieldAndForm(state, path),
      _getFieldAndForm2 = _slicedToArray(_getFieldAndForm, 2),
      field = _getFieldAndForm2[0],
      fullState = _getFieldAndForm2[1];

  if (!field) return state;

  var isForm = field.hasOwnProperty('$form');
  var fieldPath = isForm ? _icepick2.default.push(path, '$form') : path;

  var fieldState = isForm ? field.$form : field;

  var updatedFieldState = typeof newState === 'function' ? newState(fieldState) : newState;

  if (isForm && newSubState) {
    var formState = (0, _mapValues2.default)(field, function (subState, key) {
      if (key === '$form') {
        return _icepick2.default.assign(fieldState, updatedFieldState);
      }

      var updatedSubState = typeof newSubState === 'function' ? newSubState(subState, updatedFieldState) : newSubState;

      return _icepick2.default.assign(subState, updatedSubState);
    });

    if (!path.length) return formState;

    return assocIn(fullState, path, formState, updater);
  }

  return assocIn(fullState, fieldPath, _icepick2.default.assign(fieldState, updatedFieldState), updater);
}