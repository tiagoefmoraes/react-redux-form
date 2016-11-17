'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* eslint react/no-multi-comp:0 react/jsx-no-bind:0 */


var _chai = require('chai');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _reactRedux = require('react-redux');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _capitalize = require('lodash/capitalize');

var _capitalize2 = _interopRequireDefault(_capitalize);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _toPath = require('lodash/toPath');

var _toPath2 = _interopRequireDefault(_toPath);

var _icepick = require('icepick');

var _icepick2 = _interopRequireDefault(_icepick);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _utils = require('./utils');

var _src = require('../src');

var _immutable3 = require('../immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var testContexts = {
  standard: {
    controls: _src.controls,
    modelReducer: _src.modelReducer,
    formReducer: _src.formReducer,
    Control: _src.Control,
    actions: _src.actions,
    object: {},
    get: _get3.default,
    set: function set(state, path, value) {
      return _icepick2.default.setIn(state, path, value);
    },
    getInitialState: function getInitialState(state) {
      return state;
    }
  },
  immutable: {
    controls: _immutable3.controls,
    modelReducer: _immutable3.modelReducer,
    formReducer: _immutable3.formReducer,
    Control: _immutable3.Control,
    actions: _immutable3.actions,
    object: new _immutable2.default.Map(),
    get: function get(value, path) {
      var result = value.getIn((0, _toPath2.default)(path));
      try {
        return result.toJS();
      } catch (e) {
        return result;
      }
    },
    set: function set(state, path, value) {
      return state.setIn(path, value);
    },
    getInitialState: function getInitialState(state) {
      return _immutable2.default.fromJS(state);
    }
  }
};

