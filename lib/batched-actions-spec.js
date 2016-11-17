'use strict';

var _chai = require('chai');

var _reduxMockStore = require('redux-mock-store');

var _reduxMockStore2 = _interopRequireDefault(_reduxMockStore);

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _src = require('../src');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('batched actions', function () {
  var mockStore = (0, _reduxMockStore2.default)([_reduxThunk2.default]);

  it('should batch actions', function (done) {
    var action = _src.actions.batch('test.foo', [_src.actions.change('test.foo', 'testing'), _src.actions.focus('test.foo'), _src.actions.toggle('test.foo')]);

    var expectedActions = [{
      type: _src.actionTypes.BATCH,
      model: 'test.foo',
      actions: [{
        model: 'test.foo',
        multi: false,
        silent: false,
        type: 'rrf/change',
        value: 'testing'
      }, {
        model: 'test.foo',
        type: 'rrf/focus',
        value: undefined
      }]
    }, {
      model: 'test.foo',
      multi: false,
      silent: false,
      type: _src.actionTypes.CHANGE,
      value: true
    }];

    var store = mockStore({}, expectedActions, done);

    store.dispatch(action);
  });

  it('should update the form reducer with each action', function () {
    var reducer = (0, _src.formReducer)('test');

    var testAction = _src.actions.batch('test.foo', [_src.actions.change('test.foo', 'testing'), _src.actions.focus('test.foo')]);

    var actual = reducer(undefined, testAction);

    _chai.assert.containSubset(actual.foo, {
      pristine: false,
      focus: true
    });
  });

  it('should update the model reducer with each action', function () {
    var reducer = (0, _src.modelReducer)('test');

    var testAction = _src.actions.batch('test.foo', [_src.actions.change('test.foo', 'testing'), _src.actions.focus('test.foo')]);

    var actual = reducer(undefined, testAction);

    _chai.assert.equal(actual.foo, 'testing');
  });

  it('should dispatch a null action if all actions are falsey', function (done) {
    var testAction = _src.actions.batch('test.foo', [false, null, undefined]);

    var expectedActions = [{ type: null }];

    var store = mockStore({}, expectedActions, done);

    store.dispatch(testAction);
  });
});