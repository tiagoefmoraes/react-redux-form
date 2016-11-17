'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createInitialState = createInitialState;
exports.default = createFormReducer;

var _get2 = require('../utils/get');

var _get3 = _interopRequireDefault(_get2);

var _icepick = require('icepick');

var _icepick2 = _interopRequireDefault(_icepick);

var _arraysEqual = require('../utils/arrays-equal');

var _arraysEqual2 = _interopRequireDefault(_arraysEqual);

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _mapValues = require('../utils/map-values');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _toPath = require('../utils/to-path');

var _toPath2 = _interopRequireDefault(_toPath);

var _composeReducers = require('../utils/compose-reducers');

var _composeReducers2 = _interopRequireDefault(_composeReducers);

var _batchedEnhancer = require('../enhancers/batched-enhancer');

var _batchedEnhancer2 = _interopRequireDefault(_batchedEnhancer);

var _initialFieldState = require('../constants/initial-field-state');

var _initialFieldState2 = _interopRequireDefault(_initialFieldState);

var _changeActionReducer = require('./form/change-action-reducer');

var _changeActionReducer2 = _interopRequireDefault(_changeActionReducer);

var _formActionsReducer = require('./form-actions-reducer');

var _formActionsReducer2 = _interopRequireDefault(_formActionsReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getSubModelString(model, subModel) {
  if (!model) return subModel;

  return model + '.' + subModel;
}

function createInitialState(model, state) {
  var customInitialFieldState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var initialState = void 0;
  var _options$lazy = options.lazy,
      lazy = _options$lazy === undefined ? false : _options$lazy;


  if ((0, _isArray2.default)(state) || (0, _isPlainObject2.default)(state)) {
    initialState = lazy ? {} : (0, _mapValues2.default)(state, function (subState, subModel) {
      return createInitialState(getSubModelString(model, subModel), subState, customInitialFieldState);
    });
  } else {
    return _icepick2.default.merge(_initialFieldState2.default, _extends({
      initialValue: state,
      value: state,
      model: model
    }, customInitialFieldState));
  }

  var initialForm = _icepick2.default.merge(_initialFieldState2.default, _extends({
    initialValue: state,
    value: state,
    model: model
  }, customInitialFieldState));

  return _icepick2.default.set(initialState, '$form', initialForm);
}

function wrapFormReducer(plugin, modelPath, initialState) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    if (!action.model) return state;

    var path = (0, _toPath2.default)(action.model);

    if (modelPath.length && !(0, _arraysEqual2.default)(path.slice(0, modelPath.length), modelPath)) {
      return state;
    }

    var localPath = path.slice(modelPath.length);

    return plugin(state, action, localPath);
  };
}

var defaultPlugins = [_formActionsReducer2.default, _changeActionReducer2.default];

function createFormReducer(model) {
  var initialState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _options$plugins = options.plugins,
      plugins = _options$plugins === undefined ? [] : _options$plugins,
      customInitialFieldState = options.initialFieldState,
      _options$transformAct = options.transformAction,
      transformAction = _options$transformAct === undefined ? null : _options$transformAct;

  var modelPath = (0, _toPath2.default)(model);
  var initialFormState = createInitialState(model, initialState, customInitialFieldState, options);

  var wrappedPlugins = plugins.concat(defaultPlugins).map(function (plugin) {
    return wrapFormReducer(plugin, modelPath, initialFormState);
  });

  return (0, _batchedEnhancer2.default)(_composeReducers2.default.apply(undefined, _toConsumableArray(wrappedPlugins)), undefined, {
    transformAction: transformAction
  });
}