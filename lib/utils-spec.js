'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _invertValidators = require('../src/utils/invert-validators');

var _invertValidators2 = _interopRequireDefault(_invertValidators);

var _getValidity = require('../src/utils/get-validity');

var _getValidity2 = _interopRequireDefault(_getValidity);

var _isValidityInvalid = require('../src/utils/is-validity-invalid');

var _isValidityInvalid2 = _interopRequireDefault(_isValidityInvalid);

var _getForm = require('../src/utils/get-form');

var _getFieldFromState = require('../src/utils/get-field-from-state');

var _getFieldFromState2 = _interopRequireDefault(_getFieldFromState);

var _redux = require('redux');

var _reduxImmutable = require('redux-immutable');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _chai = require('chai');

var _utils = require('./utils');

var _src = require('../src');

var _immutable = require('../immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var testContexts = {
  standard: _extends({}, _utils.defaultTestContexts.standard, {
    actions: _src.actions,
    formReducer: _src.formReducer,
    combineReducers: _redux.combineReducers,
    getFormStateKey: _getForm.getFormStateKey
  }),
  immutable: _extends({}, _utils.defaultTestContexts.immutable, {
    actions: _immutable.actions,
    formReducer: _immutable.formReducer,
    combineReducers: _reduxImmutable.combineReducers,
    getFormStateKey: _immutable.getFormStateKey
  })
};

