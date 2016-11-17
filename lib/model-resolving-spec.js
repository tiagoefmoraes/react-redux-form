'use strict';

var _chai = require('chai');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _src = require('../src');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { applyMiddleware, combineReducers, createStore } from 'redux';
// import { Provider } from 'react-redux';
// import thunk from 'redux-thunk';
// import sinon from 'sinon';
// import capitalize from 'lodash/capitalize';

describe('model resolving', function () {
  var initialState = {
    foo: 'foo model',
    bar: ['first', 'second', 'third'],
    baz: [{ id: 1, value: 'one' }, { id: 2, value: 'two' }, { id: 3, value: 'three' }, { id: 4, value: [{ id: 10, value: 'deep one' }, { id: 20, value: 'deep two' }] }]
  };

  var store = (0, _utils.testCreateStore)({
    test: (0, _src.modelReducer)('test', initialState),
    testForm: (0, _src.formReducer)('test', initialState)
  });

  var unresolvedModels = [{
    label: 'with a dot accessor',
    parent: 'test',
    model: '.foo',
    expected: 'foo model'
  }, {
    label: 'with a bracket accessor',
    parent: 'test',
    model: '["foo"]',
    expected: 'foo model'
  }, {
    label: 'from an array',
    parent: 'test.bar',
    model: '[1]',
    expected: 'second'
  }, {
    label: 'with a parent tracker',
    parent: (0, _src.track)('test.baz[]', { id: 1 }),
    model: '.value',
    expected: 'one'
  }, {
    label: 'with a child tracker',
    parent: 'test',
    model: (0, _src.track)('.baz[].value', { id: 2 }),
    expected: 'two'
  }, {
    label: 'with a parent and child tracker',
    parent: (0, _src.track)('test.baz[]', { id: 4 }),
    model: (0, _src.track)('.value[].value', { id: 20 }),
    expected: 'deep two'
  }];

  unresolvedModels.forEach(function (_ref) {
    var label = _ref.label,
        parent = _ref.parent,
        model = _ref.model,
        expected = _ref.expected;

    ['input', 'text', 'textarea'].forEach(function (controlType) {
      [_src.Form, _src.Fieldset].forEach(function (Container) {
        var TestControl = _src.Control[controlType];

        var app = (0, _utils.testRender)(_react2.default.createElement(
          Container,
          { model: parent },
          _react2.default.createElement(TestControl, { model: model })
        ), store);

        var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(app, controlType === 'textarea' ? 'textarea' : 'input');

        it('(' + controlType + ') should resolve a partial model ' + label, function () {
          _chai.assert.equal(input.value, expected);
        });
      });
    });

    describe('with <Field>', function () {
      var app = (0, _utils.testRender)(_react2.default.createElement(
        _src.Form,
        { model: parent },
        _react2.default.createElement(
          _src.Field,
          { model: model },
          _react2.default.createElement('input', null)
        )
      ), store);

      var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(app, 'input');

      it('should resolve a partial model ' + label, function () {
        _chai.assert.equal(input.value, expected);
      });
    });
  });

  describe('with reset control', function () {
    var resetStore = (0, _utils.testCreateStore)({
      test: (0, _src.modelReducer)('test', { foo: '' }),
      testForm: (0, _src.formReducer)('test', { foo: '' })
    });

    var app = (0, _utils.testRender)(_react2.default.createElement(
      _src.Form,
      { model: 'test' },
      _react2.default.createElement(_src.Control.reset, { model: '.' })
    ), resetStore);

    var button = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(app, 'button');

    it('should resolve to the parent model and reset the form', function () {
      resetStore.dispatch(_src.actions.change('test.foo', 'changed'));

      _chai.assert.equal(resetStore.getState().test.foo, 'changed');

      _reactAddonsTestUtils2.default.Simulate.click(button);

      _chai.assert.equal(resetStore.getState().test.foo, '');
    });
  });

  describe('with <Errors />', function () {
    var errorStore = (0, _utils.testCreateStore)({
      test: (0, _src.modelReducer)('test', { foo: '' }),
      testForm: (0, _src.formReducer)('test', { foo: '' })
    });

    var app = (0, _utils.testRender)(_react2.default.createElement(
      _src.Form,
      {
        model: 'test',
        errors: { foo: function foo() {
            return 'this is incorrect';
          } }
      },
      _react2.default.createElement(_src.Errors, { model: '.foo' })
    ), errorStore);

    var errors = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(app, 'span');

    it('should show the proper errors for the resolved model', function () {
      _chai.assert.lengthOf(errors, 1);
      _chai.assert.equal(errors[0].innerHTML, 'this is incorrect');
    });
  });
});