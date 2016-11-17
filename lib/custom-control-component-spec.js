'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chai = require('chai');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _src = require('../src');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint react/no-multi-comp:0 react/jsx-no-bind:0 */


describe('custom <Control /> components', function () {
  var CustomText = function (_Component) {
    _inherits(CustomText, _Component);

    function CustomText() {
      _classCallCheck(this, CustomText);

      return _possibleConstructorReturn(this, (CustomText.__proto__ || Object.getPrototypeOf(CustomText)).apply(this, arguments));
    }

    _createClass(CustomText, [{
      key: 'handleChange',
      value: function handleChange(e) {
        var customOnChange = this.props.customOnChange;

        var value = e.target.value.toUpperCase();

        customOnChange(value);
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement('input', { onChange: function onChange(e) {
              return _this2.handleChange(e);
            } })
        );
      }
    }]);

    return CustomText;
  }(_react.Component);

  process.env.NODE_ENV !== "production" ? CustomText.propTypes = { customOnChange: _react.PropTypes.func } : void 0;

  var FamiliarText = function (_Component2) {
    _inherits(FamiliarText, _Component2);

    function FamiliarText() {
      _classCallCheck(this, FamiliarText);

      return _possibleConstructorReturn(this, (FamiliarText.__proto__ || Object.getPrototypeOf(FamiliarText)).apply(this, arguments));
    }

    _createClass(FamiliarText, [{
      key: 'render',
      value: function render() {
        var _onChange = this.props.onChange;


        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement('input', { onChange: function onChange(e) {
              return _onChange(e);
            } })
        );
      }
    }]);

    return FamiliarText;
  }(_react.Component);

  process.env.NODE_ENV !== "production" ? FamiliarText.propTypes = { onChange: _react.PropTypes.function } : void 0;

  var CustomCheckbox = function (_Component3) {
    _inherits(CustomCheckbox, _Component3);

    function CustomCheckbox() {
      _classCallCheck(this, CustomCheckbox);

      return _possibleConstructorReturn(this, (CustomCheckbox.__proto__ || Object.getPrototypeOf(CustomCheckbox)).apply(this, arguments));
    }

    _createClass(CustomCheckbox, [{
      key: 'render',
      value: function render() {
        var _props = this.props,
            onChange = _props.onChange,
            value = _props.value;


        return _react2.default.createElement('span', { onClick: function onClick() {
            return onChange(value);
          } });
      }
    }]);

    return CustomCheckbox;
  }(_react.Component);

  process.env.NODE_ENV !== "production" ? CustomCheckbox.propTypes = {
    onChange: _react.PropTypes.func,
    value: _react.PropTypes.any
  } : void 0;

  var MinifiedText = function (_Component4) {
    _inherits(MT, _Component4);

    function MT() {
      _classCallCheck(this, MT);

      return _possibleConstructorReturn(this, (MT.__proto__ || Object.getPrototypeOf(MT)).apply(this, arguments));
    }

    _createClass(MT, [{
      key: 'render',
      value: function render() {
        var _onChange2 = this.props.onChange;


        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement('input', { onChange: function onChange(e) {
              return _onChange2(e);
            } })
        );
      }
    }]);

    return MT;
  }(_react.Component);

  process.env.NODE_ENV !== "production" ? MinifiedText.propTypes = { onChange: _react.PropTypes.function } : void 0;

  it('should handle custom prop mappings', function () {
    var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
      testForm: (0, _src.formReducer)('test'),
      test: (0, _src.modelReducer)('test', { foo: 'bar' })
    }));

    var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(_src.Control, {
        model: 'test.foo',
        component: CustomText,
        mapProps: {
          customOnChange: function customOnChange(props) {
            return props.onChange;
          }
        }
      })
    ));

    var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

    control.value = 'testing';

    _reactAddonsTestUtils2.default.Simulate.change(control);

    _chai.assert.equal(store.getState().test.foo, 'TESTING');
  });

  it('should handle string prop mappings', function () {
    var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
      testForm: (0, _src.formReducer)('test'),
      test: (0, _src.modelReducer)('test', { foo: 'bar' })
    }));

    var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(_src.Control.text, {
        model: 'test.foo',
        component: FamiliarText
      })
    ));

    var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

    control.value = 'testing';

    _reactAddonsTestUtils2.default.Simulate.change(control);

    _chai.assert.equal(store.getState().test.foo, 'testing');
  });

  it('should work with minified components (no displayName)', function () {
    var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
      testForm: (0, _src.formReducer)('test'),
      test: (0, _src.modelReducer)('test', { foo: 'bar' })
    }));

    var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(_src.Control.text, {
        model: 'test.foo',
        component: MinifiedText
      })
    ));

    var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

    control.value = 'testing';

    _reactAddonsTestUtils2.default.Simulate.change(control);

    _chai.assert.equal(store.getState().test.foo, 'testing');
  });

  it('should work with custom checkboxes', function () {
    var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
      testForm: (0, _src.formReducer)('test'),
      test: (0, _src.modelReducer)('test', { foo: true })
    }));

    var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(_src.Control.checkbox, {
        model: 'test.foo',
        component: CustomCheckbox
      })
    ));

    var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'span');

    _reactAddonsTestUtils2.default.Simulate.click(control);

    _chai.assert.equal(store.getState().test.foo, false);
  });

  it('should work with custom checkboxes (multi)', function () {
    var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
      testForm: (0, _src.formReducer)('test'),
      test: (0, _src.modelReducer)('test', { items: [1, 2, 3] })
    }));

    var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_src.Control.checkbox, {
          model: 'test.items[]',
          value: 1,
          component: CustomCheckbox
        }),
        _react2.default.createElement(_src.Control.checkbox, {
          model: 'test.items[]',
          value: 2,
          component: CustomCheckbox
        }),
        _react2.default.createElement(_src.Control.checkbox, {
          model: 'test.items[]',
          value: 3,
          component: CustomCheckbox
        })
      )
    ));

    var fieldControls = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(field, 'span');

    _chai.assert.deepEqual(store.getState().test.items, [1, 2, 3]);

    _reactAddonsTestUtils2.default.Simulate.click(fieldControls[0]);

    _chai.assert.sameMembers(store.getState().test.items, [2, 3]);

    _reactAddonsTestUtils2.default.Simulate.click(fieldControls[1]);

    _chai.assert.sameMembers(store.getState().test.items, [3]);

    _reactAddonsTestUtils2.default.Simulate.click(fieldControls[0]);

    _chai.assert.sameMembers(store.getState().test.items, [1, 3]);
  });

  it('should pass event to asyncValidator', function (done) {
    var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
      testForm: (0, _src.formReducer)('test'),
      test: (0, _src.modelReducer)('test', { foo: '' })
    }));

    var TextInput = function (_React$Component) {
      _inherits(TextInput, _React$Component);

      function TextInput() {
        _classCallCheck(this, TextInput);

        return _possibleConstructorReturn(this, (TextInput.__proto__ || Object.getPrototypeOf(TextInput)).apply(this, arguments));
      }

      _createClass(TextInput, [{
        key: 'render',
        value: function render() {
          return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement('input', _extends({}, this.props, {
              onChange: this.props.onChangeText
            }))
          );
        }
      }]);

      return TextInput;
    }(_react2.default.Component);

    process.env.NODE_ENV !== "production" ? TextInput.propTypes = {
      onChangeText: _react2.default.PropTypes.func
    } : void 0;

    var mapProps = {
      defaultValue: function defaultValue(props) {
        return props.modelValue;
      },
      onChangeText: function onChangeText(props) {
        return props.onChange;
      },
      onBlur: function onBlur(props) {
        return props.onBlur;
      },
      onFocus: function onFocus(props) {
        return props.onFocus;
      }
    };

    var asyncIsUsernameInUse = function asyncIsUsernameInUse(val) {
      return new Promise(function (resolve) {
        _chai.assert.equal(val, 'testing');
        resolve(false);
        done();
      });
    };

    var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(_src.Control, {
        model: 'test.foo',
        component: TextInput,
        mapProps: mapProps,
        asyncValidateOn: 'blur',
        asyncValidators: {
          usernameAvailable: function usernameAvailable(val, asyncDone) {
            return asyncIsUsernameInUse(val).then(function (inUse) {
              return asyncDone(!inUse);
            }).catch(function () {
              return asyncDone(true);
            });
          }
        }
      })
    ));

    var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');
    input.value = 'testing';

    _reactAddonsTestUtils2.default.Simulate.change(input);
    _reactAddonsTestUtils2.default.Simulate.blur(input);
  });

  it('should pass fieldValue in mapProps', function () {
    var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
      testForm: (0, _src.formReducer)('test'),
      test: (0, _src.modelReducer)('test', { foo: '' })
    }));

    var TextInput = function (_React$Component2) {
      _inherits(TextInput, _React$Component2);

      function TextInput() {
        _classCallCheck(this, TextInput);

        return _possibleConstructorReturn(this, (TextInput.__proto__ || Object.getPrototypeOf(TextInput)).apply(this, arguments));
      }

      _createClass(TextInput, [{
        key: 'render',
        value: function render() {
          var _props2 = this.props,
              focus = _props2.focus,
              touched = _props2.touched;

          var className = [focus ? 'focus' : '', touched ? 'touched' : ''].join(' ');

          return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement('input', _extends({
              className: className
            }, this.props, {
              onChange: this.props.onChangeText
            }))
          );
        }
      }]);

      return TextInput;
    }(_react2.default.Component);

    process.env.NODE_ENV !== "production" ? TextInput.propTypes = {
      onChangeText: _react2.default.PropTypes.func,
      focus: _react2.default.PropTypes.bool,
      touched: _react2.default.PropTypes.bool
    } : void 0;

    var mapProps = {
      onChange: function onChange(props) {
        return props.onChange;
      },
      onBlur: function onBlur(props) {
        return props.onBlur;
      },
      onFocus: function onFocus(props) {
        return props.onFocus;
      },
      focus: function focus(_ref) {
        var fieldValue = _ref.fieldValue;
        return fieldValue.focus;
      },
      touched: function touched(_ref2) {
        var fieldValue = _ref2.fieldValue;
        return fieldValue.touched;
      }
    };

    var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(_src.Control, {
        model: 'test.foo',
        component: TextInput,
        mapProps: mapProps
      })
    ));

    var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

    _reactAddonsTestUtils2.default.Simulate.focus(input);

    _chai.assert.equal(input.className.trim(), 'focus');

    _reactAddonsTestUtils2.default.Simulate.blur(input);

    _chai.assert.equal(input.className.trim(), 'touched');
  });
});