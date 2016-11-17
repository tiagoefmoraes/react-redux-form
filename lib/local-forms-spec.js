'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _src = require('../src');

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _chai = require('chai');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint no-return-assign:0 */
describe('local forms', function () {
  it('should exist', function () {
    _chai.assert.isFunction(_src.LocalForm);
  });

  describe('standard usage with onUpdate', function () {
    var innerFormState = void 0;

    var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _src.LocalForm,
      { onUpdate: function onUpdate(formValue) {
          return innerFormState = formValue;
        } },
      _react2.default.createElement(_src.Control.text, { model: '.foo' })
    ));

    var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');

    it('should initially update with the loaded form value', function () {
      _chai.assert.containSubset(innerFormState, {
        $form: {
          pristine: true
        }
      });
    });

    it('should behave like a normal form, with an internal Redux state', function () {
      input.value = 'changed';
      _reactAddonsTestUtils2.default.Simulate.change(input);

      _chai.assert.containSubset(innerFormState, {
        $form: {
          pristine: false
        },
        foo: {
          pristine: false,
          value: 'changed'
        }
      });
    });
  });

  describe('standard usage with onChange', function () {
    var innerModelState = void 0;

    var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _src.LocalForm,
      { onChange: function onChange(modelValue) {
          return innerModelState = modelValue;
        } },
      _react2.default.createElement(_src.Control.text, { model: '.foo' })
    ));

    var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');

    it('should initially have an empty object (by default) as the model value', function () {
      _chai.assert.deepEqual(innerModelState, {});
    });

    it('should behave like a normal form, with an internal Redux state', function () {
      input.value = 'changed';
      _reactAddonsTestUtils2.default.Simulate.change(input);

      _chai.assert.deepEqual(innerModelState, {
        foo: 'changed'
      });
    });
  });

  describe('onChange with initialState', function () {
    var innerModelState = void 0;

    var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _src.LocalForm,
      {
        onChange: function onChange(modelValue) {
          return innerModelState = modelValue;
        },
        initialState: { foo: 'bar' }
      },
      _react2.default.createElement(_src.Control.text, { model: '.foo' })
    ));

    var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');

    it('should initially have an empty object (by default) as the model value', function () {
      _chai.assert.deepEqual(innerModelState, { foo: 'bar' });
    });

    it('should behave like a normal form, with an internal Redux state', function () {
      input.value = 'changed';
      _reactAddonsTestUtils2.default.Simulate.change(input);

      _chai.assert.deepEqual(innerModelState, {
        foo: 'changed'
      });
    });
  });
});