Object.keys(testContexts).forEach(function (testKey) {
  var testContext = testContexts[testKey];
  var actions = testContext.actions;
  var formReducer = testContext.formReducer;
  var combineReducers = testContext.combineReducers;
  var getFormStateKey = testContext.getFormStateKey;
  var getInitialState = testContext.getInitialState;

  describe('utils (' + testKey + ' context)', function () {
    describe('invertValidators()', function () {
      it('should invert the validity of a validator function', function () {
        var validator = function validator(val) {
          return val === 'foo';
        };
        var inverted = (0, _invertValidators2.default)(validator);
        var error = (0, _isValidityInvalid2.default)((0, _getValidity2.default)(inverted, 'foo'));

        _chai.assert.isFalse(error);
      });

      it('should invert the validity of a validators map', function () {
        var validators = {
          isFoo: function isFoo(val) {
            return val === 'foo';
          },
          isBar: function isBar(val) {
            return val === 'bar';
          }
        };
        var inverted = (0, _invertValidators2.default)(validators);
        var error = (0, _isValidityInvalid2.default)((0, _getValidity2.default)(inverted, 'foo'));

        _chai.assert.isTrue(error);
      });

      it('should give equivalent results', function () {
        var validators = {
          foo: function foo(val) {
            return val === 'testing foo';
          },
          bar: {
            one: function one(val) {
              return val && val.length >= 1;
            },
            two: function two(val) {
              return val && val.length >= 2;
            }
          }
        };
        var inverted = (0, _invertValidators2.default)(validators);

        var value = {
          foo: 'testing foo',
          bar: '123'
        };

        var fieldsValidity = (0, _mapValues2.default)(inverted, function (validator, field) {
          var fieldValue = field ? (0, _get3.default)(value, field) : value;

          var fieldValidity = (0, _getValidity2.default)(validator, fieldValue);

          return fieldValidity;
        });

        _chai.assert.deepEqual(fieldsValidity, {
          foo: false,
          bar: {
            one: false,
            two: false
          }
        });
      });
    });

    describe('getValidity()', function () {
      it('should handle an error validator that returns a string', function () {
        var validators = { test: function test(val) {
            return !val && 'Required';
          } };

        _chai.assert.deepEqual((0, _getValidity2.default)(validators, ''), { test: 'Required' });
      });
    });

    describe('getFieldFromState()', function () {
      it('should exist', function () {
        _chai.assert.isFunction(_getFieldFromState2.default);
      });

      context('standard form', function () {
        it('finds the field in state', function () {
          var reducer = formReducer('person');
          var personForm = reducer(undefined, actions.change('person.name', 'john'));

          var field = (0, _getFieldFromState2.default)({ personForm: personForm }, 'person.name');
          _chai.assert.strictEqual(personForm.name, field);
        });
      });

      context('nested form', function () {
        it('finds the field in state', function () {
          var reducer = formReducer('app.car');
          var carForm = reducer(undefined, actions.change('app.car.make', 'mazda'));

          var field = (0, _getFieldFromState2.default)({ carForm: carForm }, 'app.car.make');
          _chai.assert.strictEqual(carForm.make, field);
        });
      });

      context('nested field', function () {
        it('finds the field in state', function () {
          var reducer = formReducer('district.library');
          var libraryForm = reducer(undefined, actions.change('district.library.hours.open', 8));

          var field = (0, _getFieldFromState2.default)({ libraryForm: libraryForm }, 'district.library.hours.open');
          _chai.assert.strictEqual(libraryForm.hours.open, field);
        });
      });
    });

    describe('getFormStateKey()', function () {
      context('explicit formReducers', function () {
        var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)(combineReducers({
          firstForm: formReducer('first'),
          deep: combineReducers({
            secondForm: formReducer('second', getInitialState({
              nested: { foo: 'bar' }
            })),
            deeper: combineReducers({
              thirdForm: formReducer('third')
            })
          })
        }));

        it('should find a shallow form reducer state key', function () {
          _chai.assert.equal(getFormStateKey(store.getState(), 'first'), 'firstForm');
        });

        it('should find a shallow form reducer state key with deep model', function () {
          _chai.assert.equal(getFormStateKey(store.getState(), 'first.anything'), 'firstForm');
        });

        it('should find a deep form reducer state key', function () {
          _chai.assert.equal(getFormStateKey(store.getState(), 'second'), 'deep.secondForm');
        });

        it('should find a deep form reducer state key with deep model', function () {
          _chai.assert.equal(getFormStateKey(store.getState(), 'second.anything'), 'deep.secondForm');
        });

        it('should find a deeper form reducer state key', function () {
          _chai.assert.equal(getFormStateKey(store.getState(), 'third'), 'deep.deeper.thirdForm');
        });

        it('should find a deeper form reducer state key with deep model', function () {
          _chai.assert.equal(getFormStateKey(store.getState(), 'third.anything'), 'deep.deeper.thirdForm');
        });

        it('should find a nested form reducer', function () {
          _chai.assert.equal(getFormStateKey(store.getState(), 'second.nested.foo'), 'deep.secondForm.nested');
        });
      });

      context('combined formReducer', function () {
        var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _src.combineForms)({
          first: {},
          deep: {
            second: {
              nested: { foo: 'bar' }
            },
            deeper: {
              third: {}
            }
          },
          array: {
            simple: [1, 2, 3],
            empty: []
          }
        }));

        it('should find a shallow form reducer state key', function () {
          _chai.assert.equal(getFormStateKey(store.getState(), 'first'), 'forms.first');
        });

        it('should find a shallow form reducer state key with deep model', function () {
          _chai.assert.equal(getFormStateKey(store.getState(), 'first.anything'), 'forms.first');
        });

        it('should find a deep form reducer state key', function () {
          _chai.assert.equal(getFormStateKey(store.getState(), 'deep.second'), 'forms.deep.second');
        });

        it('should find a deep form reducer state key with deep model', function () {
          _chai.assert.equal(getFormStateKey(store.getState(), 'deep.second.anything'), 'forms.deep.second');
        });

        it('should find a deeper form reducer state key', function () {
          _chai.assert.equal(getFormStateKey(store.getState(), 'deep.deeper.third'), 'forms.deep.deeper.third');
        });

        it('should find a deeper form reducer state key with deep model', function () {
          _chai.assert.equal(getFormStateKey(store.getState(), 'deep.deeper.third.anything'), 'forms.deep.deeper.third');
        });

        it('should find a nested form reducer', function () {
          _chai.assert.equal(getFormStateKey(store.getState(), 'deep.second.nested.foo'), 'forms.deep.second.nested');
        });

        it('should find an array form reducer state key', function () {
          _chai.assert.equal(getFormStateKey(store.getState(), 'array.simple[0]'), 'forms.array.simple');
        });
      });
    });

    describe('getField()', function () {
      beforeEach(function () {
        return (0, _getForm.clearGetFormCache)();
      });

      it('should exist', function () {
        _chai.assert.isFunction(_src.getField);
      });

      var store = (0, _redux.createStore)((0, _src.combineForms)({
        test: {
          foo: 'foo',
          deep: {
            bar: 'bar'
          }
        }
      }));

      it('should find a field from a store', function () {
        _chai.assert.containSubset((0, _src.getField)(store.getState(), 'test.foo'), {
          model: 'test.foo'
        });
      });

      it('should find a deep field from a store', function () {
        _chai.assert.containSubset((0, _src.getField)(store.getState(), 'test.deep.bar'), {
          model: 'test.deep.bar'
        });
      });

      it('should find a nested form from a store', function () {
        _chai.assert.containSubset((0, _src.getField)(store.getState(), 'test.deep'), {
          model: 'test.deep'
        });
      });
    });

    describe('getModel', function () {
      it('should exist', function () {
        _chai.assert.isFunction(_src.getModel);
      });

      var store = (0, _redux.createStore)((0, _src.combineForms)({
        test: {
          foo: 'foo',
          deep: {
            bar: 'bar'
          }
        }
      }));

      it('should find a model from a store', function () {
        _chai.assert.equal((0, _src.getModel)(store.getState(), 'test.foo'), 'foo');
      });

      it('should find a deep model from a store', function () {
        _chai.assert.equal((0, _src.getModel)(store.getState(), 'test.deep.bar'), 'bar');
      });

      it('should work with bracket notation', function () {
        _chai.assert.equal((0, _src.getModel)(store.getState(), 'test.deep["bar"]'), 'bar');

        _chai.assert.equal((0, _src.getModel)(store.getState(), 'test["deep"].bar'), 'bar');

        _chai.assert.equal((0, _src.getModel)(store.getState(), 'test["deep"]["bar"]'), 'bar');
      });

      it('should find a complex model from a store', function () {
        _chai.assert.deepEqual((0, _src.getModel)(store.getState(), 'test.deep'), { bar: 'bar' });
      });

      it('should ignore stray periods', function () {
        _chai.assert.equal((0, _src.getModel)(store.getState(), 'test.foo.'), 'foo');
      });

      it('should ignore ending empty brackets', function () {
        _chai.assert.equal((0, _src.getModel)(store.getState(), 'test.foo[]'), 'foo');
      });

      it('should work when given a number index as path', function () {
        var arrayStore = (0, _redux.createStore)((0, _src.combineForms)([{ foo: 'foo' }]));

        _chai.assert.deepEqual((0, _src.getModel)(arrayStore.getState(), 0), { foo: 'foo' });
      });

      it('should work with an array path', function () {
        _chai.assert.equal((0, _src.getModel)(store.getState(), ['test', 'foo']), 'foo');

        _chai.assert.equal((0, _src.getModel)(store.getState(), ['test', 'deep', 'bar']), 'bar');
      });
    });
  });
});