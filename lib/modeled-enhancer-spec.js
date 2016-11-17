'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _chai = require('chai');

var _src = require('../src');

describe('modeled() reducer enhancer', function () {
  var initialState = {
    foo: 'one',
    bar: 'two'
  };

  var fullAction = {
    type: 'FULL'
  };

  var existingReducer = function existingReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    if (action.type === fullAction.type) {
      return _extends({}, state, {
        full: state.foo + state.bar
      });
    }

    if (action.type === _src.actionTypes.RESET) {
      return _extends({}, state, {
        reset: true
      });
    }

    return state;
  };

  it('should exist', function () {
    _chai.assert.isFunction(_src.modeled);
  });

  it('should return a function', function () {
    _chai.assert.isFunction((0, _src.modeled)(existingReducer, 'test'));
  });

  it('should maintain the initial state of the existing reducer', function () {
    var modeledReducer = (0, _src.modeled)(existingReducer, 'test');

    _chai.assert.deepEqual(modeledReducer(undefined, { type: null }), initialState);
  });

  it('should respect the existing behavior of the existing reducer', function () {
    var modeledReducer = (0, _src.modeled)(existingReducer, 'test');

    _chai.assert.deepEqual(modeledReducer(undefined, fullAction), {
      foo: 'one',
      bar: 'two',
      full: 'onetwo'
    });
  });

  it('should act as a model reducer to update the state', function () {
    var modeledReducer = (0, _src.modeled)(existingReducer, 'test');

    _chai.assert.deepEqual(modeledReducer(undefined, _src.actions.change('test.foo', 'test')), {
      foo: 'test',
      bar: 'two'
    });
  });

  it('should allow common action to operate on both reducers', function () {
    var modeledReducer = (0, _src.modeled)(existingReducer, 'test');

    var changedState = {
      foo: 'changed',
      bar: 'changed'
    };

    _chai.assert.deepEqual(modeledReducer(changedState, _src.actions.reset('test.foo')), {
      foo: 'one',
      bar: 'changed',
      reset: true
    });
  });
});