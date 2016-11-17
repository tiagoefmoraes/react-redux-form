'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint-disable */


var _chai = require('chai');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _utils = require('./utils');

var _src = require('../src');

var _immutable = require('../immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var testContexts = {
  standard: _extends({}, _utils.defaultTestContexts.standard, {
    Form: _src.Form,
    modelReducer: _src.modelReducer,
    formReducer: _src.formReducer,
    Field: _src.Field,
    Errors: _src.Errors,
    actions: _src.actions
  }),
  immutable: _extends({}, _utils.defaultTestContexts.immutable, {
    Form: _immutable.Form,
    modelReducer: _immutable.modelReducer,
    formReducer: _immutable.formReducer,
    Field: _immutable.Field,
    Errors: _immutable.Errors,
    actions: _immutable.actions
  })
};

Object.keys(testContexts).forEach(function (testKey) {
  var testContext = testContexts[testKey];
  var Form = testContext.Form;
  var modelReducer = testContext.modelReducer;
  var formReducer = testContext.formReducer;
  var Field = testContext.Field;
  var Errors = testContext.Errors;
  var actions = testContext.actions;
  var object = testContext.object;
  var get = testContext.get;
  var getInitialState = testContext.getInitialState;

  describe('<Errors /> component (' + testKey + ' context)', function () {
    it('should exist', function () {
      _chai.assert.ok(Errors);
    });

    describe('displaying errors from messages', function () {
      var initialState = getInitialState({ foo: '' });
      var store = (0, _utils.testCreateStore)({
        testForm: formReducer('test', initialState),
        test: modelReducer('test', initialState)
      });

      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          'form',
          null,
          _react2.default.createElement(Errors, { model: 'test.foo',
            messages: {
              required: 'This field is required',
              valid: 'This field is invalid'
            }
          }),
          _react2.default.createElement(
            Field,
            { model: 'test.foo',
              validators: {
                required: function required(v) {
                  return v && v.length;
                },
                valid: function valid(v) {
                  return v === 'valid';
                }
              }
            },
            _react2.default.createElement('input', { type: 'text' })
          )
        )
      ));

      var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');
      var errors = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span');

      it('should display all errors', function () {
        var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');
        var errors = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span');
        _chai.assert.lengthOf(errors, 2);
        _chai.assert.equal(errors[0].innerHTML, 'This field is required');
        _chai.assert.equal(errors[1].innerHTML, 'This field is invalid');
      });

      it('should display only relevant errors when validity changes', function () {
        var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');

        input.value = 'invalid';

        _reactAddonsTestUtils2.default.Simulate.change(input);

        var errors = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span');

        _chai.assert.lengthOf(errors, 1);
        _chai.assert.equal(errors[0].innerHTML, 'This field is invalid');
      });

      it('should not display any errors for a valid field', function () {
        var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');

        input.value = 'valid';

        _reactAddonsTestUtils2.default.Simulate.change(input);

        var errors = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span');

        _chai.assert.lengthOf(errors, 0);
      });
    });

    describe('displaying errors from field .errors', function () {
      var store = (0, _utils.testCreateStore)({
        testForm: formReducer('test'),
        test: modelReducer('test')
      });

      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          'form',
          null,
          _react2.default.createElement(Errors, { model: 'test.foo',
            messages: {
              required: 'This field is required'
            }
          }),
          _react2.default.createElement(
            Field,
            { model: 'test.foo',
              validators: {
                required: function required(v) {
                  return v && v.length;
                }
              },
              errors: {
                valid: function valid(v) {
                  return v !== 'valid' && 'This field is invalid';
                }
              }
            },
            _react2.default.createElement('input', { type: 'text' })
          )
        )
      ));

      it('should display all errors', function () {
        var errors = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span');
        _chai.assert.lengthOf(errors, 2);
        _chai.assert.equal(errors[0].innerHTML, 'This field is required');
        _chai.assert.equal(errors[1].innerHTML, 'This field is invalid');
      });
    });

    describe('displaying errors from form .errors', function () {
      var initialState = getInitialState({ foo: '' });
      var store = (0, _utils.testCreateStore)({
        testForm: formReducer('test', initialState),
        test: modelReducer('test', initialState)
      });

      var formValid = false;

      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Form,
          { model: 'test',
            validators: {
              '': { foo: function foo(model) {
                  return get(model, 'foo') && get(model, 'foo').length;
                } }
            }
          },
          _react2.default.createElement(Errors, { model: 'test',
            messages: {
              foo: 'This form is invalid'
            }
          }),
          _react2.default.createElement(
            Field,
            { model: 'test.foo' },
            _react2.default.createElement('input', { type: 'text' })
          )
        )
      ));

      var errors = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span');
      var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');

      it('should display all form errors', function () {
        var errors = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span');
        _chai.assert.lengthOf(errors, 1);
        _chai.assert.equal(errors[0].innerHTML, 'This form is invalid');
      });

      it('should not display form errors if form is valid', function () {
        input.value = 'testing';

        _reactAddonsTestUtils2.default.Simulate.change(input);

        var errors = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span');
        _chai.assert.lengthOf(errors, 0);
      });
    });

    describe('displaying no errors', function () {
      var initialState = getInitialState({ foo: '' });
      var store = (0, _utils.testCreateStore)({
        testForm: formReducer('test', initialState),
        test: modelReducer('test', initialState)
      });

      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Errors, { model: 'test' })
      ));

      it('should not render a component if there are no errors', function () {
        var divs = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'div');
        _chai.assert.lengthOf(divs, 0);
      });
    });

    describe('displaying custom messages', function () {
      var initialState = getInitialState({ foo: '' });
      var store = (0, _utils.testCreateStore)({
        testForm: formReducer('test', initialState),
        test: modelReducer('test', initialState)
      });

      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          'form',
          null,
          _react2.default.createElement(Errors, { model: 'test.foo',
            messages: {
              length: function length(val) {
                return (val && val.length) + ' chars is too short';
              },
              doNotShow: function doNotShow() {
                return false;
              }
            }
          }),
          _react2.default.createElement(
            Field,
            { model: 'test.foo',
              validators: {
                length: function length(v) {
                  return v && v.length && v.length > 5 ? { length: 5 } : false;
                },
                doNotShow: function doNotShow() {
                  return false;
                }
              }
            },
            _react2.default.createElement('input', { type: 'text' })
          )
        )
      ));

      var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');

      it('should return messages from functions called with the model value', function () {
        input.value = 'four';

        _reactAddonsTestUtils2.default.Simulate.change(input);

        var errors = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span');

        _chai.assert.lengthOf(errors, 1);

        _chai.assert.equal(errors[0].innerHTML, '4 chars is too short');
      });

      it('should not show messages when functions return falsey values', function () {
        _reactAddonsTestUtils2.default.Simulate.change(input);

        var errors = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span');

        _chai.assert.property(store.getState().testForm.foo.errors, 'doNotShow');

        _chai.assert.isTrue(store.getState().testForm.foo.errors.doNotShow);

        _chai.assert.lengthOf(errors, 1);
      });
    });

    describe('displaying custom error messages', function () {
      var initialState = getInitialState({ foo: '' });
      var store = (0, _utils.testCreateStore)({
        testForm: formReducer('test', initialState),
        test: modelReducer('test', initialState)
      });

      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          'form',
          null,
          _react2.default.createElement(Errors, { model: 'test.foo',
            messages: {
              length: function length(val, _ref) {
                var _length = _ref.length;
                return (val && val.length) + ' chars is too short (must be at least ' + _length + ' chars)';
              },
              doNotShow: function doNotShow() {
                return false;
              }
            }
          }),
          _react2.default.createElement(
            Field,
            { model: 'test.foo',
              errors: {
                length: function length(v) {
                  return v && v.length && v.length > 5 ? false : { length: 5 };
                },
                doNotShow: function doNotShow() {
                  return false;
                }
              }
            },
            _react2.default.createElement('input', { type: 'text' })
          )
        )
      ));

      var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');

      it('should return messages from functions called with the model value', function () {
        input.value = 'four';

        _reactAddonsTestUtils2.default.Simulate.change(input);

        var errors = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span');

        _chai.assert.lengthOf(errors, 1);

        _chai.assert.equal(errors[0].innerHTML, '4 chars is too short (must be at least 5 chars)');
      });
    });

    describe('the "show" prop', function () {
      function renderErrorsWithShow(show) {
        var store = (0, _utils.testCreateStore)({
          testForm: formReducer('test', object),
          test: modelReducer('test')
        });

        return _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            'form',
            null,
            _react2.default.createElement(Errors, { model: 'test.foo',
              messages: {
                required: 'This field is required'
              },
              show: show
            }),
            _react2.default.createElement(
              Field,
              { model: 'test.foo',
                validators: {
                  required: function required(v) {
                    return v && v.length;
                  }
                },
                component: 'section'
              },
              _react2.default.createElement('input', { type: 'text' })
            )
          )
        ));
      }

      it('should support a function that shows based on field value', function () {
        var showFn = function showFn(field) {
          return field.focus;
        };

        var form = renderErrorsWithShow(showFn);
        var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');

        _chai.assert.lengthOf(_reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span'), 0);

        _reactAddonsTestUtils2.default.Simulate.focus(input);

        _chai.assert.lengthOf(_reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span'), 1);

        _reactAddonsTestUtils2.default.Simulate.blur(input);

        _chai.assert.lengthOf(_reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span'), 0);
      });

      it('should support a function that shows based on field and form value', function () {
        var store = (0, _utils.testCreateStore)({
          testForm: formReducer('test', object),
          test: modelReducer('test')
        });

        var showFn = function showFn(field, form) {
          return field.focus || form.submitFailed;
        };

        var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            'form',
            null,
            _react2.default.createElement(Errors, { model: 'test.foo',
              messages: {
                required: 'This field is required'
              },
              show: showFn
            }),
            _react2.default.createElement(
              Field,
              { model: 'test.foo',
                validators: {
                  required: function required(v) {
                    return v && v.length;
                  }
                },
                component: 'section'
              },
              _react2.default.createElement('input', { type: 'text' })
            )
          )
        ));

        var formElement = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'form');
        var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');

        _chai.assert.lengthOf(_reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span'), 0);

        _reactAddonsTestUtils2.default.Simulate.focus(input);

        _chai.assert.lengthOf(_reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span'), 1);

        _reactAddonsTestUtils2.default.Simulate.blur(input);

        _chai.assert.lengthOf(_reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span'), 0);

        store.dispatch(actions.setSubmitFailed('test'));

        _chai.assert.lengthOf(_reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span'), 1, 'form submit failed');
      });

      it('should support a boolean and show if truthy', function () {
        var form = renderErrorsWithShow(true);
        var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');

        _chai.assert.lengthOf(_reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span'), 1);
      });

      it('should support a boolean and not show if falsey', function () {
        var form = renderErrorsWithShow(false);
        var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');

        _chai.assert.lengthOf(_reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span'), 0);

        _chai.assert.lengthOf(_reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'div'), 0);
      });

      it('should support a string and show if that field property is truthy', function () {
        var form = renderErrorsWithShow('focus');
        var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');

        _chai.assert.lengthOf(_reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span'), 0);

        _reactAddonsTestUtils2.default.Simulate.focus(input);

        _chai.assert.lengthOf(_reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span'), 1);

        _reactAddonsTestUtils2.default.Simulate.blur(input);

        _chai.assert.lengthOf(_reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span'), 0);
      });

      it('should support an object and show if the properties match', function () {
        var form = renderErrorsWithShow({
          focus: true,
          touched: true
        });

        var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');

        _chai.assert.lengthOf(_reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span'), 0, 'not focused yet');

        _reactAddonsTestUtils2.default.Simulate.focus(input);

        _chai.assert.lengthOf(_reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span'), 0, 'not touched yet');

        _reactAddonsTestUtils2.default.Simulate.blur(input);

        _chai.assert.lengthOf(_reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span'), 0, 'touched but not focused');

        _reactAddonsTestUtils2.default.Simulate.focus(input);

        _chai.assert.lengthOf(_reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span'), 1, 'touched and focused');

        _reactAddonsTestUtils2.default.Simulate.blur(input);

        _chai.assert.lengthOf(_reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span'), 0, 'touched but not focused');
      });
    });

    describe('the "wrapper" prop', function () {
      function renderErrorsWithWrapper(wrapper, props) {
        var store = (0, _utils.testCreateStore)({
          testForm: formReducer('test', object),
          test: modelReducer('test')
        });

        return _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            'form',
            null,
            _react2.default.createElement(Errors, _extends({ model: 'test.foo',
              wrapper: wrapper,
              messages: {
                foo: 'foo error',
                bar: 'bar error'
              }
            }, props)),
            _react2.default.createElement(
              Field,
              { model: 'test.foo',
                validators: {
                  foo: function foo() {
                    return false;
                  },
                  bar: function bar() {
                    return false;
                  }
                },
                component: 'main'
              },
              _react2.default.createElement('input', { type: 'text' })
            )
          )
        ));
      }

      it('should render a <div> wrapper by default', function () {
        var form = renderErrorsWithWrapper();

        var wrapper = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'div');

        _chai.assert.lengthOf(wrapper, 1);

        _chai.assert.equal(wrapper[0].childNodes.length, 2);
      });

      it('should render a specified HTML element wrapper', function () {
        var form = renderErrorsWithWrapper('section');

        var wrapper = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'section');

        _chai.assert.lengthOf(wrapper, 1);

        _chai.assert.equal(wrapper[0].childNodes.length, 2);
      });

      it('should render a specified React component (class)', function () {
        var Wrapper = function (_React$Component) {
          _inherits(Wrapper, _React$Component);

          function Wrapper() {
            _classCallCheck(this, Wrapper);

            return _possibleConstructorReturn(this, (Wrapper.__proto__ || Object.getPrototypeOf(Wrapper)).apply(this, arguments));
          }

          _createClass(Wrapper, [{
            key: 'render',
            value: function render() {
              return _react2.default.createElement(
                'main',
                { className: 'wrapper' },
                this.props.children
              );
            }
          }]);

          return Wrapper;
        }(_react2.default.Component);

        var form = renderErrorsWithWrapper(Wrapper);

        var wrapper = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithClass(form, 'wrapper');

        _chai.assert.lengthOf(wrapper, 1);

        _chai.assert.equal(wrapper[0].childNodes.length, 2);
      });

      it('should render a specified React component (function) with error props', function () {
        function Wrapper(props) {
          _chai.assert.property(props, 'model');
          _chai.assert.property(props, 'modelValue');
          _chai.assert.property(props, 'fieldValue');
          _chai.assert.property(props, 'messages');
          _chai.assert.property(props, 'show');
          _chai.assert.property(props, 'component');

          _chai.assert.equal(props.model, 'test.foo');

          return _react2.default.createElement(
            'div',
            { className: 'wrapper' },
            props.children
          );
        }

        var form = renderErrorsWithWrapper(Wrapper);

        var wrapper = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithClass(form, 'wrapper');

        _chai.assert.lengthOf(wrapper, 1);

        _chai.assert.equal(wrapper[0].childNodes.length, 2);
      });

      it('should render a specified React component with non-proprietary props', function () {
        function Wrapper(props) {
          _chai.assert.property(props, 'className');

          return _react2.default.createElement(
            'div',
            { className: props.className },
            props.children
          );
        }

        var props = { className: 'custom-class' };

        var form = renderErrorsWithWrapper(Wrapper, props);

        var wrapper = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithClass(form, 'custom-class');

        _chai.assert.lengthOf(wrapper, 1);

        _chai.assert.equal(wrapper[0].childNodes.length, 2);
      });
    });

    describe('the "component" prop', function () {
      function renderErrorsWithComponent(component) {
        var store = (0, _utils.testCreateStore)({
          testForm: formReducer('test', object),
          test: modelReducer('test')
        });

        return _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            'form',
            null,
            _react2.default.createElement(Errors, { model: 'test.foo',
              component: component,
              messages: {
                foo: 'foo error',
                bar: 'bar error'
              }
            }),
            _react2.default.createElement(
              Field,
              { model: 'test.foo',
                validators: {
                  foo: function foo() {
                    return false;
                  },
                  bar: function bar() {
                    return false;
                  }
                }
              },
              _react2.default.createElement('input', { type: 'text' })
            )
          )
        ));
      }

      it('should render a <span> component by default', function () {
        var form = renderErrorsWithComponent();

        var components = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span');

        _chai.assert.lengthOf(components, 2);

        _chai.assert.equal(components[0].innerHTML, 'foo error');
        _chai.assert.equal(components[1].innerHTML, 'bar error');
      });

      it('should render a specified HTML element component', function () {
        var form = renderErrorsWithComponent('p');

        var components = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'p');

        _chai.assert.lengthOf(components, 2);

        _chai.assert.equal(components[0].innerHTML, 'foo error');
        _chai.assert.equal(components[1].innerHTML, 'bar error');
      });

      it('should render a specified React component (class)', function () {
        var ErrorComponent = function (_React$Component2) {
          _inherits(ErrorComponent, _React$Component2);

          function ErrorComponent() {
            _classCallCheck(this, ErrorComponent);

            return _possibleConstructorReturn(this, (ErrorComponent.__proto__ || Object.getPrototypeOf(ErrorComponent)).apply(this, arguments));
          }

          _createClass(ErrorComponent, [{
            key: 'render',
            value: function render() {
              return _react2.default.createElement(
                'main',
                { className: 'component' },
                this.props.children
              );
            }
          }]);

          return ErrorComponent;
        }(_react2.default.Component);

        var form = renderErrorsWithComponent(ErrorComponent);

        var components = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithClass(form, 'component');

        _chai.assert.lengthOf(components, 2);

        _chai.assert.equal(components[0].innerHTML, 'foo error');
        _chai.assert.equal(components[1].innerHTML, 'bar error');
      });

      it('should render a specified React component (function) with error props', function () {
        function ErrorComponent(props) {
          _chai.assert.property(props, 'model');
          _chai.assert.property(props, 'modelValue');
          _chai.assert.property(props, 'fieldValue');

          _chai.assert.equal(props.model, 'test.foo');

          return _react2.default.createElement(
            'div',
            { className: 'component' },
            props.children
          );
        }

        var form = renderErrorsWithComponent(ErrorComponent);

        var components = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithClass(form, 'component');

        _chai.assert.lengthOf(components, 2);

        _chai.assert.equal(components[0].innerHTML, 'foo error');
        _chai.assert.equal(components[1].innerHTML, 'bar error');
      });
    });

    describe('deep model paths', function () {
      it('should work with deep model paths', function () {
        var store = (0, _utils.testCreateStore)({
          forms: (0, _redux.combineReducers)({
            testForm: formReducer('forms.test', object),
            test: modelReducer('forms.test')
          })
        });

        var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            'form',
            null,
            _react2.default.createElement(Errors, { model: 'forms.test.foo',
              messages: {
                required: 'This field is required'
              }
            }),
            _react2.default.createElement(
              Field,
              { model: 'forms.test.foo',
                validators: {
                  required: function required(v) {
                    return v && v.length;
                  }
                }
              },
              _react2.default.createElement('input', { type: 'text' })
            )
          )
        ));

        var spans = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span');
        _chai.assert.lengthOf(spans, 1);
        _chai.assert.equal(spans[0].innerHTML, 'This field is required');
      });
    });

    describe('single string error messages', function () {
      it('should work with single string error messages', function () {
        var store = (0, _utils.testCreateStore)({
          testForm: formReducer('test', object),
          test: modelReducer('test')
        });

        var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(Errors, { model: 'test', messages: {
              foo: 'foo',
              bar: 'bar'
            } })
        ));

        store.dispatch(actions.setErrors('test', 'this is a single error message'));

        var error = void 0;

        _chai.assert.doesNotThrow(function () {
          return error = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'span');
        });

        _chai.assert.equal(error.innerHTML, 'this is a single error message');
      });
    });
  });
});