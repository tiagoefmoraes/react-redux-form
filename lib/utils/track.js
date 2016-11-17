'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trackable = undefined;

var _findKey = require('../utils/find-key');

var _findKey2 = _interopRequireDefault(_findKey);

var _get2 = require('../utils/get');

var _get3 = _interopRequireDefault(_get2);

var _iteratee = require('../utils/iteratee');

var _iteratee2 = _interopRequireDefault(_iteratee);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function track(model) {
  for (var _len = arguments.length, predicates = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    predicates[_key - 1] = arguments[_key];
  }

  var isPartial = model[0] === '.';

  return function (fullState, parentModel) {
    var childModel = isPartial ? model.slice(1) : model;
    var state = isPartial ? (0, _get3.default)(fullState, parentModel) : fullState;

    var _childModel$split = childModel.split(/\[\]\.?/),
        _childModel$split2 = _toArray(_childModel$split),
        parentModelPath = _childModel$split2[0],
        childModelPaths = _childModel$split2.slice(1);

    var fullPath = parentModelPath;
    var subState = (0, _get3.default)(state, fullPath);

    predicates.forEach(function (predicate, i) {
      var childModelPath = childModelPaths[i];
      var predicateIteratee = (0, _iteratee2.default)(predicate);

      var subPath = childModelPath ? (0, _findKey2.default)(subState, predicateIteratee) + '.' + childModelPath : '' + (0, _findKey2.default)(subState, predicateIteratee);

      subState = (0, _get3.default)(subState, subPath);
      fullPath += '.' + subPath;
    });

    return isPartial ? [parentModel, fullPath].join('.') : fullPath;
  };
}

function trackable(actionCreator) {
  return function (model) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    if (typeof model === 'function') {
      return function (dispatch, getState) {
        var modelPath = model(getState());

        dispatch(actionCreator.apply(undefined, [modelPath].concat(args)));
      };
    }

    return actionCreator.apply(undefined, [model].concat(args));
  };
}

exports.default = track;
exports.trackable = trackable;