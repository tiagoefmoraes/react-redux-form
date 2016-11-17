'use strict';

var _chai = require('chai');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _src = require('../src');

var _immutable3 = require('../immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('immutable modelReducer()', function () {
  it('should create a reducer given a model', function () {
    var reducer = (0, _immutable3.modelReducer)('test');

    _chai.assert.isFunction(reducer);
  });

  it('should create a reducer with initial state given a model and initial state', function () {
    var reducer = (0, _immutable3.modelReducer)('test', _immutable2.default.fromJS({ foo: 'bar' }));

    _chai.assert.deepEqual(reducer(undefined, {}), _immutable2.default.fromJS({ foo: 'bar' }));
  });

  it('should ignore external actions', function () {
    var model = _immutable2.default.fromJS({ foo: 'bar' });
    var reducer = (0, _immutable3.modelReducer)('test', model);
    var externalAction = {
      type: 'EXTERNAL_ACTION'
    };

    _chai.assert.equal(reducer(undefined, externalAction), model);
  });

  it('should ignore actions that are outside of the model', function () {
    var model = _immutable2.default.fromJS({ foo: 'bar' });
    var reducer = (0, _immutable3.modelReducer)('test', model);

    _chai.assert.equal(reducer(undefined, _src.actions.change('outside', 'value')), model);

    _chai.assert.equal(reducer(undefined, _src.actions.change('external.value', 'value')), model);
  });

  it('should update the state given a change action', function () {
    var model = _immutable2.default.fromJS({ foo: 'bar', one: 'two' });
    var reducer = (0, _immutable3.modelReducer)('test', model);

    _chai.assert.ok(reducer(undefined, _src.actions.change('test.foo', 'new')).equals(_immutable2.default.fromJS({ foo: 'new', one: 'two' })));
  });

  it('should be able to handle models with depth > 1', function () {
    var model = _immutable2.default.fromJS({ bar: [1, 2, 3] });
    var deepReducer = (0, _immutable3.modelReducer)('test.foo');
    var shallowReducer = function shallowReducer() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _immutable2.default.fromJS({
        original: 'untouched',
        foo: model
      });
      var action = arguments[1];
      return state.set('foo', deepReducer(state.get('foo'), action));
    };

    _chai.assert.ok(shallowReducer(undefined, {}).equals(_immutable2.default.fromJS({ original: 'untouched', foo: model })));

    _chai.assert.ok(shallowReducer(undefined, _src.actions.change('test.foo', 'something else')).equals(_immutable2.default.fromJS({ original: 'untouched', foo: 'something else' })));

    _chai.assert.ok(shallowReducer(undefined, _src.actions.change('test.foo.bar', 'baz')).equals(_immutable2.default.fromJS({ original: 'untouched', foo: { bar: 'baz' } })));

    _chai.assert.ok(shallowReducer(undefined, _src.actions.change('test.foo.bar[1]', 'two')).equals(_immutable2.default.fromJS({ original: 'untouched', foo: { bar: [1, 'two', 3] } })));
  });

  it('should handle model at deep state path', function () {
    var reducer = (0, _immutable3.modelReducer)('forms.test', _immutable2.default.Map());

    _chai.assert.ok(reducer(undefined, _src.actions.change('forms.test.foo', 'new')).equals(_immutable2.default.fromJS({ foo: 'new' })));

    _chai.assert.ok(reducer(undefined, _src.actions.change('forms.different.foo', 'new')).equals(_immutable2.default.Map()), 'should only change when base path is equal');
  });
});