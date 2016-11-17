'use strict';

var _chai = require('chai');

var _src = require('../src');

var _isValid = require('../src/form/is-valid');

var _isValid2 = _interopRequireDefault(_isValid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('formReducer()', function () {
  it('should create a reducer given a model', function () {
    var reducer = (0, _src.formReducer)('test');

    _chai.assert.isFunction(reducer);
  });

  it('should work with non-form actions', function () {
    var reducer = (0, _src.formReducer)('test');

    _chai.assert.doesNotThrow(function () {
      return reducer(undefined, { type: 'ANY' });
    });
  });

  describe('deep paths', function () {
    it('should be able to handle model at deep state path', function () {
      var reducer = (0, _src.formReducer)('forms.test');
      var actual = reducer(undefined, _src.actions.focus('forms.test.foo'));
      _chai.assert.containSubset(actual.foo, {
        focus: true
      });
    });

    it('should initialize fields given an initial state', function () {
      var reducer = (0, _src.formReducer)('test', {
        foo: 'bar',
        deep: {
          one: 'one',
          two: {
            three: 'four'
          }
        }
      });

      var actual = reducer(undefined, {});

      _chai.assert.containSubset(actual, {
        foo: {
          initialValue: 'bar'
        },
        deep: {
          one: { initialValue: 'one' },
          two: {
            three: { initialValue: 'four' }
          }
        }
      });
    });

    it('should become valid when an invalid field is removed', function (done) {
      var reducer = (0, _src.formReducer)('test', {
        items: [1, 2]
      });

      var validItem = reducer(undefined, _src.actions.setValidity('test.items[0]', true));
      var invalidItem = reducer(validItem, _src.actions.setValidity('test.items[1]', false));

      _chai.assert.isFalse((0, _isValid2.default)(invalidItem), 'form should be invalid');

      var removedState = void 0;

      var dispatch = function dispatch(action) {
        removedState = reducer(invalidItem, action);

        _chai.assert.isTrue((0, _isValid2.default)(removedState.$form));

        done();
      };

      var getState = function getState() {
        return { test: { items: [1, 2] } };
      };

      _src.actions.remove('test.items', 1)(dispatch, getState);
    });

    it('should become valid when a field with an invalid property is removed', function (done) {
      var reducer = (0, _src.formReducer)('test', {
        items: [{ name: 'item1' }, { name: 'item2' }]
      });

      var validItem = reducer(undefined, _src.actions.setValidity('test.items[0].name', true));
      var invalidItem = reducer(validItem, _src.actions.setValidity('test.items[1].name', false));

      _chai.assert.isFalse((0, _isValid2.default)(invalidItem), 'form should be invalid');

      var removedState = void 0;

      var dispatch = function dispatch(action) {
        removedState = reducer(invalidItem, action);
        _chai.assert.isTrue((0, _isValid2.default)(removedState));
        done();
      };

      var getState = function getState() {
        return invalidItem;
      };

      _src.actions.remove('test.items', 1)(dispatch, getState);
    });

    it('should clean after itself when a field is removed', function (done) {
      var items = [{ name: 'item1' }, { name: 'item2' }];
      var reducer = (0, _src.formReducer)('test', {
        items: items
      });

      var validItem = reducer(undefined, _src.actions.setValidity('test.items[0].name', true));
      var invalidItem = reducer(validItem, _src.actions.setValidity('test.items[1].name', false));

      _chai.assert.isFalse((0, _isValid2.default)(invalidItem), 'form should be invalid');

      var removedState = void 0;

      var dispatch = function dispatch(action) {
        removedState = reducer(invalidItem, action);

        _chai.assert.isFalse((0, _isValid2.default)(removedState));
        _chai.assert.isUndefined(removedState.items[1]);
      };

      var getState = function getState() {
        return { test: { items: items } };
      };

      _src.actions.remove('test.items', 0)(dispatch, getState);

      var dispatch2 = function dispatch2(action) {
        var removedState2 = reducer(removedState, action);
        _chai.assert.isTrue((0, _isValid2.default)(removedState2));
        done();
      };

      var getState2 = function getState2() {
        return removedState;
      };

      _src.actions.remove('test.items', 0)(dispatch2, getState2);
    });

    it('should have correct overall validity after a field validity is reset', function () {
      var reducer = (0, _src.formReducer)('test', {
        foo: 'one',
        bar: 'two'
      });

      var bothInvalidState = reducer(undefined, _src.actions.setFieldsValidity('test', {
        foo: false,
        bar: false
      }));

      _chai.assert.isFalse((0, _isValid2.default)(bothInvalidState));

      var oneInvalidState = reducer(bothInvalidState, _src.actions.setValidity('test.foo', true));

      _chai.assert.isFalse((0, _isValid2.default)(oneInvalidState));

      var validState = reducer(oneInvalidState, _src.actions.setValidity('test.bar', true));

      _chai.assert.isTrue((0, _isValid2.default)(validState));
    });

    it('should clean after itself when a valid field (scenario with 3 items)', function (done) {
      var reducer = (0, _src.formReducer)('test', {
        items: [{ name: 'item1' }, { name: 'item2' }, { name: 'item3' }]
      });

      var state1 = reducer(undefined, _src.actions.setValidity('test.items[0].name', true));
      var state2 = reducer(state1, _src.actions.setValidity('test.items[1].name', false));
      var state3 = reducer(state2, _src.actions.setValidity('test.items[2].name', true));

      _chai.assert.isFalse((0, _isValid2.default)(state3), 'form should be invalid');

      var removedState = void 0;

      var dispatch = function dispatch(action) {
        removedState = reducer(state3, action);
        _chai.assert.isFalse((0, _isValid2.default)(removedState), 'form should still be invalid');
        done();
      };

      var getState = function getState() {
        return state3;
      };

      _src.actions.remove('test.items', 2)(dispatch, getState);
    });

    it('should clean all props after itself when a field is removed', function (done) {
      var reducer = (0, _src.formReducer)('test', {
        items: [{ name: 'item1', dummy: true }, { name: 'item2', dummy: true }]
      });

      var invalidItem = reducer(undefined, _src.actions.setValidity('test.items[1].name', false));

      var removedState = void 0;

      var dispatch = function dispatch(action) {
        removedState = reducer(invalidItem, action);
        _chai.assert.isUndefined(removedState.items[1]);
        done();
      };

      var getState = function getState() {
        return invalidItem;
      };

      _src.actions.remove('test.items', 0)(dispatch, getState);
    });
  });

  describe('SET_SUBMIT_FAILED action', function () {
    it('should set form to submitFailed = true when submitFailed = false', function () {
      var reducer = (0, _src.formReducer)('test', { foo: '', bar: '' });

      var actual = reducer(undefined, _src.actions.setSubmitFailed('test'));

      _chai.assert.containSubset(actual, {
        $form: {
          submitFailed: true,
          submitted: false
        }
      });
    });

    it('should set form to submitFailed = false when form submitFailed = false', function () {
      var reducer = (0, _src.formReducer)('test', { foo: '', bar: '' });

      var actual = reducer(undefined, _src.actions.setSubmitFailed('test', false));

      _chai.assert.containSubset(actual, {
        $form: {
          submitFailed: false,
          submitted: false
        }
      });
    });
  });

  describe('lazy form initialization', function () {
    var initialState = { foo: '', bar: 'initial', baz: '' };
    var reducer = (0, _src.formReducer)('test', initialState, {
      lazy: true
    });

    it('should not initially create subfields', function () {
      _chai.assert.notProperty(reducer(undefined, { type: 'ANY' }), 'foo');
      _chai.assert.notProperty(reducer(undefined, { type: 'ANY' }), 'bar');
      _chai.assert.notProperty(reducer(undefined, { type: 'ANY' }), 'baz');
    });

    it('should still have the initial state', function () {
      _chai.assert.deepEqual(reducer(undefined, { type: 'ANY' }).$form.initialValue, initialState);
    });

    it('should create the fields only when interacted with', function () {
      var action = _src.actions.setTouched('test.foo');
      var touchedState = reducer(undefined, action);

      _chai.assert.property(touchedState, 'foo');
      _chai.assert.isTrue(touchedState.foo.touched);
      _chai.assert.notProperty(touchedState, 'bar');
      _chai.assert.notProperty(touchedState, 'baz');
    });

    it('should lazily set the initial value when the field is created', function () {
      var action = _src.actions.setTouched('test.bar');
      var touchedState = reducer(undefined, action);

      _chai.assert.equal(touchedState.bar.initialValue, 'initial');
    });
  });
});