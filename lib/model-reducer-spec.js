'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _chai = require('chai');

var _src = require('../src');

describe('modelReducer()', function () {
  it('should create a reducer given a model', function () {
    var reducer = (0, _src.modelReducer)('test');

    _chai.assert.isFunction(reducer);
  });

  it('should create a reducer with initial state given a model and initial state', function () {
    var reducer = (0, _src.modelReducer)('test', { foo: 'bar' });

    _chai.assert.deepEqual(reducer(undefined, {}), { foo: 'bar' });
  });

  it('should ignore external actions', function () {
    var model = { foo: 'bar' };
    var reducer = (0, _src.modelReducer)('test', model);
    var externalAction = {
      type: 'EXTERNAL_ACTION'
    };

    _chai.assert.deepEqual(reducer(undefined, externalAction), model);
  });

  it('should ignore actions that are outside of the model', function () {
    var model = { foo: 'bar' };
    var reducer = (0, _src.modelReducer)('test', model);

    _chai.assert.deepEqual(reducer(undefined, _src.actions.change('outside', 'value')), model);

    _chai.assert.deepEqual(reducer(undefined, _src.actions.change('external.value', 'value')), model);
  });

  it('should update the state given a change action', function () {
    var model = { foo: 'bar', one: 'two' };
    var reducer = (0, _src.modelReducer)('test', model);

    _chai.assert.deepEqual(reducer(undefined, _src.actions.change('test.foo', 'new')), { foo: 'new', one: 'two' });
  });

  it('should be able to handle models with depth > 1', function () {
    var model = { bar: [1, 2, 3] };
    var deepReducer = (0, _src.modelReducer)('test.foo');
    var shallowReducer = function shallowReducer() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { original: 'untouched', foo: model };
      var action = arguments[1];
      return _extends({}, state, {
        foo: deepReducer(state.foo, action)
      });
    };

    _chai.assert.deepEqual(shallowReducer(undefined, {}), { original: 'untouched', foo: model });

    _chai.assert.deepEqual(shallowReducer(undefined, _src.actions.change('test.foo', 'something else')), { original: 'untouched', foo: 'something else' });

    _chai.assert.deepEqual(shallowReducer(undefined, _src.actions.change('test.foo.bar', 'baz')), { original: 'untouched', foo: { bar: 'baz' } });

    _chai.assert.deepEqual(shallowReducer(undefined, _src.actions.change('test.foo.bar[1]', 'two')), { original: 'untouched', foo: { bar: [1, 'two', 3] } });
  });

  it('should handle model at deep state path', function () {
    var reducer = (0, _src.modelReducer)('forms.test');

    _chai.assert.deepEqual(reducer(undefined, _src.actions.change('forms.test.foo', 'new')), { foo: 'new' });

    _chai.assert.deepEqual(reducer(undefined, _src.actions.change('forms.different.foo', 'new')), {}, 'should only change when base path is equal');
  });
});