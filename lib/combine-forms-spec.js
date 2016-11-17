'use strict';

var _chai = require('chai');

var _getForm = require('../src/utils/get-form');

var _getForm2 = _interopRequireDefault(_getForm);

var _redux = require('redux');

var _src = require('../src');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('combineForms()', function () {
  beforeEach(function () {
    return (0, _getForm.clearGetFormCache)();
  });

  context('standard combined reducer', function () {
    var reducer = (0, _src.combineForms)({
      foo: (0, _src.modelReducer)('foo', { one: 'two' }),
      bar: (0, _src.modelReducer)('bar', { three: 'four' })
    });

    it('exists as a function', function () {
      _chai.assert.isFunction(_src.combineForms);
    });

    it('should return a reducer function', function () {
      _chai.assert.isFunction(reducer);
    });

    describe('initial state', function () {
      var initialState = reducer(undefined, { type: null });

      it('should contain the initial state of each reducer', function () {
        _chai.assert.containSubset(initialState, {
          foo: { one: 'two' },
          bar: { three: 'four' }
        });
      });
    });

    describe('usage with getForm()', function () {
      var state = reducer(undefined, { type: null });

      it('should be able to retrieve the proper form', function () {
        var fooForm = (0, _getForm2.default)(state, 'foo');

        _chai.assert.equal(fooForm, state.forms.foo);

        var barForm = (0, _getForm2.default)(state, 'bar');

        _chai.assert.equal(barForm, state.forms.bar);
      });
    });
  });

  describe('implicit model reducer creation with initial state', function () {
    var implicitReducer = (0, _src.combineForms)({
      foo: { one: 'two' },
      bar: { three: 'four' }
    });

    it('should respond to change actions', function () {
      var state = implicitReducer(undefined, _src.actions.change('foo.one', 'changed'));

      _chai.assert.equal(state.foo.one, 'changed');

      state = implicitReducer(state, _src.actions.change('bar.three', 'changed again'));

      _chai.assert.equal(state.bar.three, 'changed again');
    });
  });

  describe('setting the "key" option', function () {
    var customKeyReducer = (0, _src.combineForms)({
      foo: { bar: 'baz' }
    }, '', { key: 'myForms' });

    var initialState = customKeyReducer(undefined, { type: null });

    it('should have the form reducer state under the custom forms key', function () {
      _chai.assert.equal(initialState.myForms.$form.model, '');
    });

    it('should be retrievable with getForm()', function () {
      var fooForm = (0, _getForm2.default)(initialState, 'foo');

      _chai.assert.equal(fooForm, initialState.myForms.foo);
    });
  });

  describe('deep forms', function () {
    var reducer = (0, _redux.combineReducers)({
      deep: (0, _src.combineForms)({
        foo: { bar: 'baz' }
      }, 'deep')
    });

    it('should be able to find the deep form', function () {
      var state = reducer(undefined, { type: null });

      _chai.assert.ok((0, _getForm2.default)(state, 'deep.foo'));
    });
  });
});

describe('createForms()', function () {
  beforeEach(function () {
    return (0, _getForm.clearGetFormCache)();
  });

  it('exists as a function', function () {
    _chai.assert.isFunction(_src.createForms);
  });

  context('standard mapped reducers', function () {
    var forms = (0, _src.createForms)({
      foo: (0, _src.modelReducer)('foo', { one: 'two' }),
      bar: (0, _src.modelReducer)('bar', { three: 'four' })
    });

    it('should create a map of object keys to reducers', function () {
      _chai.assert.isFunction(forms.foo);
      _chai.assert.isFunction(forms.bar);
    });

    it('should create the form reducer at .forms', function () {
      _chai.assert.isFunction(forms.forms);
    });
  });

  context('reducers mapped from initial state', function () {
    var forms = (0, _src.createForms)({
      foo: { one: 'two' },
      bar: { three: 'four' }
    });

    it('should create a map of object keys to reducers', function () {
      _chai.assert.isFunction(forms.foo);
      _chai.assert.isFunction(forms.bar);
    });

    it('should create the form reducer at .forms', function () {
      _chai.assert.isFunction(forms.forms);
    });
  });

  context('setting the "key" option', function () {
    var forms = (0, _src.createForms)({
      foo: { one: 'two' },
      bar: { three: 'four' }
    }, '', { key: 'myForms' });

    it('should create the form reducer at .myForms', function () {
      _chai.assert.isFunction(forms.myForms);
    });
  });

  context('deep forms', function () {
    var reducers = {
      deep: (0, _src.createForms)({
        foo: { one: 'two' },
        bar: { three: 'four' }
      }, 'deep')
    };

    it('should create a map of object keys to reducers', function () {
      _chai.assert.isFunction(reducers.deep.foo);
      _chai.assert.isFunction(reducers.deep.bar);
    });

    it('should create the form reducer at .forms', function () {
      _chai.assert.isFunction(reducers.deep.forms);
    });
  });
});