Object.keys(testContexts).forEach(function (testKey) {
  var testContext = testContexts[testKey];
  var controls = testContext.controls;
  var modelReducer = testContext.modelReducer;
  var formReducer = testContext.formReducer;
  var Control = testContext.Control;
  var actions = testContext.actions;
  var object = testContext.object;
  var get = testContext.get;
  var getInitialState = testContext.getInitialState;

  describe('<Control> component (' + testKey + ' context)', function () {
    describe('existence check', function () {
      it('should exist', function () {
        _chai.assert.ok(Control);
      });
    });

    describe('basic functionality', function () {
      var initialState = getInitialState({ foo: 'bar' });
      var store = (0, _utils.testCreateStore)({
        testForm: formReducer('test'),
        test: modelReducer('test', initialState)
      });

      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Control, { model: 'test.foo', mapProps: controls.text, component: 'input' })
      ));

      var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');

      it('should work as expected with a model (happy path)', function () {
        _chai.assert.ok(input);
        _chai.assert.equal(input.value, 'bar');
      });

      it('should handle changes properly', function () {
        input.value = 'new';

        _reactAddonsTestUtils2.default.Simulate.change(input);

        _chai.assert.equal(get(store.getState().test, 'foo'), 'new');
      });
    });

    describe('onLoad prop', function () {
      var initialState = getInitialState({ foo: 'bar' });
      var store = (0, _utils.testCreateStore)({
        test: modelReducer('test', initialState),
        testForm: formReducer('test', initialState)
      });

      var handleLoad = _sinon2.default.spy();

      var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Control, {
          model: 'test.foo',
          mapProps: controls.text,
          component: 'input',
          onLoad: handleLoad
        })
      ));

      var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');

      it('should call the onLoad function', function () {
        _chai.assert.ok(handleLoad.calledOnce);

        _chai.assert.equal(handleLoad.args[0][0], 'bar');
        _chai.assert.containSubset(handleLoad.args[0][1], {
          initialValue: 'bar'
        });
        _chai.assert.instanceOf(handleLoad.args[0][2], window.HTMLInputElement);
        _chai.assert.equal(handleLoad.args[0][2], input);
      });
    });
  });

  describe('Extended Control components', function () {
    var textFieldElements = [[''], ['text'], ['input', 'text'], ['input', 'password'], ['input', 'number'], ['input', 'color'], ['textarea']];

    textFieldElements.forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          controlType = _ref2[0],
          type = _ref2[1];

      describe('with <Control.' + controlType + '> ' + (type ? 'and type="' + type + '"' : ''), function () {
        var initialState = getInitialState({ foo: 'bar' });
        var store = (0, _utils.testCreateStore)({
          testForm: formReducer('test'),
          test: modelReducer('test', initialState)
        });

        var TestControl = Control[controlType] || Control;

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(TestControl, { model: 'test.foo', type: type })
        ));

        var node = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, controlType === 'textarea' ? 'textarea' : 'input');

        it('should have an initial value from the model\'s initialState', function () {
          _chai.assert.equal(node.value, 'bar');
        });

        it('should dispatch a focus event when focused', function () {
          _reactAddonsTestUtils2.default.Simulate.focus(node);

          _chai.assert.containSubset(store.getState().testForm.foo, { focus: true });
        });

        it('should dispatch a blur event when blurred', function () {
          _reactAddonsTestUtils2.default.Simulate.blur(node);

          _chai.assert.containSubset(store.getState().testForm.foo, { focus: false });
        });

        it('should dispatch a change event when changed', function () {
          node.value = 'testing';

          _reactAddonsTestUtils2.default.Simulate.change(node);

          _chai.assert.equal(get(store.getState().test, 'foo'), 'testing');

          node.value = 'testing again';

          _reactAddonsTestUtils2.default.Simulate.change(node);

          _chai.assert.equal(get(store.getState().test, 'foo'), 'testing again');
        });
      });
    });

    describe('with <Control.radio />', function () {
      var initialState = getInitialState({ foo: 'two' });
      var store = (0, _utils.testCreateStore)({
        testForm: formReducer('test'),
        test: modelReducer('test', initialState)
      });

      var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(Control.radio, { model: 'test.foo', value: 'one' }),
          _react2.default.createElement(Control.radio, { model: 'test.foo', value: 'two' })
        )
      ));

      var _TestUtils$scryRender = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(field, 'input'),
          _TestUtils$scryRender2 = _slicedToArray(_TestUtils$scryRender, 2),
          radioOne = _TestUtils$scryRender2[0],
          radioTwo = _TestUtils$scryRender2[1];

      it('should initially set the radio button matching the initial state to checked', function () {
        _chai.assert.equal(radioTwo.checked, true);
        _chai.assert.equal(radioOne.checked, false);
      });

      it('should give each radio input a name attribute of the model', function () {
        _chai.assert.equal(radioOne.name, 'test.foo');
        _chai.assert.equal(radioTwo.name, 'test.foo');
      });

      it('should dispatch a change event when changed', function () {
        _reactAddonsTestUtils2.default.Simulate.change(radioOne);

        _chai.assert.equal(get(store.getState().test, 'foo'), 'one');

        _reactAddonsTestUtils2.default.Simulate.change(radioTwo);

        _chai.assert.equal(get(store.getState().test, 'foo'), 'two');
      });

      it('should check the appropriate radio button when model is externally changed', function () {
        store.dispatch(actions.change('test.foo', 'one'));

        _chai.assert.equal(radioOne.checked, true);
        _chai.assert.equal(radioTwo.checked, false);

        store.dispatch(actions.change('test.foo', 'two'));

        _chai.assert.equal(radioTwo.checked, true);
        _chai.assert.equal(radioOne.checked, false);
      });

      it('should uncheck all radio buttons that are not equal to the value', function () {
        store.dispatch(actions.change('test.foo', 'three'));

        _chai.assert.equal(radioOne.checked, false);
        _chai.assert.equal(radioTwo.checked, false);
      });
    });

    describe('with <Control.checkbox /> (single toggle)', function () {
      var initialState = getInitialState({ single: true });
      var store = (0, _utils.testCreateStore)({
        testForm: formReducer('test'),
        test: modelReducer('test', initialState)
      });

      var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Control.checkbox, { model: 'test.single' })
      ));

      var checkbox = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

      it('should initially set the checkbox to checked if the model is truthy', function () {
        _chai.assert.equal(checkbox.checked, true);
      });

      it('should give each radio input a name attribute of the model', function () {
        _chai.assert.equal(checkbox.name, 'test.single');
      });

      it('should dispatch a change event when changed', function () {
        _reactAddonsTestUtils2.default.Simulate.change(checkbox);

        _chai.assert.equal(get(store.getState().test, 'single'), false, 'false');

        _reactAddonsTestUtils2.default.Simulate.change(checkbox);

        _chai.assert.equal(get(store.getState().test, 'single'), true, 'true');
      });

      it('should check/uncheck the checkbox when model is externally changed', function () {
        store.dispatch(actions.change('test.single', true));

        _chai.assert.equal(checkbox.checked, true);

        store.dispatch(actions.change('test.single', false));

        _chai.assert.equal(checkbox.checked, false);
      });

      it('should uncheck the checkbox for any falsey value', function () {
        store.dispatch(actions.change('test.single', ''));

        _chai.assert.equal(checkbox.checked, false);
      });
    });

    describe('with <Control.checkbox /> (multi toggle)', function () {
      var initialState = getInitialState({ foo: [1] });
      var store = (0, _utils.testCreateStore)({
        testForm: formReducer('test'),
        test: modelReducer('test', initialState)
      });

      var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(Control.checkbox, { model: 'test.foo[]', value: 1 }),
          _react2.default.createElement(Control.checkbox, { model: 'test.foo[]', value: 2 }),
          _react2.default.createElement(Control.checkbox, { model: 'test.foo[]', value: 3 })
        )
      ));

      var checkboxes = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(field, 'input');

      it('should initially set the checkbox to checked if the model is truthy', function () {
        _chai.assert.equal(checkboxes[0].checked, true);
      });

      it('should give each checkbox a name attribute of the model', function () {
        checkboxes.forEach(function (checkbox) {
          _chai.assert.equal(checkbox.name, 'test.foo[]');
        });
      });

      it('should dispatch a change event when changed', function () {
        _reactAddonsTestUtils2.default.Simulate.change(checkboxes[0]);

        _chai.assert.sameMembers(get(store.getState().test, 'foo'), [], 'all unchecked');

        _reactAddonsTestUtils2.default.Simulate.change(checkboxes[1]);

        _chai.assert.sameMembers(get(store.getState().test, 'foo'), [2], 'one checked');

        _reactAddonsTestUtils2.default.Simulate.change(checkboxes[0]);

        _chai.assert.sameMembers(get(store.getState().test, 'foo'), [1, 2], 'two checked');

        _reactAddonsTestUtils2.default.Simulate.change(checkboxes[2]);

        _chai.assert.sameMembers(get(store.getState().test, 'foo'), [1, 2, 3], 'all checked');

        _reactAddonsTestUtils2.default.Simulate.change(checkboxes[0]);

        _chai.assert.sameMembers(get(store.getState().test, 'foo'), [2, 3], 'one unchecked');
      });

      it('should check the appropriate checkboxes when model is externally changed', function () {
        store.dispatch(actions.change('test.foo', [1, 2]));

        _chai.assert.isTrue(checkboxes[0].checked);
        _chai.assert.isTrue(checkboxes[1].checked);
        _chai.assert.isFalse(checkboxes[2].checked);
      });
    });

    describe('with <Control.checkbox /> (custom onChange)', function () {
      var initialState = getInitialState({ foo: true });
      var store = (0, _utils.testCreateStore)({
        testForm: formReducer('test'),
        test: modelReducer('test', initialState)
      });

      var handleOnChange = _sinon2.default.spy(function (e) {
        return e;
      });

      var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Control.checkbox, { model: 'test.foo', onChange: handleOnChange })
      ));

      var checkbox = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

      _reactAddonsTestUtils2.default.Simulate.change(checkbox);

      it('should call the custom onChange event handler', function () {
        _chai.assert.ok(handleOnChange.calledOnce);
      });

      it('should update the state as expected', function () {
        _chai.assert.isFalse(get(store.getState().test, 'foo'));
      });
    });

    describe('with <Control.file />', function () {
      it('should update with an array of files', function () {
        var initialState = getInitialState({ foo: [] });
        var store = (0, _utils.testCreateStore)({
          testForm: formReducer('test'),
          test: modelReducer('test', initialState)
        });

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(Control.file, { model: 'test.foo' })
        ));

        var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        _reactAddonsTestUtils2.default.Simulate.change(input, {
          target: {
            type: 'file',
            files: [{ name: 'first.jpg' }, { name: 'second.jpg' }]
          }
        });

        _chai.assert.deepEqual(get(store.getState().test, 'foo'), [{ name: 'first.jpg' }, { name: 'second.jpg' }]);
      });
    });

    describe('with <Control.select />', function () {
      var initialState = getInitialState({ foo: 'one' });
      var store = (0, _utils.testCreateStore)({
        testForm: formReducer('test'),
        test: modelReducer('test', initialState)
      });

      var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Control.select,
          { model: 'test.foo' },
          _react2.default.createElement('option', { value: 'one' }),
          _react2.default.createElement('option', { value: 'two' }),
          _react2.default.createElement('option', { value: 'three' }),
          _react2.default.createElement(
            'optgroup',
            null,
            _react2.default.createElement('option', { value: 'four' }),
            _react2.default.createElement('option', { value: 'five' }),
            _react2.default.createElement('option', { value: 'six' })
          )
        )
      ));

      var select = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'select');
      var options = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(field, 'option');

      it('should select the option that matches the initial state of the model', function () {
        _chai.assert.isTrue(options[0].selected);
        _chai.assert.isFalse(options[1].selected);
        _chai.assert.equal(select.value, 'one');
      });

      it('should dispatch a change event when changed', function () {
        _reactAddonsTestUtils2.default.Simulate.change(options[1]);

        _chai.assert.equal(get(store.getState().test, 'foo'), 'two');
      });

      it('should select the appropriate <option> when model is externally changed', function () {
        store.dispatch(actions.change('test.foo', 'three'));

        _chai.assert.isTrue(options[2].selected);
        _chai.assert.equal(select.value, 'three');
      });

      it('should work with <optgroup>', function () {
        _reactAddonsTestUtils2.default.Simulate.change(options[3]);

        _chai.assert.isTrue(options[3].selected);
        _chai.assert.equal(get(store.getState().test, 'foo'), 'four');
      });
    });

    describe('ignoring events with ignore prop', function () {
      var initialState = getInitialState({ foo: 'bar' });
      var store = (0, _utils.testCreateStore)({
        test: modelReducer('test', initialState),
        testForm: formReducer('test', initialState)
      });

      var control = (0, _utils.testRender)(_react2.default.createElement(Control.text, {
        model: 'test.foo',
        ignore: ['focus', 'blur']
      }), store);

      var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(control, 'input');

      it('ignores the events specified in the ignore prop', function () {
        _chai.assert.isFalse(store.getState().testForm.foo.focus);

        _reactAddonsTestUtils2.default.Simulate.focus(input);

        _chai.assert.isFalse(store.getState().testForm.foo.focus, 'focus event should be ignored');

        _reactAddonsTestUtils2.default.Simulate.blur(input);

        _chai.assert.isFalse(store.getState().testForm.foo.touched, 'blur event should be ignored');
      });
    });

    describe('validators and validateOn property', function () {
      var initialState = getInitialState({
        foo: '',
        blur: '',
        external: ''
      });

      var store = (0, _utils.testCreateStore)({
        testForm: formReducer('test'),
        test: modelReducer('test', initialState)
      });

      it('should set the proper field state for validation', function () {
        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(Control.text, {
            model: 'test.foo',
            validators: {
              good: function good() {
                return true;
              },
              bad: function bad() {
                return false;
              },
              custom: function custom(val) {
                return val !== 'invalid';
              }
            }
          })
        ));

        var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        control.value = 'valid';

        _reactAddonsTestUtils2.default.Simulate.change(control);

        _chai.assert.deepEqual(store.getState().testForm.foo.errors, {
          good: false,
          bad: true,
          custom: false
        });

        control.value = 'invalid';

        _reactAddonsTestUtils2.default.Simulate.change(control);

        _chai.assert.deepEqual(store.getState().testForm.foo.errors, {
          good: false,
          bad: true,
          custom: true
        });
      });

      it('should validate on blur when validateOn prop is "blur"', function () {
        var timesValidationCalled = 0;

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(Control.text, {
            model: 'test.blur',
            validators: {
              good: function good() {
                return true;
              },
              bad: function bad() {
                return false;
              },
              custom: function custom(val) {
                timesValidationCalled += 1;
                return val !== 'invalid';
              }
            },
            validateOn: 'blur'
          })
        ));

        var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        control.value = 'valid';

        _chai.assert.equal(timesValidationCalled, 1, 'validation should only be called once upon load');

        _reactAddonsTestUtils2.default.Simulate.change(control);

        _chai.assert.equal(timesValidationCalled, 1, 'validation should not be called upon change');

        _reactAddonsTestUtils2.default.Simulate.blur(control);

        _chai.assert.equal(timesValidationCalled, 2, 'validation should be called upon blur');

        _chai.assert.deepEqual(store.getState().testForm.blur.errors, {
          good: false,
          bad: true,
          custom: false
        }, 'should only validate upon blur');
      });

      it('should validate on external change', function () {
        var timesValidationCalled = 0;

        _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(Control.text, {
            model: 'test.external',
            validators: {
              required: function required(val) {
                timesValidationCalled += 1;
                return val && val.length;
              }
            }
          })
        ));

        _chai.assert.equal(timesValidationCalled, 1, 'validation called on load');

        _chai.assert.isFalse(store.getState().testForm.external.valid);

        store.dispatch(actions.change('test.external', 'valid'));

        _chai.assert.isTrue(store.getState().testForm.external.valid);

        _chai.assert.equal(timesValidationCalled, 2, 'validation called because of external change');
      });
    });

    describe('validateOn != updateOn', function () {
      var initialState = {
        foo: 'one'
      };

      var radioStore = (0, _utils.testCreateStore)({
        testForm: formReducer('test', initialState),
        test: modelReducer('test', initialState)
      });

      var app = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: radioStore },
        _react2.default.createElement(Control.radio, {
          model: 'test.foo',
          value: 'two',
          validateOn: 'focus',
          validators: {
            isOne: function isOne(val) {
              return val === 'one';
            }
          }
        })
      ));

      var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(app, 'input');

      it('should initially be valid', function () {
        _chai.assert.isTrue(radioStore.getState().testForm.foo.valid);
      });

      it('should still be valid after focusing', function () {
        _reactAddonsTestUtils2.default.Simulate.focus(input);

        _chai.assert.isTrue(radioStore.getState().testForm.foo.valid);
        _chai.assert.isTrue(radioStore.getState().testForm.foo.focus);
      });
    });

    describe('asyncValidators and asyncValidateOn property', function () {
      var reducer = formReducer('test');
      var store = (0, _utils.testCreateStore)({
        testForm: reducer,
        test: modelReducer('test', object)
      });

      it('should set the proper field state for a valid async validation', function (done) {
        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(Control.text, {
            model: 'test.foo',
            asyncValidators: {
              testValid: function testValid(val, _done) {
                return setTimeout(function () {
                  return _done(true);
                }, 10);
              }
            },
            asyncValidateOn: 'blur'
          })
        ));

        var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        var expectedStates = [function (state) {
          return state.focus === false;
        },

        // initially valid
        function (state) {
          return state.validating === true && state.valid;
        },

        // true after validating
        function (state) {
          return state.validating === false && state.valid;
        }];

        var actualStates = [];

        store.subscribe(function () {
          var state = store.getState();

          actualStates.push(state.testForm.foo);

          if (actualStates.length === expectedStates.length) {
            expectedStates.map(function (expectedFn, index) {
              return _chai.assert.ok(expectedFn(actualStates[index]), '' + index);
            });

            done();
          }
        });

        _reactAddonsTestUtils2.default.Simulate.blur(control);
      });

      it('should set the proper field state for an invalid async validation', function (done) {
        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(Control.text, {
            model: 'test.foo',
            asyncValidators: {
              testValid: function testValid(val, _done) {
                return setTimeout(function () {
                  return _done(false);
                }, 10);
              }
            },
            asyncValidateOn: 'blur'
          })
        ));

        var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        var expectedStates = [function (state) {
          return state.focus === false;
        },

        // initially valid
        function (state) {
          return state.validating === true && state.valid;
        },

        // false after validating
        function (state) {
          return state.validating === false && !state.valid;
        }];

        var actualStates = [];

        store.subscribe(function () {
          var state = store.getState();

          actualStates.push(state.testForm.foo);

          if (actualStates.length === expectedStates.length) {
            expectedStates.map(function (expectedFn, index) {
              return _chai.assert.ok(expectedFn(actualStates[index]), '' + index);
            });

            done();
          }
        });

        _reactAddonsTestUtils2.default.Simulate.blur(control);
      });
    });

    describe('sync and async validators', function () {
      var reducer = formReducer('test');
      var store = (0, _utils.testCreateStore)({
        testForm: reducer,
        test: modelReducer('test', object)
      });

      var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Control.text, {
          model: 'test.foo',
          validators: {
            required: function required(val) {
              return val && val.length;
            }
          },
          asyncValidators: {
            asyncValid: function asyncValid(_, asyncDone) {
              return asyncDone(false);
            }
          }
        })
      ));

      var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

      it('async validation should not run when field is invalid', function () {
        input.value = '';
        _reactAddonsTestUtils2.default.Simulate.change(input);
        _reactAddonsTestUtils2.default.Simulate.blur(input);

        _chai.assert.deepEqual(store.getState().testForm.foo.validity, {
          required: false
        });

        _chai.assert.isUndefined(store.getState().testForm.foo.validity.asyncValid);
      });

      it('async validation should not override sync validity', function () {
        input.value = 'asdf';
        _reactAddonsTestUtils2.default.Simulate.change(input);
        _reactAddonsTestUtils2.default.Simulate.blur(input);

        _chai.assert.isDefined(store.getState().testForm.foo.validity.asyncValid);

        _chai.assert.deepEqual(store.getState().testForm.foo.validity, {
          required: true,
          asyncValid: false
        });
      });
    });

    describe('validation after reset', function () {
      var initialState = getInitialState({ foo: '' });
      var reducer = formReducer('test');
      var store = (0, _utils.testCreateStore)({
        testForm: reducer,
        test: modelReducer('test', initialState)
      });

      _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Control.text, {
          model: 'test.foo',
          validators: {
            required: function required(val) {
              return val && val.length;
            }
          }
        })
      ));

      it('should initially be invalid', function () {
        _chai.assert.deepEqual(store.getState().testForm.foo.validity, {
          required: false
        });
      });

      it('should still be invalid after resetting the form model', function () {
        store.dispatch(actions.reset('test'));

        _chai.assert.deepEqual(store.getState().testForm.foo.validity, {
          required: false
        });
      });

      it('should still be invalid after resetting the field model', function () {
        store.dispatch(actions.reset('test.foo'));

        _chai.assert.deepEqual(store.getState().testForm.foo.validity, {
          required: false
        });
      });
    });

    describe('initial value after reset', function () {
      var initialState = getInitialState({ foo: '' });
      var reducer = formReducer('test');
      var store = (0, _utils.testCreateStore)({
        testForm: reducer,
        test: modelReducer('test', initialState)
      });

      _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Control.text, {
          model: 'test.foo'
        })
      ));

      it('should reset the control to the last loaded value', function () {
        store.dispatch(actions.load('test.foo', 'new foo'));
        store.dispatch(actions.reset('test.foo'));

        _chai.assert.equal(get(store.getState().test, 'foo'), 'new foo');
      });
    });

    describe('errors property', function () {
      var reducer = formReducer('test');

      it('should set the proper field state for errors', function () {
        var initialState = getInitialState({ foo: '' });
        var store = (0, _utils.testCreateStore)({
          testForm: reducer,
          test: modelReducer('test', initialState)
        });

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(Control.text, {
            model: 'test.foo',
            errors: {
              length: function length(val) {
                return val.length > 8 && 'too long';
              },
              valid: function valid(val) {
                return val !== 'valid' && 'not valid';
              }
            }
          })
        ));

        var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        control.value = 'valid';

        _reactAddonsTestUtils2.default.Simulate.change(control);

        _chai.assert.deepEqual(store.getState().testForm.foo.errors, {
          length: false,
          valid: false
        });

        control.value = 'invalid string';

        _reactAddonsTestUtils2.default.Simulate.change(control);

        _chai.assert.deepEqual(store.getState().testForm.foo.errors, {
          length: 'too long',
          valid: 'not valid'
        });
      });

      it('should only validate errors on blur if validateOn="blur"', function () {
        var initialState = getInitialState({ foo: '' });
        var store = (0, _utils.testCreateStore)({
          testForm: reducer,
          test: modelReducer('test', initialState)
        });

        var timesValidationCalled = 0;

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(Control.text, {
            model: 'test.foo',
            errors: {
              length: function length(val) {
                return val.length > 8 && 'too long';
              },
              valid: function valid(val) {
                timesValidationCalled += 1;
                return val !== 'valid' && 'not valid';
              }
            },
            validateOn: 'blur',
            required: true
          })
        ));

        var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        _chai.assert.equal(timesValidationCalled, 1, 'validation should be called on load');

        control.value = 'valid';

        _reactAddonsTestUtils2.default.Simulate.change(control);

        _chai.assert.equal(timesValidationCalled, 1, 'validation should not be called again on change');

        _reactAddonsTestUtils2.default.Simulate.blur(control);

        _chai.assert.equal(timesValidationCalled, 2, 'validation should be called again on blur');

        _chai.assert.deepEqual(store.getState().testForm.foo.errors, {
          length: false,
          valid: false
        });

        control.value = 'invalid string';

        _reactAddonsTestUtils2.default.Simulate.change(control);

        _chai.assert.deepEqual(store.getState().testForm.foo.errors, {
          length: false,
          valid: false
        });

        _reactAddonsTestUtils2.default.Simulate.blur(control);

        _chai.assert.deepEqual(store.getState().testForm.foo.errors, {
          length: 'too long',
          valid: 'not valid'
        });
      });

      it('should handle a validator function for errors', function () {
        var initialState = getInitialState({ foo: '' });
        var store = (0, _utils.testCreateStore)({
          testForm: reducer,
          test: modelReducer('test', initialState)
        });

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(Control.text, {
            model: 'test.foo',
            errors: function errors(val) {
              return !val && !val.length && 'Required';
            }
          })
        ));

        var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        _chai.assert.equal(store.getState().testForm.foo.errors, 'Required');

        control.value = 'valid';

        _reactAddonsTestUtils2.default.Simulate.change(control);

        _chai.assert.deepEqual(store.getState().testForm.foo.errors, false);
      });
    });

    describe('dynamic components', function () {
      var reducer = formReducer('test');
      var store = (0, _utils.testCreateStore)({
        testForm: reducer,
        test: modelReducer('test', object)
      });

      var DynamicSelectForm = function (_React$Component) {
        _inherits(DynamicSelectForm, _React$Component);

        function DynamicSelectForm() {
          _classCallCheck(this, DynamicSelectForm);

          var _this = _possibleConstructorReturn(this, (DynamicSelectForm.__proto__ || Object.getPrototypeOf(DynamicSelectForm)).call(this));

          _this.state = { options: [1, 2] };
          return _this;
        }

        _createClass(DynamicSelectForm, [{
          key: 'render',
          value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement('button', { onClick: function onClick() {
                  return _this2.setState({ options: [1, 2, 3] });
                } }),
              _react2.default.createElement(
                Control.select,
                { model: 'test.foo', dynamic: true },
                this.state.options.map(function (option, index) {
                  return _react2.default.createElement('option', { key: index, value: option });
                })
              )
            );
          }
        }]);

        return DynamicSelectForm;
      }(_react2.default.Component);

      it('should properly update dynamic components inside <Field>', function () {
        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(DynamicSelectForm, null)
        ));

        var options = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(field, 'option');
        var button = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'button');

        _chai.assert.equal(options.length, 2);

        _reactAddonsTestUtils2.default.Simulate.click(button);

        options = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(field, 'option');

        _chai.assert.equal(options.length, 3);
      });
    });

    describe('updateOn prop', function () {
      var onEvents = ['change', 'focus', 'blur'];

      onEvents.forEach(function (onEvent) {
        var initialState = getInitialState({ foo: 'initial' });
        var store = (0, _utils.testCreateStore)({
          test: modelReducer('test', initialState),
          testForm: formReducer('test')
        });

        it('should update the store when updateOn="' + onEvent + '"', function () {
          var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
            _reactRedux.Provider,
            { store: store },
            _react2.default.createElement(Control.text, {
              model: 'test.foo',
              updateOn: onEvent
            })
          ));

          var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

          _chai.assert.equal(get(store.getState().test, 'foo'), 'initial');

          var testValue = onEvent + ' test';

          control.value = testValue;

          _chai.assert.equal(get(store.getState().test, 'foo'), 'initial', 'Model value should not change yet');

          _reactAddonsTestUtils2.default.Simulate[onEvent](control);

          _chai.assert.equal(get(store.getState().test, 'foo'), testValue);
        });
      });
    });

    describe('validation on load', function () {
      var initialState = getInitialState({ foo: 'invalid' });
      var reducer = formReducer('test');
      var store = (0, _utils.testCreateStore)({
        testForm: reducer,
        test: modelReducer('test', initialState)
      });

      it('should always validate the model initially', function () {
        _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(Control.text, {
            model: 'test.foo',
            validators: {
              initial: function initial(val) {
                return val !== 'invalid';
              }
            }
          })
        ));

        _chai.assert.containSubset(store.getState().testForm.foo, {
          validity: {
            initial: false
          },
          errors: {
            initial: true
          }
        });

        _chai.assert.isFalse(store.getState().testForm.foo.valid);
      });
    });

    describe('syncing control defaultValue on load', function () {
      var initialState = getInitialState({ foo: '' });
      var reducer = modelReducer('test', initialState);
      var store = (0, _utils.testCreateStore)({
        test: reducer,
        testForm: formReducer('test')
      });

      it('should change the model to the defaultValue on load', function () {
        _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(Control.text, {
            model: 'test.foo',
            defaultValue: 'testing'
          })
        ));

        _chai.assert.equal(get(store.getState().test, 'foo'), 'testing');
      });
    });

    describe('change on enter', function () {
      var reducer = modelReducer('test');
      var store = (0, _utils.testCreateStore)({
        test: reducer,
        testForm: formReducer('test')
      });

      it('should change the model upon pressing Enter', function () {
        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(Control.text, {
            model: 'test.foo',
            updateOn: 'blur'
          })
        ));

        var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        control.value = 'testing';

        _reactAddonsTestUtils2.default.Simulate.keyPress(control, {
          key: 'Enter',
          keyCode: 13,
          which: 13
        });

        _chai.assert.equal(get(store.getState().test, 'foo'), 'testing');
      });
    });

    describe('changeAction prop', function () {
      var initialState = getInitialState({
        foo: '',
        checked: false
      });
      var reducer = modelReducer('test', initialState);
      var store = (0, _utils.testCreateStore)({
        test: reducer,
        testForm: formReducer('test')
      });

      it('should execute the custom change action', function () {
        var customChanged = false;

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(Control.text, {
            model: 'test.foo',
            changeAction: function changeAction(model, value) {
              customChanged = true;
              return actions.change(model, value);
            }
          })
        ));

        var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        control.value = 'testing';

        _reactAddonsTestUtils2.default.Simulate.change(control);

        _chai.assert.isTrue(customChanged);

        _chai.assert.equal(get(store.getState().test, 'foo'), 'testing');
      });

      it('should execute the custom change action (checkbox)', function () {
        var customChanged = false;

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(Control.checkbox, {
            model: 'test.checked',
            changeAction: function changeAction() {
              customChanged = true;
            }
          })
        ));

        var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        _reactAddonsTestUtils2.default.Simulate.change(control);

        _chai.assert.isTrue(customChanged);
      });

      it('should provide the inverse of the model value (checkbox)', function (done) {
        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(Control.checkbox, {
            model: 'test.customChecked',
            changeAction: function changeAction(model, value) {
              _chai.assert.equal(model, 'test.customChecked');
              _chai.assert.equal(value, true); // initial value is false
              done();
            }
          })
        ));

        var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        _reactAddonsTestUtils2.default.Simulate.change(control);
      });
    });

    describe('event handlers on control', function () {
      var initialState = getInitialState({
        foo: '',
        bar: ''
      });

      var reducer = modelReducer('test', initialState);
      var store = (0, _utils.testCreateStore)({
        test: reducer,
        testForm: formReducer('test')
      });

      it('should execute the custom change action', function () {
        var onChangeFn = function onChangeFn(val) {
          return val;
        };
        var onChangeFnSpy = _sinon2.default.spy(onChangeFn);

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(Control.text, {
            model: 'test.foo',
            onChange: onChangeFnSpy
          })
        ));

        var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        control.value = 'testing';

        _reactAddonsTestUtils2.default.Simulate.change(control);

        _chai.assert.isTrue(onChangeFnSpy.calledOnce);
        _chai.assert.isObject(onChangeFnSpy.returnValues[0]);
        _chai.assert.equal(onChangeFnSpy.returnValues[0].constructor.name, 'SyntheticEvent');
        _chai.assert.equal(onChangeFnSpy.returnValues[0].target.value, 'testing');
      });

      it('should not execute custom onChange functions of unchanged controls', function () {
        var onChangeFn = function onChangeFn(val) {
          return val;
        };
        var onChangeFnSpy = _sinon2.default.spy(onChangeFn);

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(Control.text, {
              model: 'test.foo',
              onChange: onChangeFnSpy
            }),
            _react2.default.createElement(Control.text, {
              model: 'test.bar'
            })
          )
        ));

        var _TestUtils$scryRender3 = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(field, 'input'),
            _TestUtils$scryRender4 = _slicedToArray(_TestUtils$scryRender3, 2),
            _ = _TestUtils$scryRender4[0],
            controlBar = _TestUtils$scryRender4[1];

        controlBar.value = 'testing';

        _reactAddonsTestUtils2.default.Simulate.change(controlBar);

        _chai.assert.isFalse(onChangeFnSpy.called);
      });

      it('should only execute custom onChange function pertaining to the changed input', function () {
        var onChangeFnFoo = function onChangeFnFoo(val) {
          return val;
        };
        var onChangeFnBar = function onChangeFnBar(val) {
          return val;
        };
        var onChangeFnFooSpy = _sinon2.default.spy(onChangeFnFoo);
        var onChangeFnBarSpy = _sinon2.default.spy(onChangeFnBar);

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(Control.text, {
              model: 'test.foo',
              onChange: onChangeFnFooSpy
            }),
            _react2.default.createElement(Control.text, {
              model: 'test.bar',
              onChange: onChangeFnBarSpy
            })
          )
        ));

        var _TestUtils$scryRender5 = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(field, 'input'),
            _TestUtils$scryRender6 = _slicedToArray(_TestUtils$scryRender5, 2),
            _ = _TestUtils$scryRender6[0],
            controlBar = _TestUtils$scryRender6[1];

        controlBar.value = 'testing';

        _reactAddonsTestUtils2.default.Simulate.change(controlBar);

        _chai.assert.isFalse(onChangeFnFooSpy.called);
        _chai.assert.isTrue(onChangeFnBarSpy.called);
      });

      it('should persist and return the event even when not returned', function () {
        var onChangeFn = function onChangeFn() {};
        var onChangeFnSpy = _sinon2.default.spy(onChangeFn);

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(Control.text, {
            model: 'test.foo',
            onChange: onChangeFnSpy
          })
        ));

        var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        control.value = 'testing 2';

        _reactAddonsTestUtils2.default.Simulate.change(control);

        _chai.assert.isTrue(onChangeFnSpy.calledOnce);
        _chai.assert.isUndefined(onChangeFnSpy.returnValues[0]);
        _chai.assert.equal(get(store.getState().test, 'foo'), 'testing 2');
      });

      ['focus', 'blur'].forEach(function (event) {
        var eventHandler = 'on' + (0, _capitalize2.default)(event);

        it('should execute the custom ' + event + ' action', function () {
          var targetValue = void 0;

          var onEvent = function onEvent(e) {
            targetValue = e.target.value;

            return e;
          };

          var onEventSpy = _sinon2.default.spy(onEvent);

          var prop = _defineProperty({}, eventHandler, onEventSpy);

          var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
            _reactRedux.Provider,
            { store: store },
            _react2.default.createElement(Control.text, _extends({
              model: 'test.foo'
            }, prop))
          ));

          var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

          control.value = 'testing ' + event;

          _reactAddonsTestUtils2.default.Simulate[event](control);

          _chai.assert.isTrue(onEventSpy.calledOnce);
          _chai.assert.isObject(onEventSpy.returnValues[0]);
          _chai.assert.equal(onEventSpy.returnValues[0].constructor.name, 'SyntheticEvent');

          _chai.assert.equal(targetValue, 'testing ' + event);
        });
      });
    });

    describe('unmounting', function () {
      it('should set the validity of the model to true when umounted', function () {
        var initialState = getInitialState({ foo: '' });
        var store = (0, _utils.testCreateStore)({
          test: modelReducer('test', initialState),
          testForm: formReducer('test', initialState)
        });

        var container = document.createElement('div');

        var field = _reactDom2.default.render(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(Control.input, { model: 'test.foo' })
        ), container);

        var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        store.dispatch(actions.setValidity('test.foo', false));
        _chai.assert.isFalse(store.getState().testForm.foo.valid);

        _reactDom2.default.unmountComponentAtNode(container);

        _chai.assert.isTrue(store.getState().testForm.foo.valid);
      });

      it('should only reset the validity of field-specific validators', function () {
        var initialState = getInitialState({ foo: '' });
        var store = (0, _utils.testCreateStore)({
          test: modelReducer('test', initialState),
          testForm: formReducer('test', initialState)
        });

        var container = document.createElement('div');

        var field = _reactDom2.default.render(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(Control.input, {
            model: 'test.foo',
            validators: {
              internal: function internal() {
                return false;
              }
            }
          })
        ), container);

        var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        _chai.assert.isFalse(store.getState().testForm.foo.valid);

        store.dispatch(actions.setValidity('test.foo', _extends({}, store.getState().testForm.foo.validity, {
          external: false
        })));

        _chai.assert.isFalse(store.getState().testForm.foo.valid);

        _reactDom2.default.unmountComponentAtNode(container);

        _chai.assert.isFalse(store.getState().testForm.foo.valid);

        store.dispatch(actions.setValidity('test.foo', _extends({}, store.getState().testForm.foo.validity, {
          external: true
        })));

        _chai.assert.isTrue(store.getState().testForm.foo.valid);
      });
    });

    describe('with <Control.reset>', function () {
      it('should reset the given model', function () {
        var initialState = getInitialState({ foo: '' });
        var store = (0, _utils.testCreateStore)({
          test: modelReducer('test', initialState),
          testForm: formReducer('test', initialState)
        });

        var container = document.createElement('div');

        var field = _reactDom2.default.render(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(Control.input, {
              model: 'test.foo'
            }),
            _react2.default.createElement(Control.reset, { model: 'test.foo' })
          )
        ), container);

        var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');
        var reset = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'button');

        input.value = 'changed';

        _reactAddonsTestUtils2.default.Simulate.change(input);

        _chai.assert.equal(get(store.getState().test, 'foo'), 'changed');

        _reactAddonsTestUtils2.default.Simulate.click(reset);

        _chai.assert.equal(get(store.getState().test, 'foo'), '');
      });
    });

    describe('manual focus/blur', function () {
      var initialState = getInitialState({ foo: 'bar' });
      var store = (0, _utils.testCreateStore)({
        test: modelReducer('test', initialState),
        testForm: formReducer('test', initialState)
      });

      var control = (0, _utils.testRender)(_react2.default.createElement(Control.text, {
        model: 'test.foo'
      }), store);

      var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(control, 'input');

      it('should manually focus the control', function () {
        store.dispatch(actions.focus('test.foo'));

        _chai.assert.equal(document.activeElement, input);
      });

      xit('should manually blur the control', function () {
        store.dispatch(actions.focus('test.foo'));

        _chai.assert.equal(document.activeElement, input);

        store.dispatch(actions.blur('test.foo'));

        _chai.assert.notEqual(document.activeElement, input);
      });
    });

    describe('handling on multiple events', function () {
      var initialState = getInitialState({ foo: 'bar' });
      var store = (0, _utils.testCreateStore)({
        test: modelReducer('test', initialState),
        testForm: formReducer('test', initialState)
      });

      var control = (0, _utils.testRender)(_react2.default.createElement(Control.text, {
        model: 'test.foo',
        updateOn: ['change', 'blur']
      }), store);

      var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(control, 'input');

      it('should update on change', function () {
        input.value = 'update on change';

        _reactAddonsTestUtils2.default.Simulate.change(input);

        _chai.assert.equal(get(store.getState().test, 'foo'), 'update on change');
      });

      it('should update on blur', function () {
        input.value = 'update on blur';

        _reactAddonsTestUtils2.default.Simulate.blur(input);

        _chai.assert.equal(get(store.getState().test, 'foo'), 'update on blur');
      });
    });
  });
});