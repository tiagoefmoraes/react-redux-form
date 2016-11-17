'use strict';

var _chai = require('chai');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _src = require('../src');

var _immutable3 = require('../immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('immutable modeled() reducer enhancer', function () {
  var initialState = _immutable2.default.fromJS({
    foo: 'one',
    bar: 'two'
  });

  var fullAction = {
    type: 'FULL'
  };

  var existingReducer = function existingReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    if (action.type === fullAction.type) {
      return state.set('full', state.get('foo') + state.get('bar'));
    }

    if (action.type === _src.actionTypes.RESET) {
      return state.set('reset', true);
    }

    return state;
  };

  it('should exist', function () {
    _chai.assert.isFunction(_immutable3.modeled);
  });

  it('should return a function', function () {
    _chai.assert.isFunction((0, _immutable3.modeled)(existingReducer, 'test'));
  });

  it('should maintain the initial state of the existing reducer', function () {
    var modeledReducer = (0, _immutable3.modeled)(existingReducer, 'test');

    _chai.assert.ok(modeledReducer(undefined, { type: null }).equals(initialState));
  });

  it('should respect the existing behavior of the existing reducer', function () {
    var modeledReducer = (0, _immutable3.modeled)(existingReducer, 'test');

    _chai.assert.ok(modeledReducer(undefined, fullAction).equals(_immutable2.default.fromJS({
      foo: 'one',
      bar: 'two',
      full: 'onetwo'
    })));
  });

  it('should act as a model reducer to update the state', function () {
    var modeledReducer = (0, _immutable3.modeled)(existingReducer, 'test');

    _chai.assert.ok(modeledReducer(undefined, _src.actions.change('test.foo', 'test')).equals(_immutable2.default.fromJS({
      foo: 'test',
      bar: 'two'
    })));
  });

  it('should allow common action to operate on both reducers', function () {
    var modeledReducer = (0, _immutable3.modeled)(existingReducer, 'test');

    var changedState = _immutable2.default.fromJS({
      foo: 'changed',
      bar: 'changed'
    });

    _chai.assert.ok(modeledReducer(changedState, _src.actions.reset('test.foo')).equals(_immutable2.default.fromJS({
      foo: 'one',
      bar: 'changed',
      reset: true
    })));
  });
});