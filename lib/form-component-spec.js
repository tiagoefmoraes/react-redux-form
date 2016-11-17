'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint react/no-multi-comp:0 react/jsx-no-bind:0 */


var _chai = require('chai');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reduxTestStore = require('redux-test-store');

var _reduxTestStore2 = _interopRequireDefault(_reduxTestStore);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _isValid = require('../src/form/is-valid');

var _isValid2 = _interopRequireDefault(_isValid);

var _utils = require('./utils');

var _src = require('../src');

var _immutable = require('../immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var testContexts = {
  standard: _extends({}, _utils.defaultTestContexts.standard, {
    Form: _src.Form,
    modelReducer: _src.modelReducer,
    formReducer: _src.formReducer,
    Field: _src.Field,
    Control: _src.Control,
    actions: _src.actions
  }),
  immutable: _extends({}, _utils.defaultTestContexts.immutable, {
    Form: _immutable.Form,
    modelReducer: _immutable.modelReducer,
    formReducer: _immutable.formReducer,
    Field: _immutable.Field,
    Control: _immutable.Control,
    actions: _immutable.actions
  })
};

Object.keys(testContexts).forEach(function (testKey) {
  var testContext = testContexts[testKey];
  var Form = testContext.Form;
  var modelReducer = testContext.modelReducer;
  var formReducer = testContext.formReducer;
  var Field = testContext.Field;
  var Control = testContext.Control;
  var actions = testContext.actions;
  var object = testContext.object;
  var get = testContext.get;
  var getInitialState = testContext.getInitialState;

  describe('<Form> component (' + testKey + ' context)', function () {
    describe('wraps component if specified', function () {
      var store = (0, _utils.testCreateStore)({
        testForm: formReducer('test', object),
        test: modelReducer('test')
      });

      it('should wrap children with specified component (string)', function () {
        var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(Form, { model: 'test', component: 'section' })
        ));

        var wrapper = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'section');

        _chai.assert.ok(wrapper);
      });

      it('should wrap children with specified component (class)', function () {
        var Wrapper = function (_React$Component) {
          _inherits(Wrapper, _React$Component);

          function Wrapper() {
            _classCallCheck(this, Wrapper);

            return _possibleConstructorReturn(this, (Wrapper.__proto__ || Object.getPrototypeOf(Wrapper)).apply(this, arguments));
          }

          _createClass(Wrapper, [{
            key: 'render',
            value: function render() {
              var _props = this.props,
                  children = _props.children,
                  other = _objectWithoutProperties(_props, ['children']);

              return _react2.default.createElement(
                'form',
                _extends({ className: 'wrapper' }, other),
                children
              );
            }
          }]);

          return Wrapper;
        }(_react2.default.Component);

        process.env.NODE_ENV !== "production" ? Wrapper.propTypes = {
          children: _react2.default.PropTypes.object
        } : void 0;
        var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(Form, { model: 'test', component: Wrapper })
        ));

        var wrapper = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithClass(form, 'wrapper');

        _chai.assert.ok(wrapper);
      });
      it('Renders as <form> by default', function () {
        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(Form, { model: 'test' })
        ));

        var wrapper = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'form');

        _chai.assert.ok(wrapper);
      });
    });

    describe('validation on submit', function () {
      function fixture() {
        var initialState = getInitialState({ foo: '', bar: '' });
        var store = (0, _utils.testCreateStore)({
          testForm: formReducer('test', initialState),
          test: modelReducer('test', initialState)
        });

        var timesValidated = 0;

        function getTimesValidated() {
          return timesValidated;
        }

        var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Form,
            {
              model: 'test',
              validators: {
                foo: function foo(val) {
                  timesValidated += 1;
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
              },
              validateOn: 'submit'
            },
            _react2.default.createElement(
              Field,
              { model: 'test.foo' },
              _react2.default.createElement('input', { type: 'text' })
            ),
            _react2.default.createElement(
              Field,
              { model: 'test.bar' },
              _react2.default.createElement('input', { type: 'text' })
            )
          )
        ));

        var formElement = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'form');

        var _TestUtils$scryRender = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'input'),
            _TestUtils$scryRender2 = _slicedToArray(_TestUtils$scryRender, 2),
            fooControl = _TestUtils$scryRender2[0],
            barControl = _TestUtils$scryRender2[1];

        return {
          store: store,
          form: form,
          formElement: formElement,
          fooControl: fooControl,
          barControl: barControl,
          timesValidated: getTimesValidated
        };
      }

      it('should not validate before submit', function () {
        var _fixture = fixture(),
            timesValidated = _fixture.timesValidated;

        _chai.assert.equal(timesValidated(), 0);
      });

      it('should not validate on change', function () {
        var _fixture2 = fixture(),
            fooControl = _fixture2.fooControl,
            timesValidated = _fixture2.timesValidated;

        _reactAddonsTestUtils2.default.Simulate.change(fooControl);

        _chai.assert.equal(timesValidated(), 0);
      });

      it('should validate all validators on submit', function () {
        var _fixture3 = fixture(),
            formElement = _fixture3.formElement,
            store = _fixture3.store,
            timesValidated = _fixture3.timesValidated,
            fooControl = _fixture3.fooControl;

        _chai.assert.equal(timesValidated(), 0);

        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.equal(timesValidated(), 1);

        _chai.assert.isFalse(store.getState().testForm.foo.valid);

        fooControl.value = 'testing foo';

        _reactAddonsTestUtils2.default.Simulate.change(fooControl);

        _chai.assert.equal(get(store.getState().test, 'foo'), 'testing foo');

        _chai.assert.equal(timesValidated(), 1, 'should not have validated again before submit');

        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.equal(timesValidated(), 2);

        _chai.assert.isTrue(store.getState().testForm.foo.valid);
      });

      it('should allow for keywise validation', function () {
        var _fixture4 = fixture(),
            formElement = _fixture4.formElement,
            store = _fixture4.store,
            barControl = _fixture4.barControl;

        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.containSubset(store.getState().testForm.bar, {
          errors: { one: true, two: true }
        });

        _chai.assert.isFalse(store.getState().testForm.bar.valid);

        barControl.value = '1';
        _reactAddonsTestUtils2.default.Simulate.change(barControl);

        _chai.assert.equal(get(store.getState().test, 'bar'), '1');

        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.containSubset(store.getState().testForm.bar, {
          errors: { one: false, two: true }
        });

        _chai.assert.isFalse(store.getState().testForm.bar.valid);

        barControl.value = '12';
        _reactAddonsTestUtils2.default.Simulate.change(barControl);

        _chai.assert.equal(get(store.getState().test, 'bar'), '12');

        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.containSubset(store.getState().testForm.bar, {
          errors: { one: false, two: false }
        });

        _chai.assert.isTrue(store.getState().testForm.bar.valid);
      });
    });

    describe('error validation on submit', function () {
      var initialState = getInitialState({
        foo: '',
        bar: ''
      });
      var store = (0, _utils.testCreateStore)({
        testForm: formReducer('test'),
        test: modelReducer('test', initialState)
      });

      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Form,
          {
            model: 'test',
            errors: {
              foo: function foo(val) {
                return val !== 'valid foo' && 'invalid foo';
              },
              bar: {
                one: function one(val) {
                  return val.length < 1 && 'bar too short';
                },
                two: function two(val) {
                  return val.length > 2 && 'bar too long';
                }
              }
            }
          },
          _react2.default.createElement(
            Field,
            { model: 'test.foo' },
            _react2.default.createElement('input', { type: 'text' })
          ),
          _react2.default.createElement(
            Field,
            { model: 'test.bar' },
            _react2.default.createElement('input', { type: 'text' })
          )
        )
      ));

      var formElement = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'form');

      var _TestUtils$scryRender3 = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'input'),
          _TestUtils$scryRender4 = _slicedToArray(_TestUtils$scryRender3, 2),
          fooControl = _TestUtils$scryRender4[0],
          barControl = _TestUtils$scryRender4[1];

      it('should validate all validators on submit', function () {
        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.containSubset(store.getState().testForm.foo, {
          errors: 'invalid foo'
        });

        _chai.assert.isFalse(store.getState().testForm.foo.valid);

        fooControl.value = 'valid foo';

        _reactAddonsTestUtils2.default.Simulate.change(fooControl);

        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.containSubset(store.getState().testForm.foo, {
          errors: false
        });

        _chai.assert.isTrue(store.getState().testForm.foo.valid);
      });

      it('should allow for keywise validation', function () {
        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.containSubset(store.getState().testForm.bar, {
          errors: {
            one: 'bar too short',
            two: false
          }
        });

        _chai.assert.isFalse(store.getState().testForm.bar.valid);

        barControl.value = '1';
        _reactAddonsTestUtils2.default.Simulate.change(barControl);
        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.containSubset(store.getState().testForm.bar, {
          errors: {
            one: false,
            two: false
          }
        });

        _chai.assert.isTrue(store.getState().testForm.bar.valid);

        barControl.value = '12';
        _reactAddonsTestUtils2.default.Simulate.change(barControl);
        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.containSubset(store.getState().testForm.bar, {
          errors: {
            one: false,
            two: false
          }
        });

        _chai.assert.isTrue(store.getState().testForm.bar.valid);

        barControl.value = '123';
        _reactAddonsTestUtils2.default.Simulate.change(barControl);
        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.containSubset(store.getState().testForm.bar, {
          errors: {
            one: false,
            two: 'bar too long'
          }
        });

        _chai.assert.isFalse(store.getState().testForm.bar.valid);
      });
    });

    describe('submit validation with blur update fields', function () {
      var initialState = getInitialState({
        foo: '',
        bar: ''
      });
      var store = (0, _utils.testCreateStore)({
        testForm: formReducer('test', initialState),
        test: modelReducer('test', initialState)
      });

      var required = function required(v) {
        return !!(v && v.length);
      };

      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Form,
          {
            model: 'test',
            validators: {
              foo: required,
              bar: required
            },
            validateOn: 'submit'
          },
          _react2.default.createElement(
            Field,
            { model: 'test.foo', updateOn: 'blur' },
            _react2.default.createElement('input', { type: 'text' })
          ),
          _react2.default.createElement(
            Field,
            { model: 'test.bar', updateOn: 'blur' },
            _react2.default.createElement('input', { type: 'text' })
          )
        )
      ));

      var inputs = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'input');
      var formNode = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'form');

      it('fields should not be validated initially', function () {
        _chai.assert.ok(store.getState().testForm.foo.valid);
        _chai.assert.ok(store.getState().testForm.bar.valid);
      });

      it('fields should not be validated after change', function () {
        _reactAddonsTestUtils2.default.Simulate.change(inputs[0]);
        _reactAddonsTestUtils2.default.Simulate.change(inputs[1]);

        _chai.assert.ok(store.getState().testForm.foo.valid);
        _chai.assert.ok(store.getState().testForm.bar.valid);
      });

      it('fields should be validated after submit', function () {
        _reactAddonsTestUtils2.default.Simulate.submit(formNode);

        _chai.assert.isFalse(store.getState().testForm.foo.valid);
        _chai.assert.isFalse(store.getState().testForm.bar.valid);
      });

      it('fields should be validated with current values after submit', function () {
        _reactAddonsTestUtils2.default.Simulate.submit(formNode);

        // Not valid yet
        _chai.assert.isFalse(store.getState().testForm.foo.valid);
        _chai.assert.isFalse(store.getState().testForm.bar.valid);

        inputs[0].value = 'first';
        inputs[1].value = 'second';

        _reactAddonsTestUtils2.default.Simulate.change(inputs[0]);
        _reactAddonsTestUtils2.default.Simulate.change(inputs[1]);

        _reactAddonsTestUtils2.default.Simulate.submit(formNode);

        // Still not valid yet
        _chai.assert.isFalse(store.getState().testForm.foo.valid);
        _chai.assert.isFalse(store.getState().testForm.bar.valid);

        // Change model
        _reactAddonsTestUtils2.default.Simulate.blur(inputs[0]);
        _reactAddonsTestUtils2.default.Simulate.blur(inputs[1]);

        _reactAddonsTestUtils2.default.Simulate.submit(formNode);

        // Should be valid
        _chai.assert.ok(store.getState().testForm.foo.valid);
        _chai.assert.ok(store.getState().testForm.bar.valid);
      });
    });

    describe('error validation from silent changes on submit', function () {
      var initialState = getInitialState({
        foo: 'valid foo',
        bar: ''
      });
      var store = (0, _utils.testCreateStore)({
        testForm: formReducer('test'),
        test: modelReducer('test', initialState)
      });

      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Form,
          {
            model: 'test',
            errors: {
              foo: function foo(val) {
                return val !== 'valid foo' && 'invalid foo';
              },
              bar: {
                one: function one(val) {
                  return val.length < 1 && 'bar too short';
                },
                two: function two(val) {
                  return val.length > 2 && 'bar too long';
                }
              }
            }
          },
          _react2.default.createElement(
            Field,
            { model: 'test.foo' },
            _react2.default.createElement('input', { type: 'text' })
          ),
          _react2.default.createElement(
            Field,
            { model: 'test.bar' },
            _react2.default.createElement('input', { type: 'text' })
          )
        )
      ));

      var formElement = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'form');

      it('should show correct initial error messages', function () {
        _chai.assert.deepEqual(store.getState().testForm.bar.errors, {
          one: 'bar too short',
          two: false
        });
      });

      it('should validate errors upon submit after silent changes', function () {
        store.dispatch(actions.load('test.foo', 'nope'));

        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.equal(store.getState().testForm.foo.errors, 'invalid foo');
      });
    });

    describe('validation on change (default)', function () {
      var initialState = getInitialState({
        foo: '',
        bar: ''
      });
      var store = (0, _utils.testCreateStore)({
        testForm: formReducer('test'),
        test: modelReducer('test', initialState)
      });

      var timesBarValidationCalled = 0;

      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Form,
          {
            model: 'test',
            validators: {
              foo: function foo(val) {
                return val && val === 'testing foo';
              },
              bar: {
                one: function one(val) {
                  return val && val.length >= 1;
                },
                two: function two(val) {
                  return val && val.length >= 2;
                },
                called: function called() {
                  timesBarValidationCalled += 1;
                  return true;
                }
              }
            }
          },
          _react2.default.createElement(
            Field,
            { model: 'test.foo' },
            _react2.default.createElement('input', { type: 'text' })
          ),
          _react2.default.createElement(
            Field,
            { model: 'test.bar' },
            _react2.default.createElement('input', { type: 'text' })
          )
        )
      ));

      var _TestUtils$scryRender5 = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'input'),
          _TestUtils$scryRender6 = _slicedToArray(_TestUtils$scryRender5, 1),
          fooControl = _TestUtils$scryRender6[0];

      it('should validate form validators initially on load', function () {
        _chai.assert.equal(timesBarValidationCalled, 1);
      });

      it('should validate form validators on field change', function () {
        fooControl.value = 'invalid';

        _reactAddonsTestUtils2.default.Simulate.change(fooControl);

        _chai.assert.containSubset(store.getState().testForm.foo, {
          errors: true
        });

        _chai.assert.isFalse(store.getState().testForm.foo.valid);

        fooControl.value = 'testing foo';

        _reactAddonsTestUtils2.default.Simulate.change(fooControl);

        _chai.assert.containSubset(store.getState().testForm.foo, {
          errors: false
        });

        _chai.assert.isTrue(store.getState().testForm.foo.valid);
      });

      it('should NOT run validation for fields that have not changed', function () {
        fooControl.value = 'invalid';

        _reactAddonsTestUtils2.default.Simulate.change(fooControl);

        _chai.assert.equal(timesBarValidationCalled, 1);
      });
    });

    describe('error validation on change', function () {
      var initialState = getInitialState({
        foo: '',
        bar: ''
      });
      var store = (0, _utils.testCreateStore)({
        testForm: formReducer('test'),
        test: modelReducer('test', initialState)
      });

      var timesBarValidationCalled = 0;

      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Form,
          {
            model: 'test',
            errors: {
              foo: function foo(val) {
                return val !== 'valid foo' && 'invalid foo';
              },
              bar: function bar() {
                timesBarValidationCalled += 1;
                return 'bar validated';
              }
            },
            validateOn: 'change'
          },
          _react2.default.createElement(
            Field,
            { model: 'test.foo' },
            _react2.default.createElement('input', { type: 'text' })
          ),
          _react2.default.createElement(
            Field,
            { model: 'test.bar' },
            _react2.default.createElement('input', { type: 'text' })
          )
        )
      ));

      var _TestUtils$scryRender7 = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'input'),
          _TestUtils$scryRender8 = _slicedToArray(_TestUtils$scryRender7, 1),
          fooControl = _TestUtils$scryRender8[0];

      it('should validate form validators initially on load', function () {
        _chai.assert.equal(timesBarValidationCalled, 1);
      });

      it('should validate form error validators on field change', function () {
        fooControl.value = 'invalid';

        _reactAddonsTestUtils2.default.Simulate.change(fooControl);

        _chai.assert.containSubset(store.getState().testForm.foo, {
          errors: 'invalid foo'
        });

        _chai.assert.isFalse(store.getState().testForm.foo.valid);

        fooControl.value = 'valid foo';

        _reactAddonsTestUtils2.default.Simulate.change(fooControl);

        _chai.assert.containSubset(store.getState().testForm.foo, {
          errors: false
        });

        _chai.assert.isTrue(store.getState().testForm.foo.valid);
      });

      it('should NOT run validation for fields that have not changed', function () {
        fooControl.value = 'testing';

        _reactAddonsTestUtils2.default.Simulate.change(fooControl);

        _chai.assert.equal(timesBarValidationCalled, 1);
      });
    });

    describe('maintaining field validation state', function () {
      var initialState = getInitialState({
        foo: '',
        bar: ''
      });

      var required = function required(val) {
        return val && val.length;
      };

      var store = (0, _utils.testCreateStore)({
        testForm: formReducer('test', initialState),
        test: modelReducer('test', initialState)
      });

      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Form,
          {
            model: 'test',
            validators: {
              foo: required,
              bar: required
            },
            validateOn: 'change'
          },
          _react2.default.createElement(
            Field,
            { model: 'test.foo' },
            _react2.default.createElement('input', { type: 'text' })
          ),
          _react2.default.createElement(
            Field,
            { model: 'test.bar' },
            _react2.default.createElement('input', { type: 'text' })
          )
        )
      ));

      var _TestUtils$scryRender9 = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'input'),
          _TestUtils$scryRender10 = _slicedToArray(_TestUtils$scryRender9, 2),
          fooControl = _TestUtils$scryRender10[0],
          barControl = _TestUtils$scryRender10[1];

      it('should initially be invalid', function () {
        _chai.assert.isFalse(store.getState().testForm.$form.valid);
      });

      it('should still be invalid if fields are still invalid', function () {
        fooControl.value = 'valid';
        _reactAddonsTestUtils2.default.Simulate.change(fooControl);

        _chai.assert.isTrue(store.getState().testForm.foo.valid, 'foo should be valid');
        _chai.assert.isFalse(store.getState().testForm.bar.valid, 'bar should be invalid');

        _chai.assert.isFalse(store.getState().testForm.$form.valid, 'form should be invalid');
      });

      it('should be valid once all fields are valid', function () {
        fooControl.value = 'valid';
        _reactAddonsTestUtils2.default.Simulate.change(fooControl);
        barControl.value = 'valid';
        _reactAddonsTestUtils2.default.Simulate.change(barControl);

        _chai.assert.isTrue(store.getState().testForm.foo.valid, 'foo should be valid');
        _chai.assert.isTrue(store.getState().testForm.bar.valid, 'bar should be valid');

        _chai.assert.isTrue(store.getState().testForm.$form.valid, 'form should be valid');
      });
    });

    describe('onSubmit() prop', function () {
      var initialState = getInitialState({
        foo: '',
        bar: '',
        baz: ''
      });
      var store = (0, _utils.testCreateStore)({
        testForm: formReducer('test'),
        test: modelReducer('test', initialState)
      });

      var submitValue = null;

      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Form,
          {
            model: 'test',
            validators: {
              foo: function foo(val) {
                return val && val === 'valid';
              },
              baz: {
                validationKey: function validationKey(val) {
                  return val && val === 'valid';
                }
              }
            },
            errors: {
              bar: function bar(val) {
                return val !== 'bar' && 'bar invalid';
              }
            },
            onSubmit: function onSubmit(val) {
              submitValue = val;
              return true;
            }
          },
          _react2.default.createElement(
            Field,
            { model: 'test.foo' },
            _react2.default.createElement('input', { type: 'text' })
          ),
          _react2.default.createElement(
            Field,
            { model: 'test.bar' },
            _react2.default.createElement('input', { type: 'text' })
          ),
          _react2.default.createElement(
            Field,
            { model: 'test.baz' },
            _react2.default.createElement('input', { type: 'text' })
          )
        )
      ));

      var formElement = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'form');

      var _TestUtils$scryRender11 = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'input'),
          _TestUtils$scryRender12 = _slicedToArray(_TestUtils$scryRender11, 3),
          fooControl = _TestUtils$scryRender12[0],
          barControl = _TestUtils$scryRender12[1],
          bazControl = _TestUtils$scryRender12[2];

      it('should NOT call onSubmit if form is invalid', function () {
        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.isNull(submitValue);

        fooControl.value = 'valid';

        _reactAddonsTestUtils2.default.Simulate.change(fooControl);

        _chai.assert.isTrue(store.getState().testForm.foo.valid);

        _chai.assert.isNull(submitValue);
      });

      it('should set submitFailed to true if form is invalid and submitted', function () {
        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.isTrue(store.getState().testForm.$form.submitFailed);
      });

      it('should call onSubmit with model value if form is valid', function () {
        barControl.value = 'bar';

        _reactAddonsTestUtils2.default.Simulate.change(barControl);

        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.isNull(submitValue, 'should not be valid yet because baz is still invalid');

        bazControl.value = 'valid';

        _reactAddonsTestUtils2.default.Simulate.change(bazControl);

        _chai.assert.deepEqual(get(store.getState().test), {
          foo: 'valid',
          bar: 'bar',
          baz: 'valid'
        });

        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.deepEqual(get(submitValue), {
          bar: 'bar',
          baz: 'valid',
          foo: 'valid'
        });
      });
    });

    describe('onSubmit() mixing form and field validation', function () {
      it('should NOT call onSubmit if any form subfield is invalid', function () {
        var initialState = getInitialState({
          foo: ''
        });
        var store = (0, _utils.testCreateStore)({
          testForm: formReducer('test'),
          test: modelReducer('test', initialState)
        });

        var submitValue = null;

        var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Form,
            {
              model: 'test',
              validators: {
                '': function _() {
                  return true;
                }
              },
              onSubmit: function onSubmit(val) {
                submitValue = val;
                return true;
              }
            },
            _react2.default.createElement(
              Field,
              {
                model: 'test.foo',
                validators: { fieldLevel: function fieldLevel() {
                    return false;
                  } }
              },
              _react2.default.createElement('input', { type: 'text' })
            )
          )
        ));

        var formElement = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'form');

        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.isNull(submitValue);

        _chai.assert.isFalse(store.getState().testForm.$form.submitted);
      });
    });

    describe('validation of form itself', function () {
      var initialState = getInitialState({
        foo: '',
        bar: ''
      });
      var store = (0, _utils.testCreateStore)({
        testForm: formReducer('test'),
        test: modelReducer('test', initialState)
      });

      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Form,
          {
            model: 'test',
            validators: {
              '': {
                foobar: function foobar(val) {
                  return get(val, 'foo') + get(val, 'bar') === 'foobar';
                }
              }
            },
            errors: {
              '': {
                formError: function formError(val) {
                  return get(val, 'foo') === 'error' && 'form error';
                }
              }
            }
          },
          _react2.default.createElement(
            Field,
            { model: 'test.foo' },
            _react2.default.createElement('input', { type: 'text' })
          ),
          _react2.default.createElement(
            Field,
            { model: 'test.bar' },
            _react2.default.createElement('input', { type: 'text' })
          )
        )
      ));

      var formElement = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'form');

      var _TestUtils$scryRender13 = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'input'),
          _TestUtils$scryRender14 = _slicedToArray(_TestUtils$scryRender13, 2),
          fooControl = _TestUtils$scryRender14[0],
          barControl = _TestUtils$scryRender14[1];

      it('should be able to set keyed validation to the form model', function () {
        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.isFalse(store.getState().testForm.$form.valid);

        fooControl.value = 'foo';
        _reactAddonsTestUtils2.default.Simulate.change(fooControl);

        barControl.value = 'bar';
        _reactAddonsTestUtils2.default.Simulate.change(barControl);

        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.isTrue(store.getState().testForm.$form.valid);
      });

      it('should be able to set keyed errors to the form model', function () {
        fooControl.value = 'error';

        _reactAddonsTestUtils2.default.Simulate.change(fooControl);
        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.containSubset(store.getState().testForm.$form, {
          errors: {
            foobar: true,
            formError: 'form error'
          }
        });

        _chai.assert.isFalse(store.getState().testForm.$form.valid);
      });
    });

    describe('external validators', function () {
      var initialState = getInitialState({
        foo: '',
        bar: ''
      });
      var store = (0, _utils.testCreateStore)({
        testForm: formReducer('test'),
        test: modelReducer('test', initialState)
      });

      var timesSubmitCalled = 0;

      function handleSubmit() {
        timesSubmitCalled++;
      }

      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Form,
          {
            model: 'test',
            onSubmit: handleSubmit
          },
          _react2.default.createElement(
            Field,
            {
              model: 'test.foo',
              validators: {
                required: function required(val) {
                  return val && val.length > 5;
                }
              }
            },
            _react2.default.createElement('input', { type: 'text' })
          )
        )
      ));

      var formElement = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'form');
      var inputElement = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');

      it('should initially be invalid if the form state is invalid', function () {
        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.equal(timesSubmitCalled, 0);
      });

      it('should prevent onSubmit if the form state is invalid after change', function () {
        inputElement.value = 'short';

        _reactAddonsTestUtils2.default.Simulate.change(inputElement);
        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.equal(timesSubmitCalled, 0);
      });

      it('should submit once the form state is valid after change', function () {
        inputElement.value = 'longer';

        _reactAddonsTestUtils2.default.Simulate.change(inputElement);
        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.equal(timesSubmitCalled, 1);
      });
    });

    describe('deep state path', function () {
      var initialState = getInitialState({
        foo: '',
        bar: ''
      });
      var formsReducer = (0, _redux.combineReducers)({
        testForm: formReducer('forms.test'),
        test: modelReducer('forms.test', initialState)
      });
      var store = (0, _utils.testCreateStore)({
        forms: formsReducer
      });

      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Form, {
          model: 'forms.test',
          onSubmit: function onSubmit() {}
        })
      ));

      var component = _reactAddonsTestUtils2.default.findRenderedComponentWithType(form, Form);
      var props = component.renderedElement.props;

      it('should resolve the model value', function () {
        _chai.assert.containSubset(get(props.modelValue), { foo: '', bar: '' });
      });

      it('should resolve the form value', function () {
        _chai.assert.containSubset(props.formValue.$form, { model: 'forms.test' });
        _chai.assert.ok((0, _isValid2.default)(props.formValue));
      });
    });

    describe('invalidating async validity on form change', function () {
      var initialState = getInitialState({ val: 'invalid' });
      var store = (0, _reduxTestStore2.default)((0, _utils.testCreateStore)({
        test: modelReducer('test', initialState),
        testForm: formReducer('test', initialState)
      }));

      function handleSubmit() {
        var promise = new Promise(function (resolve, reject) {
          return reject('Form is invalid');
        });

        store.dispatch(actions.submit('test', promise));
      }

      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Form,
          {
            model: 'test',
            onSubmit: handleSubmit
          },
          _react2.default.createElement(
            Field,
            { model: 'test.foo' },
            _react2.default.createElement('input', { type: 'text' })
          )
        )
      ));

      var formElement = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'form');
      var inputElement = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');

      it('should set errors from rejected submit handler on valid submit', function (done) {
        store.when(_src.actionTypes.SET_ERRORS, function (state) {
          _chai.assert.isFalse((0, _isValid2.default)(state.testForm));
          _chai.assert.equal(state.testForm.$form.errors, 'Form is invalid');
          done();
        });

        _reactAddonsTestUtils2.default.Simulate.submit(formElement);
      });

      it('should set validity on form changes after submit failed', function () {
        inputElement.value = 'valid';
        _reactAddonsTestUtils2.default.Simulate.change(inputElement);

        _chai.assert.isTrue(store.getState().testForm.$form.valid);
      });
    });

    describe('invalidating async validity on form change with form validators', function () {
      var initialState = getInitialState({ foo: 'invalid' });
      var store = (0, _reduxTestStore2.default)((0, _utils.testCreateStore)({
        test: modelReducer('test', initialState),
        testForm: formReducer('test', initialState)
      }));

      function handleSubmit() {
        store.dispatch(actions.batch('test', [actions.setSubmitFailed('test'), actions.setErrors('test', 'Form is invalid', { errors: true })]));
      }

      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Form,
          {
            model: 'test',
            validators: {
              foo: function foo(val) {
                return val && val.length;
              }
            },
            onSubmit: handleSubmit
          },
          _react2.default.createElement(
            Field,
            { model: 'test.foo' },
            _react2.default.createElement('input', { type: 'text' })
          )
        )
      ));

      var formElement = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'form');
      var inputElement = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');

      it('should set errors from rejected submit handler on valid submit', function () {
        _chai.assert.isTrue(store.getState().testForm.$form.valid);

        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.containSubset(store.getState().testForm.$form, { errors: 'Form is invalid' });
      });

      it('should set validity on form changes after submit failed', function () {
        inputElement.value = 'valid';
        _reactAddonsTestUtils2.default.Simulate.change(inputElement);

        _chai.assert.isTrue(store.getState().testForm.$form.valid);
      });
    });

    describe('submit after fields valid but form invalid', function () {
      var handleSubmit = _sinon2.default.spy(function (val) {
        return val;
      });

      var initialState = getInitialState({
        pass1: '',
        pass2: ''
      });
      var store = (0, _reduxTestStore2.default)((0, _utils.testCreateStore)({
        test: modelReducer('test', initialState),
        testForm: formReducer('test', initialState)
      }));

      var passwordsMatch = function passwordsMatch(val) {
        return get(val, 'pass1') === get(val, 'pass2');
      };
      var required = function required(val) {
        return val && val.length;
      };

      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Form,
          {
            model: 'test',
            validators: {
              '': [passwordsMatch],
              pass1: [required],
              pass2: [required]
            },
            onSubmit: handleSubmit,
            validateOn: 'submit'
          },
          _react2.default.createElement(
            Field,
            { model: 'test.pass1' },
            _react2.default.createElement('input', null)
          ),
          _react2.default.createElement(
            Field,
            { model: 'test.pass2' },
            _react2.default.createElement('input', null)
          )
        )
      ));

      var formElement = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'form');

      var _TestUtils$scryRender15 = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'input'),
          _TestUtils$scryRender16 = _slicedToArray(_TestUtils$scryRender15, 2),
          pass1 = _TestUtils$scryRender16[0],
          pass2 = _TestUtils$scryRender16[1];

      it('should fail to submit with valid fields but an invalid form', function () {
        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.isFalse(store.getState().testForm.$form.valid);
        _chai.assert.isTrue(store.getState().testForm.$form.submitFailed);

        pass1.value = 'aaa';
        pass2.value = 'bbb';

        _reactAddonsTestUtils2.default.Simulate.change(pass1);
        _reactAddonsTestUtils2.default.Simulate.change(pass2);

        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.isTrue(handleSubmit.callCount === 0);

        _chai.assert.isTrue(store.getState().testForm.$form.submitFailed);
        _chai.assert.isFalse(store.getState().testForm.$form.valid);
      });

      it('should submit with valid fields and a valid form', function () {
        pass2.value = 'aaa';

        _reactAddonsTestUtils2.default.Simulate.change(pass2);

        _reactAddonsTestUtils2.default.Simulate.submit(formElement);

        _chai.assert.isTrue(store.getState().testForm.$form.valid);

        _chai.assert.isTrue(handleSubmit.calledOnce);

        _chai.assert.isFalse(store.getState().testForm.$form.submitFailed);

        _chai.assert.ok(store.getState().testForm.$form.valid);
      });
    });

    describe('form revalidation after manual validation', function () {
      var initialState = getInitialState({ foo: 'bar' });
      var store = (0, _utils.testCreateStore)({
        login: modelReducer('login', initialState),
        loginForm: formReducer('login', initialState)
      });
      var handleSubmit = function handleSubmit(values) {
        if (get(values, 'foo') !== 'changed') {
          store.dispatch(actions.setValidity('login', {
            correctDetails: false
          }));
        }
      };
      var form = (0, _utils.testRender)(_react2.default.createElement(
        Form,
        { model: 'login', onSubmit: handleSubmit },
        _react2.default.createElement(
          Field,
          { model: 'login.foo' },
          _react2.default.createElement('input', null)
        )
      ), store);

      var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');
      var formNode = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'form');

      it('should revalidate after being set invalid', function () {
        _reactAddonsTestUtils2.default.Simulate.submit(formNode);

        _chai.assert.isFalse(store.getState().loginForm.$form.valid);

        input.value = 'changed';

        _reactAddonsTestUtils2.default.Simulate.change(input);

        _reactAddonsTestUtils2.default.Simulate.submit(formNode);

        _chai.assert.isTrue(store.getState().loginForm.$form.valid);
      });
    });

    describe('form reducer name isolation', function () {
      var store = (0, _utils.testCreateStore)({
        user: modelReducer('user'),
        userForm: formReducer('user'),
        userEx: modelReducer('userEx'),
        userExForm: formReducer('userEx')
      });

      var isRequired = function isRequired(val) {
        return val && val.length;
      };

      var UserForm = function (_React$Component2) {
        _inherits(UserForm, _React$Component2);

        function UserForm() {
          _classCallCheck(this, UserForm);

          return _possibleConstructorReturn(this, (UserForm.__proto__ || Object.getPrototypeOf(UserForm)).apply(this, arguments));
        }

        _createClass(UserForm, [{
          key: 'componentDidMount',
          value: function componentDidMount() {
            store.dispatch(actions.change('userEx', { username: '', email: '' }));
          }
        }, {
          key: 'render',
          value: function render() {
            return _react2.default.createElement(
              Form,
              {
                model: 'userEx',
                validators: {
                  username: isRequired,
                  email: isRequired
                }
              },
              _react2.default.createElement(
                Field,
                { model: 'userEx.username' },
                _react2.default.createElement('input', { type: 'text' })
              ),
              _react2.default.createElement(
                Field,
                { model: 'userEx.email' },
                _react2.default.createElement('input', { type: 'text' })
              )
            );
          }
        }]);

        return UserForm;
      }(_react2.default.Component);

      _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(UserForm, null)
      ));

      it('the similarly-named userEx form should not be valid in presence of' + 'valid user form', function () {
        _chai.assert.isFalse(store.getState().userExForm.$form.valid);
      });
    });

    describe('field validation and external changes', function () {
      var initialState = getInitialState({
        foo: '',
        bar: ''
      });
      var store = (0, _utils.testCreateStore)({
        test: modelReducer('test', initialState),
        testForm: formReducer('test', initialState)
      });

      it('should validate form on external (async) change', function () {
        var required = function required(val) {
          return val && val.length;
        };

        _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Form,
            { model: 'test' },
            _react2.default.createElement(
              Field,
              {
                model: 'test.foo',
                validators: { required: required }
              },
              _react2.default.createElement('input', { type: 'text' })
            ),
            _react2.default.createElement(
              Field,
              {
                model: 'test.bar',
                validators: { required: required }
              },
              _react2.default.createElement('input', { type: 'text' })
            )
          )
        ));

        _chai.assert.isFalse(store.getState().testForm.$form.valid);

        store.dispatch(actions.merge('test', {
          foo: 'foo valid',
          bar: 'bar valid'
        }));

        _chai.assert.isTrue(store.getState().testForm.$form.valid);
      });
    });

    xdescribe('reset event on form', function () {
      it('should reset the model on the onReset event', function () {
        var initialState = getInitialState({ foo: '' });
        var store = (0, _utils.testCreateStore)({
          test: modelReducer('test', initialState),
          testForm: formReducer('test', initialState)
        });

        var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Form,
            { model: 'test' },
            _react2.default.createElement(
              Field,
              { model: 'test.foo' },
              _react2.default.createElement('input', { type: 'text' })
            ),
            _react2.default.createElement('button', { type: 'reset' })
          )
        ));

        var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');
        var reset = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'button');

        input.value = 'changed';

        _reactAddonsTestUtils2.default.Simulate.change(input);

        _chai.assert.equal(get(store.getState().test, 'foo'), 'changed');

        _reactAddonsTestUtils2.default.Simulate.click(reset);

        _chai.assert.equal(get(store.getState().test, 'foo'), '');
      });
    });

    describe('programmatically submitting', function () {
      it('the form node should be able to be submitted with submit()', function () {
        var initialState = getInitialState({ foo: '' });
        var store = (0, _utils.testCreateStore)({
          test: modelReducer('test', initialState),
          testForm: formReducer('test', initialState)
        });

        var handleSubmit = _sinon2.default.spy(function (val) {
          return val;
        });

        var app = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Form,
            {
              model: 'test',
              onSubmit: handleSubmit
            },
            _react2.default.createElement(
              Field,
              {
                model: 'test.foo'
              },
              _react2.default.createElement('input', { type: 'text' })
            )
          )
        ));

        var form = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(app, 'form');

        form.submit();

        _chai.assert.isTrue(handleSubmit.calledOnce);
      });
    });

    it('the form node should be able to be referenced', function () {
      var initialState = getInitialState({ foo: '' });
      var store = (0, _utils.testCreateStore)({
        test: modelReducer('test', initialState),
        testForm: formReducer('test', initialState)
      });

      var handleSubmit = _sinon2.default.spy(function (val) {
        return val;
      });

      var App = function (_React$Component3) {
        _inherits(App, _React$Component3);

        function App() {
          _classCallCheck(this, App);

          return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
        }

        _createClass(App, [{
          key: 'attachNode',
          value: function attachNode(node) {
            this.node = (0, _reactDom.findDOMNode)(node);
          }
        }, {
          key: 'handleClick',
          value: function handleClick() {
            this.node.submit();
          }
        }, {
          key: 'render',
          value: function render() {
            return _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(
                Form,
                {
                  model: 'test',
                  onSubmit: handleSubmit,
                  ref: this.attachNode.bind(this)
                },
                _react2.default.createElement(
                  Field,
                  {
                    model: 'test.foo'
                  },
                  _react2.default.createElement('input', { type: 'text' })
                )
              ),
              _react2.default.createElement('button', { onClick: this.handleClick.bind(this) })
            );
          }
        }]);

        return App;
      }(_react2.default.Component);

      var app = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(App, null)
      ));

      var button = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(app, 'button');

      _reactAddonsTestUtils2.default.Simulate.click(button);

      _chai.assert.isTrue(handleSubmit.calledOnce);
    });

    describe('function as children', function () {
      var initialState = getInitialState({ foo: 'bar' });
      var store = (0, _utils.testCreateStore)({
        test: modelReducer('test', initialState),
        testForm: formReducer('test', initialState)
      });
      var form = (0, _utils.testRender)(_react2.default.createElement(
        Form,
        { model: 'test' },
        function (formValue) {
          return _react2.default.createElement(
            Field,
            { model: formValue.$form.model + '.foo' },
            _react2.default.createElement('input', { className: formValue.foo.focus ? 'focused' : '' })
          );
        }
      ), store);

      var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');

      it('treats the return value as expected with normal children', function () {
        _chai.assert.equal(input.value, 'bar');

        input.value = 'testing';
        _reactAddonsTestUtils2.default.Simulate.change(input);

        _chai.assert.equal(input.value, 'testing');
        _chai.assert.equal(get(store.getState().test, 'foo'), 'testing');
      });

      it('rerenders the function when the form value changes', function () {
        _chai.assert.throws(function () {
          return _reactAddonsTestUtils2.default.findRenderedDOMComponentWithClass(form, 'focused');
        });

        _reactAddonsTestUtils2.default.Simulate.focus(input);

        _chai.assert.isTrue(store.getState().testForm.foo.focus);

        _chai.assert.ok(_reactAddonsTestUtils2.default.findRenderedDOMComponentWithClass(form, 'focused'));
      });
    });

    describe('validation on validation prop change', function () {
      var initialState = getInitialState({
        foo: '',
        bar: ''
      });
      var store = (0, _utils.testCreateStore)({
        testForm: formReducer('test'),
        test: modelReducer('test', initialState)
      });

      var timesOneValidationCalled = 0;
      var timesTwoValidationCalled = 0;

      var ValidationChanger = function (_React$Component4) {
        _inherits(ValidationChanger, _React$Component4);

        function ValidationChanger() {
          _classCallCheck(this, ValidationChanger);

          var _this4 = _possibleConstructorReturn(this, (ValidationChanger.__proto__ || Object.getPrototypeOf(ValidationChanger)).call(this));

          _this4.toggleValidateOne = function () {
            _this4.setState({ validateOne: !_this4.state.validateOne });
          };

          _this4.state = { validateOne: true };
          return _this4;
        }

        _createClass(ValidationChanger, [{
          key: 'validators',
          value: function validators() {
            if (this.state.validateOne) {
              return {
                foo: function foo() {
                  timesOneValidationCalled += 1;
                  return true;
                }
              };
            }
            return {
              foo: function foo() {
                timesTwoValidationCalled += 1;
                return true;
              }
            };
          }
        }, {
          key: 'render',
          value: function render() {
            return _react2.default.createElement(
              _reactRedux.Provider,
              { store: store },
              _react2.default.createElement(
                Form,
                { model: 'test', validators: this.validators() },
                _react2.default.createElement(
                  Field,
                  { model: 'test.foo' },
                  _react2.default.createElement('input', { type: 'text' })
                ),
                _react2.default.createElement(
                  'button',
                  { onClick: this.toggleValidateOne },
                  'Toggle One Validate'
                )
              )
            );
          }
        }]);

        return ValidationChanger;
      }(_react2.default.Component);

      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(ValidationChanger, null));

      var _TestUtils$scryRender17 = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'button'),
          _TestUtils$scryRender18 = _slicedToArray(_TestUtils$scryRender17, 1),
          toggleButton = _TestUtils$scryRender18[0];

      it('should validate form validators initially on load', function () {
        _chai.assert.equal(timesOneValidationCalled, 1);
        _chai.assert.equal(timesTwoValidationCalled, 0);
      });

      it('should revalidate on form validators changing', function () {
        _reactAddonsTestUtils2.default.Simulate.click(toggleButton);

        _chai.assert.equal(timesOneValidationCalled, 1);
        _chai.assert.equal(timesTwoValidationCalled, 1);
      });
    });

    describe('validation of nested/deep model values', function () {
      var initialState = getInitialState({
        items: [{ name: 'one' }, { name: 'two' }]
      });
      var store = (0, _utils.testCreateStore)({
        testForm: formReducer('test', initialState),
        test: modelReducer('test', initialState)
      });
      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Form,
          {
            model: 'test',
            validators: {
              'items[].name': function itemsName(name) {
                return name && name.length;
              }
            }
          },
          get(initialState, 'items').map(function (item, i) {
            return _react2.default.createElement(Control, { model: 'test.items[' + i + '].name' });
          })
        )
      ));
      var formElement = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'form');

      var _TestUtils$scryRender19 = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'input'),
          _TestUtils$scryRender20 = _slicedToArray(_TestUtils$scryRender19, 2),
          _ = _TestUtils$scryRender20[0],
          input2 = _TestUtils$scryRender20[1];

      it('should initially validate each item', function () {
        var _store$getState$testF = store.getState().testForm,
            $form = _store$getState$testF.$form,
            items = _store$getState$testF.items;

        _chai.assert.isTrue(items[0].name.valid);
        _chai.assert.isTrue(items[1].name.valid);
        _chai.assert.isTrue($form.valid);
      });

      it('submit should stay valid', function () {
        _reactAddonsTestUtils2.default.Simulate.submit(formElement);
        var _store$getState$testF2 = store.getState().testForm,
            $form = _store$getState$testF2.$form,
            items = _store$getState$testF2.items;


        _chai.assert.isTrue(items[0].name.valid);
        _chai.assert.isTrue(items[1].name.valid);
        _chai.assert.isTrue($form.valid);
      });

      it('should check validity of each item on change', function () {
        input2.value = '';
        _reactAddonsTestUtils2.default.Simulate.change(input2);
        var _store$getState$testF3 = store.getState().testForm,
            $form = _store$getState$testF3.$form,
            items = _store$getState$testF3.items;


        _chai.assert.isTrue(items[0].name.valid);
        _chai.assert.isFalse(items[1].name.valid);
        _chai.assert.isFalse($form.valid);
      });
    });

    describe('submit after field invalid', function () {
      var initialState = getInitialState({ username: '' });
      var store = (0, _utils.testCreateStore)({
        login: modelReducer('login', initialState),
        loginForm: formReducer('login', initialState)
      });
      var handleSubmit = _sinon2.default.spy(function (val) {
        return val;
      });

      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Form,
          {
            model: 'login',
            onSubmit: handleSubmit,
            validators: { username: function username(val) {
                return !!val;
              } },
            validateOn: 'submit'
          },
          _react2.default.createElement(
            Field,
            { model: 'login.username' },
            _react2.default.createElement('input', null)
          )
        )
      ));

      var formNode = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'form');
      var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');

      it('should be invalid after initial submit', function () {
        _reactAddonsTestUtils2.default.Simulate.submit(formNode);

        _chai.assert.isTrue(handleSubmit.callCount === 0);

        _chai.assert.isFalse(store.getState().loginForm.$form.valid);
        _chai.assert.isFalse(store.getState().loginForm.username.valid);
      });

      it('should submit after found to be valid', function () {
        input.value = 'changed';

        _reactAddonsTestUtils2.default.Simulate.change(input);

        _chai.assert.isFalse(store.getState().loginForm.username.valid, 'should not be valid yet');

        _reactAddonsTestUtils2.default.Simulate.submit(formNode);

        _chai.assert.isTrue(store.getState().loginForm.$form.valid);
        _chai.assert.isTrue(store.getState().loginForm.username.valid);

        _chai.assert.isTrue(handleSubmit.calledOnce);
      });
    });

    describe('form-wide validation with no form validators', function () {
      var initialState = getInitialState({ foo: '', bar: '' });

      var store = (0, _utils.testCreateStore)({
        test: modelReducer('test', initialState),
        testForm: formReducer('test', initialState)
      });

      var required = function required(val) {
        return !!(val && val.length);
      };

      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Form,
          { model: 'test' },
          _react2.default.createElement(Control, { model: '.foo', validators: { required: required } }),
          _react2.default.createElement(Control, { model: '.bar', validators: { required: required } })
        )
      ));

      var _TestUtils$scryRender21 = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'input'),
          _TestUtils$scryRender22 = _slicedToArray(_TestUtils$scryRender21, 2),
          foo = _TestUtils$scryRender22[0],
          bar = _TestUtils$scryRender22[1];

      it('should initially be invalid', function () {
        _chai.assert.isFalse(store.getState().testForm.$form.valid);
      });

      it('should still be invalid after only one field made valid', function () {
        foo.value = 'changed';

        _reactAddonsTestUtils2.default.Simulate.change(foo);

        _chai.assert.isTrue(store.getState().testForm.foo.valid);
        _chai.assert.isFalse(store.getState().testForm.$form.valid);
      });

      it('should be valid after only both fields are made valid', function () {
        foo.value = 'changed';
        bar.value = 'changed';

        _reactAddonsTestUtils2.default.Simulate.change(foo);
        _reactAddonsTestUtils2.default.Simulate.change(bar);

        _chai.assert.isTrue(store.getState().testForm.foo.valid);
        _chai.assert.isTrue(store.getState().testForm.bar.valid);
        _chai.assert.isTrue(store.getState().testForm.$form.valid);
      });
    });

    describe('submit valid form no validators', function () {
      var initialState = getInitialState({ foo: '' });

      var store = (0, _utils.testCreateStore)({
        test: modelReducer('test', initialState),
        testForm: formReducer('test', initialState)
      });

      var handleSubmit = _sinon2.default.spy(function (val) {
        return val;
      });

      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Form,
          {
            model: 'test',
            onSubmit: handleSubmit
          },
          _react2.default.createElement(Control, { model: '.foo' })
        )
      ));

      var formNode = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'form');

      it('should initially be valid and not pending', function () {
        _chai.assert.isTrue(store.getState().testForm.$form.valid);
        _chai.assert.isFalse(store.getState().testForm.$form.pending);
      });

      it('should call onSubmit() prop and not set to pending after submitting', function () {
        _reactAddonsTestUtils2.default.Simulate.submit(formNode);

        _chai.assert.isTrue(handleSubmit.calledOnce);

        _chai.assert.isFalse(store.getState().testForm.$form.pending);
        _chai.assert.isFalse(store.getState().testForm.$form.submitFailed);
      });
    });
  });
});