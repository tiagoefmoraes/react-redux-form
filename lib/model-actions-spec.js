'use strict';

var _chai = require('chai');

var _redux = require('redux');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _src = require('../src');

var _immutable3 = require('../immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

describe('model actions', function () {
  var testItems = [{ id: 1, value: 'one' }, { id: 2, value: 'two' }, { id: 3, value: 'three' }];

  describe('load()', function () {
    it('should load model values', function () {
      var reducer = (0, _src.modelReducer)('foo');

      var actual = reducer({}, _src.actions.load('foo', { bar: 'string' }));
      _chai.assert.deepEqual(actual, { bar: 'string' });
    });

    it('should load array values and form values', function () {
      var reducer = (0, _src.combineForms)({
        user: {
          username: '',
          items: [{ name: 'item 1', subitems: [{ name: 'subitem 1' }] }]
        }
      });
      var DATA = {
        username: 'loaded',
        items: [{ name: 'item 1', subitems: [{ name: 'subitem 1' }, { name: 'subitem 2' }] }, { name: 'item 2', subitems: [{ name: 'subitem 1' }] }]
      };
      // const initial = reducer(undefined, {});
      var actual = reducer({}, _src.actions.load('user', DATA));

      _chai.assert.equal(actual.forms.user.items.$form.model, 'user.items');

      _chai.assert.equal(actual.forms.user.items[0].$form.model, 'user.items.0');
      _chai.assert.equal(actual.forms.user.items[0].name.model, 'user.items.0.name');
      _chai.assert.equal(actual.forms.user.items[0].subitems.$form.model, 'user.items.0.subitems');

      // assert.equal(actual.forms.user.items[0].subitems, "user.items.0.subitems.0");
      _chai.assert.equal(actual.forms.user.items[0].subitems[0].$form.model, 'user.items.0.subitems.0');
      _chai.assert.equal(actual.forms.user.items[0].subitems[0].name.model, 'user.items.0.subitems.0.name');
      _chai.assert.equal(actual.forms.user.items[0].subitems[1].$form.model, 'user.items.0.subitems.1');
      _chai.assert.equal(actual.forms.user.items[0].subitems[1].name.model, 'user.items.0.subitems.1.name');

      _chai.assert.equal(actual.forms.user.items[1].$form.model, 'user.items.1');
      _chai.assert.equal(actual.forms.user.items[1].name.model, 'user.items.1.name');
      _chai.assert.equal(actual.forms.user.items[1].subitems.$form.model, 'user.items.1.subitems');
      _chai.assert.equal(actual.forms.user.items[1].subitems[0].$form.model, 'user.items.1.subitems.0');
      _chai.assert.equal(actual.forms.user.items[1].subitems[0].name.model, 'user.items.1.subitems.0.name');
    });

    it('should load model and form stay untouched', function () {
      var reducer = (0, _redux.combineReducers)({
        foo: (0, _src.modelReducer)('foo'),
        fooForm: (0, _src.formReducer)('foo')
      });

      var actual = reducer({}, _src.actions.load('foo', { bar: 'string' }));
      _chai.assert.deepEqual(actual.foo, { bar: 'string' });
      _chai.assert.equal(actual.fooForm.$form.pristine, true);
      _chai.assert.equal(actual.fooForm.$form.touched, false);
    });
  });

  describe('change()', function () {
    it('should modify the model given a shallow path', function () {
      var reducer = (0, _src.modelReducer)('foo');

      var actual = reducer({}, _src.actions.change('foo.bar', 'string'));
      _chai.assert.deepEqual(actual, { bar: 'string' });
    });

    it('should modify the model given a deep path', function () {
      var reducer = (0, _src.modelReducer)('foo');

      var actual = reducer({}, _src.actions.change('foo.bar.baz', 'string'));
      _chai.assert.deepEqual(actual, { bar: { baz: 'string' } });
    });

    it('should work with a tracker', function () {
      var reducer = (0, _src.modelReducer)('foo', testItems);

      var dispatch = function dispatch(action) {
        var actual = reducer(undefined, action);
        _chai.assert.deepEqual(actual[1], { id: 2, value: 'tracked' });
      };

      var getState = function getState() {
        return { foo: testItems };
      };

      _src.actions.change((0, _src.track)('foo[].value', { id: 2 }), 'tracked')(dispatch, getState);
    });
  });

  describe('reset()', function () {
    it('should reset the model to the initial state provided in the reducer', function () {
      var reducer = (0, _src.modelReducer)('test', {
        foo: 'initial'
      });

      var actual = reducer({ foo: 'bar' }, _src.actions.reset('test.foo'));

      _chai.assert.deepEqual(actual, { foo: 'initial' });
    });

    it('should set the model to undefined if an initial state was not provided from a deep model', function () {
      var reducer = (0, _src.modelReducer)('test', {
        foo: 'initial'
      });

      var actual = reducer({ bar: { baz: 'uninitialized' } }, _src.actions.reset('test.bar.baz'));

      _chai.assert.isDefined(actual.bar);

      _chai.assert.isUndefined(actual.bar.baz);
    });

    it('should set the model to undefined if an initial state was not provided', function () {
      var reducer = (0, _src.modelReducer)('test', {
        foo: 'initial'
      });

      var actual = reducer({ bar: 'uninitialized' }, _src.actions.reset('test.bar'));

      _chai.assert.isUndefined(actual.bar);
    });

    it('should be able to reset an entire model', function () {
      var initialState = {
        foo: 'test foo',
        bar: 'test bar',
        baz: { one: 'two' }
      };

      var reducer = (0, _src.modelReducer)('test', initialState);

      var actual = reducer({}, _src.actions.reset('test'));

      _chai.assert.deepEqual(actual, initialState);
    });
  });

  describe('thunk action creators', function () {
    var actionTests = {
      push: [{
        init: { foo: [123] },
        params: ['test.foo', 456],
        expected: { foo: [123, 456] }
      }, {
        init: {},
        params: ['test.foo', 456],
        expected: { foo: [456] }
      }, {
        init: [testItems[0], { id: 2, value: ['two'] }, testItems[2]],
        params: [(0, _src.track)('test[].value', { id: 2 }), 'pushed'],
        expected: [testItems[0], {
          id: 2,
          value: ['two', 'pushed']
        }, testItems[2]],
        tracked: true
      }],
      xor: [{
        init: { foo: [123, 456] },
        params: ['test.foo', 456],
        expected: { foo: [123] }
      }, {
        init: { foo: ['primitive', { a: 'b' }] },
        params: ['test.foo', { a: 'b' }, function (item) {
          return (item.get ? item.get('a') : item.a) === 'b';
        }],
        expected: { foo: ['primitive'] },
        immutable: false
      }, {
        init: [testItems[0], { id: 2, value: ['two'] }, testItems[2]],
        params: [(0, _src.track)('test[].value', { id: 2 }), 'two'],
        expected: [testItems[0], { id: 2, value: [] }, testItems[2]],
        tracked: true
      }],
      toggle: [{
        init: { foo: true },
        params: ['test.foo'],
        expected: { foo: false }
      }, {
        init: testItems,
        params: [(0, _src.track)('test[].value', { id: 2 })],
        expected: [testItems[0], { id: 2, value: false }, testItems[2]],
        tracked: true
      }],
      filter: [{
        init: { foo: [1, 2, 3, 4, 5, 6] },
        params: ['test.foo', function (n) {
          return n % 2 === 0;
        }],
        expected: { foo: [2, 4, 6] }
      }, {
        init: [testItems[0], { id: 2, value: [1, 2, 3, 4, 5, 6] }, testItems[2]],
        params: [(0, _src.track)('test[].value', { id: 2 }), function (n) {
          return n % 2 === 0;
        }],
        expected: [testItems[0], { id: 2, value: [2, 4, 6] }, testItems[2]],
        tracked: true
      }],
      map: [{
        init: { foo: [1, 2, 3, 4, 5] },
        params: ['test.foo', function (n) {
          return n * 2;
        }],
        expected: { foo: [2, 4, 6, 8, 10] }
      }, {
        init: [testItems[0], { id: 2, value: [1, 2, 3, 4, 5] }, testItems[2]],
        params: [(0, _src.track)('test[].value', { id: 2 }), function (n) {
          return n * 2;
        }],
        expected: [testItems[0], { id: 2, value: [2, 4, 6, 8, 10] }, testItems[2]],
        tracked: true
      }],
      remove: [{
        init: { foo: ['first', 'second', 'third'] },
        params: ['test.foo', 1],
        expected: { foo: ['first', 'third'] }
      }, {
        init: [testItems[0], { id: 2, value: ['first', 'second', 'third'] }, testItems[2]],
        params: [(0, _src.track)('test[].value', { id: 2 }), 1],
        expected: [testItems[0], { id: 2, value: ['first', 'third'] }, testItems[2]],
        tracked: true
      }],
      move: [{
        init: { foo: ['first', 'second', 'third'] },
        params: ['test.foo', 2, 1],
        expected: { foo: ['first', 'third', 'second'] }
      }, {
        init: { foo: ['first', 'second', 'third'] },
        params: ['test.foo', 0, 2],
        expected: { foo: ['second', 'third', 'first'] }
      }, {
        init: { foo: [] },
        params: ['test.foo', 0, 2],
        expected: Error('Error moving array item: invalid bounds 0, 2')
      }, {
        init: [testItems[0], { id: 2, value: ['first', 'second', 'third'] }, testItems[2]],
        params: [(0, _src.track)('test[].value', { id: 2 }), 0, 2],
        expected: [testItems[0], { id: 2, value: ['second', 'third', 'first'] }, testItems[2]],
        tracked: true
      }],
      merge: [{
        init: { foo: { bar: 'baz', untouched: 'intact' } },
        params: ['test.foo', { bar: 'new', one: 'two' }],
        expected: { foo: { bar: 'new', one: 'two', untouched: 'intact' } }
      }, {
        init: [testItems[0], { id: 2, value: { bar: 'baz', untouched: 'intact' } }, testItems[2]],
        params: [(0, _src.track)('test[].value', { id: 2 }), { bar: 'new', one: 'two' }],
        expected: [testItems[0], { id: 2, value: { bar: 'new', one: 'two', untouched: 'intact' } }, testItems[2]],
        tracked: true
      }],
      omit: [{
        init: { one: 1, two: 2, three: 3 },
        params: ['test', 'two'],
        expected: { one: 1, three: 3 }
      }, {
        init: { one: 1, two: 2, three: 3 },
        params: ['test', ['one', 'three']],
        expected: { two: 2 }
      }, {
        init: [testItems[0], { id: 2, value: { one: 1, two: 2, three: 3 } }, testItems[2]],
        params: [(0, _src.track)('test[].value', { id: 2 }), 'two'],
        expected: [testItems[0], { id: 2, value: { one: 1, three: 3 } }, testItems[2]],
        tracked: true
      }]
    };

    /* eslint-disable array-callback-return */
    Object.keys(actionTests).map(function (action) {
      describe(action + '()', function () {
        actionTests[action].map(function (test) {
          var init = test.init,
              params = test.params,
              expected = test.expected;


          it('should modify the model to the expected result', function () {
            var reducer = (0, _src.modelReducer)('test');
            var getState = function getState() {
              return { test: init };
            };
            var dispatch = function dispatch(_action) {
              if (typeof _action === 'function') {
                _action(dispatch, getState);
              } else {
                _chai.assert.deepEqual(reducer(init, _action), expected);
              }
            };

            if (expected instanceof Error) {
              _chai.assert.throws(function () {
                return _src.actions[action].apply(_src.actions, _toConsumableArray(params))(dispatch, getState);
              }, expected.message);
            } else {
              _src.actions[action].apply(_src.actions, _toConsumableArray(params))(dispatch, getState);
            }
          });
        });
      });

      describe(action + '() (Immutable.JS)', function () {
        actionTests[action].map(function (test, i) {
          var init = test.init,
              params = test.params,
              expected = test.expected,
              tracked = test.tracked;

          // TODO: test tracker with immutablejs

          if (tracked) return;

          var initImmutable = _immutable2.default.fromJS(init);
          var immutableParams = params.map(function (param) {
            return _immutable2.default.fromJS(param);
          });

          it('should modify the model to the expected result (' + i + ')', function () {
            var reducer = (0, _immutable3.modelReducer)('test');
            var getState = function getState() {
              return { test: _immutable2.default.fromJS(initImmutable) };
            };
            var dispatch = function dispatch(_action) {
              if (typeof _action === 'function') {
                _action(dispatch, getState);
              } else {
                _chai.assert.deepEqual(reducer(initImmutable, _action).toJS(), expected, [reducer(initImmutable, _action), expected]);
              }
            };

            if (expected instanceof Error) {
              _chai.assert.throws(function () {
                return _immutable3.actions[action].apply(_immutable3.actions, _toConsumableArray(immutableParams))(dispatch, getState);
              }, expected.message);
            } else {
              _immutable3.actions[action].apply(_immutable3.actions, _toConsumableArray(immutableParams))(dispatch, getState);
            }
          });
        });
      });
    });
    /* eslint-enable */
  });
});