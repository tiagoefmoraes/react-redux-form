'use strict';

var _chai = require('chai');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _src = require('../src');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('<Field parser={...} />', function () {
  context('standard usage', function () {
    var store = (0, _redux.createStore)((0, _redux.combineReducers)({
      test: (0, _src.modelReducer)('test', { foo: '' }),
      testForm: (0, _src.formReducer)('test', { foo: '' })
    }));

    var parseValue = function parseValue(val) {
      return {
        data: val
      };
    };

    var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(
        _src.Field,
        {
          model: 'test.foo',
          parser: parseValue,
          validators: {
            isParsed: function isParsed(val) {
              return val && val.data && val.data === 'parse test';
            }
          }
        },
        _react2.default.createElement('input', { type: 'text' })
      )
    ));

    var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

    it('should parse the changed values given a parser function', function () {
      var expected = { data: 'foo' };

      input.value = 'foo';

      _reactAddonsTestUtils2.default.Simulate.change(input);

      _chai.assert.deepEqual(store.getState().test.foo, expected);
    });

    it('should parse before validation', function () {
      input.value = 'parse test';

      _chai.assert.isFalse(store.getState().testForm.foo.$form.validity.isParsed, 'should not be valid yet');

      _reactAddonsTestUtils2.default.Simulate.change(input);

      _chai.assert.isTrue(store.getState().testForm.foo.$form.validity.isParsed);
    });
  });

  it('should parse the initial value immediately', function () {
    var store = (0, _redux.createStore)((0, _redux.combineReducers)({
      test: (0, _src.modelReducer)('test', { foo: 'initial' }),
      testForm: (0, _src.formReducer)('test', { foo: 'initial' })
    }));

    var parseValue = function parseValue(val) {
      return val.toUpperCase();
    };

    var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(
        _src.Field,
        {
          model: 'test.foo',
          parser: parseValue
        },
        _react2.default.createElement('input', { type: 'text' })
      )
    ));

    var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

    _chai.assert.equal(input.value, 'INITIAL');

    _chai.assert.equal(store.getState().test.foo, 'INITIAL');
  });

  it('should update the viewValue with only the data returned by parser', function () {
    var initial = { foo: '0123456789' };
    var expected = '0123';

    var store = (0, _redux.createStore)((0, _redux.combineReducers)({
      test: (0, _src.modelReducer)('test', initial),
      testForm: (0, _src.formReducer)('test', initial)
    }));

    var parseValue = function parseValue(val) {
      return val.substring(0, 4);
    };

    var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(
        _src.Field,
        {
          model: 'test.foo',
          parser: parseValue
        },
        _react2.default.createElement('input', { type: 'text' })
      )
    ));

    var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');
    input.value = '012345678912341268374612837';
    _reactAddonsTestUtils2.default.Simulate.change(input);

    _chai.assert.equal(input.value, expected);

    _chai.assert.equal(store.getState().test.foo, expected);
  });
});