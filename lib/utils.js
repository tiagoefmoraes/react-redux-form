'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultTestContexts = undefined;
exports.testCreateStore = testCreateStore;
exports.testRender = testRender;

var _chai = require('chai');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _toPath = require('lodash/toPath');

var _toPath2 = _interopRequireDefault(_toPath);

var _icepick = require('icepick');

var _icepick2 = _interopRequireDefault(_icepick);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _src = require('../src');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable */
var defaultTestContexts = exports.defaultTestContexts = {
  standard: {
    object: {},
    get: function get(value, path) {
      if (!path) return value;
      return (0, _get3.default)(value, path);
    },
    set: function set(state, path, value) {
      return _icepick2.default.setIn(state, path, value);
    },
    length: function length(value) {
      return value.length;
    },
    getInitialState: function getInitialState(state) {
      return state;
    }
  },
  immutable: {
    object: new _immutable2.default.Map(),
    get: function get(value, path) {
      if (!path) return value.toJS();

      var result = value.getIn((0, _toPath2.default)(path));
      try {
        return result.toJS();
      } catch (e) {
        return result;
      }
    },
    set: function set(state, path, value) {
      return state.setIn(path, value);
    },
    length: function length(value) {
      return value.size;
    },
    getInitialState: function getInitialState(state) {
      return _immutable2.default.fromJS(state);
    }
  }
};

function testCreateStore(reducers) {
  return (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)(reducers));
}

function testRender(component, store) {
  return _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    component
  ));
}