'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createControlClass = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _identity = require('lodash/identity');

var _identity2 = _interopRequireDefault(_identity);

var _shallowEqual = require('../utils/shallow-equal');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _get2 = require('../utils/get');

var _get3 = _interopRequireDefault(_get2);

var _merge = require('../utils/merge');

var _merge2 = _interopRequireDefault(_merge);

var _mapValues = require('../utils/map-values');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _icepick = require('icepick');

var _icepick2 = _interopRequireDefault(_icepick);

var _omit = require('../utils/omit');

var _omit2 = _interopRequireDefault(_omit);

var _actionTypes = require('../action-types');

var _actionTypes2 = _interopRequireDefault(_actionTypes);

var _getValue = require('../utils/get-value');

var _getValue2 = _interopRequireDefault(_getValue);

var _getValidity = require('../utils/get-validity');

var _getValidity2 = _interopRequireDefault(_getValidity);

var _invertValidity = require('../utils/invert-validity');

var _invertValidity2 = _interopRequireDefault(_invertValidity);

var _getFieldFromState = require('../utils/get-field-from-state');

var _getFieldFromState2 = _interopRequireDefault(_getFieldFromState);

var _getModel = require('../utils/get-model');

var _getModel2 = _interopRequireDefault(_getModel);

var _persistEventWithCallback = require('../utils/persist-event-with-callback');

var _persistEventWithCallback2 = _interopRequireDefault(_persistEventWithCallback);

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

var _controlPropsMap = require('../constants/control-props-map');

var _controlPropsMap2 = _interopRequireDefault(_controlPropsMap);

var _validityKeys = require('../constants/validity-keys');

var _validityKeys2 = _interopRequireDefault(_validityKeys);

var _batchActions = require('../actions/batch-actions');

var _resolveModel = require('../utils/resolve-model');

var _resolveModel2 = _interopRequireDefault(_resolveModel);

var _isNative = require('../utils/is-native');

var _isNative2 = _interopRequireDefault(_isNative);

var _initialFieldState = require('../constants/initial-field-state');

var _initialFieldState2 = _interopRequireDefault(_initialFieldState);

var _containsEvent = require('../utils/contains-event');

var _containsEvent2 = _interopRequireDefault(_containsEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var findDOMNode = !_isNative2.default ? require('react-dom').findDOMNode : null;

var disallowedProps = ['changeAction', 'getFieldFromState', 'store'];

function getReadOnlyValue(props) {
  var modelValue = props.modelValue,
      controlProps = props.controlProps;


  switch (controlProps.type) {
    case 'checkbox':
      return typeof controlProps.value !== 'undefined' ? controlProps.value : !modelValue; // simple checkbox

    case 'radio':
    default:
      return controlProps.value;
  }
}

var propTypes = {
  model: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.string]).isRequired,
  modelValue: _react.PropTypes.any,
  viewValue: _react.PropTypes.any,
  control: _react.PropTypes.any,
  onLoad: _react.PropTypes.func,
  onSubmit: _react.PropTypes.func,
  fieldValue: _react.PropTypes.object,
  mapProps: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.object]),
  changeAction: _react.PropTypes.func,
  updateOn: _react.PropTypes.oneOfType([_react.PropTypes.arrayOf(_react.PropTypes.string), _react.PropTypes.string]),
  validateOn: _react.PropTypes.oneOfType([_react.PropTypes.arrayOf(_react.PropTypes.string), _react.PropTypes.string]),
  validators: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.object]),
  asyncValidateOn: _react.PropTypes.oneOfType([_react.PropTypes.arrayOf(_react.PropTypes.string), _react.PropTypes.string]),
  asyncValidators: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.object]),
  errors: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.object]),
  controlProps: _react.PropTypes.object,
  component: _react.PropTypes.any,
  dispatch: _react.PropTypes.func,
  parser: _react.PropTypes.func,
  ignore: _react.PropTypes.oneOfType([_react.PropTypes.arrayOf(_react.PropTypes.string), _react.PropTypes.string]),
  dynamic: _react.PropTypes.bool,
  store: _react.PropTypes.shape({
    subscribe: _react.PropTypes.func,
    dispatch: _react.PropTypes.func,
    getState: _react.PropTypes.func
  })
};

var defaultStrategy = {
  get: _get3.default,
  getFieldFromState: _getFieldFromState2.default,
  actions: _actions2.default
};

function createControlClass() {
  var customControlPropsMap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultStrategy;

  var controlPropsMap = _extends({}, _controlPropsMap2.default, customControlPropsMap);

  function isReadOnlyValue(controlProps) {
    return ~['radio', 'checkbox'].indexOf(controlProps.type);
  }

  var emptyControlProps = {};

  var Control = function (_Component) {
    _inherits(Control, _Component);

    function Control(props) {
      _classCallCheck(this, Control);

      var _this = _possibleConstructorReturn(this, (Control.__proto__ || Object.getPrototypeOf(Control)).call(this, props));

      _this.getChangeAction = _this.getChangeAction.bind(_this);
      _this.getValidateAction = _this.getValidateAction.bind(_this);

      _this.handleKeyPress = _this.handleKeyPress.bind(_this);
      _this.createEventHandler = _this.createEventHandler.bind(_this);
      _this.handleFocus = _this.createEventHandler('focus').bind(_this);
      _this.handleBlur = _this.createEventHandler('blur').bind(_this);
      _this.handleUpdate = _this.createEventHandler('change').bind(_this);
      _this.handleChange = _this.handleChange.bind(_this);
      _this.handleLoad = _this.handleLoad.bind(_this);
      _this.getMappedProps = _this.getMappedProps.bind(_this);
      _this.attachNode = _this.attachNode.bind(_this);
      _this.readOnlyValue = isReadOnlyValue(props.controlProps);

      _this.state = {
        viewValue: props.modelValue
      };
      return _this;
    }

    _createClass(Control, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.attachNode();
        this.handleLoad();
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (nextProps.modelValue !== this.props.modelValue) {
          this.setViewValue(nextProps.modelValue);
        }
      }
    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps, nextState) {
        return !(0, _shallowEqual2.default)(this.props, nextProps, ['controlProps', 'mapProps']) || !(0, _shallowEqual2.default)(this.props.controlProps, nextProps.controlProps) || !(0, _shallowEqual2.default)(this.state.viewValue, nextState.viewValue);
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
        this.handleIntents();
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        var _props = this.props,
            model = _props.model,
            fieldValue = _props.fieldValue,
            dispatch = _props.dispatch,
            _props$validators = _props.validators,
            validators = _props$validators === undefined ? {} : _props$validators,
            _props$errors = _props.errors,
            errors = _props$errors === undefined ? {} : _props$errors;


        if (fieldValue && !fieldValue.valid) {
          var keys = Object.keys(validators).concat(Object.keys(errors));

          dispatch(_actions2.default.setValidity(model, (0, _omit2.default)(fieldValue.validity, keys)));
        }
      }
    }, {
      key: 'getMappedProps',
      value: function getMappedProps() {
        var props = this.props;
        var mapProps = props.mapProps;
        var viewValue = this.state.viewValue;

        var originalProps = _extends({}, props, props.controlProps, {
          onFocus: this.handleFocus,
          onBlur: this.handleBlur,
          onChange: this.handleChange,
          onKeyPress: this.handleKeyPress,
          viewValue: viewValue
        });

        if ((0, _isPlainObject2.default)(mapProps)) {
          return (0, _mapValues2.default)(mapProps, function (value, key) {
            if (typeof value === 'function' && key !== 'component') {
              return value(originalProps);
            }

            return value;
          });
        }

        return mapProps(originalProps);
      }
    }, {
      key: 'getChangeAction',
      value: function getChangeAction(event) {
        var _props2 = this.props,
            model = _props2.model,
            modelValue = _props2.modelValue,
            changeAction = _props2.changeAction;

        var value = this.readOnlyValue ? getReadOnlyValue(this.props) : event;

        return changeAction(model, (0, _getValue2.default)(value), {
          currentValue: modelValue
        });
      }
    }, {
      key: 'getValidateAction',
      value: function getValidateAction(value, eventName) {
        var _props3 = this.props,
            validators = _props3.validators,
            errors = _props3.errors,
            model = _props3.model,
            modelValue = _props3.modelValue,
            updateOn = _props3.updateOn,
            fieldValue = _props3.fieldValue;


        if (!validators && !errors && _isNative2.default) return false;

        var nodeErrors = this.getNodeErrors();

        // If it is not a change event, use the model value.
        var valueToValidate = (0, _containsEvent2.default)(updateOn, eventName) ? value : modelValue;

        if (validators || errors) {
          var fieldValidity = (0, _getValidity2.default)(validators, valueToValidate);
          var fieldErrors = (0, _merge2.default)((0, _getValidity2.default)(errors, valueToValidate), nodeErrors);

          var mergedErrors = validators ? (0, _merge2.default)((0, _invertValidity2.default)(fieldValidity), fieldErrors) : fieldErrors;

          if (!fieldValue || !(0, _shallowEqual2.default)(mergedErrors, fieldValue.errors)) {
            return _actions2.default.setErrors(model, mergedErrors);
          }
        } else if (nodeErrors && Object.keys(nodeErrors).length) {
          return _actions2.default.setErrors(model, nodeErrors);
        }

        return false;
      }
    }, {
      key: 'getAsyncValidateAction',
      value: function getAsyncValidateAction(value, eventName) {
        var _props4 = this.props,
            asyncValidators = _props4.asyncValidators,
            fieldValue = _props4.fieldValue,
            model = _props4.model,
            modelValue = _props4.modelValue,
            updateOn = _props4.updateOn;

        // If there are no async validators,
        // do not run async validation

        if (!asyncValidators) return false;

        // If it is not a change event, use the model value.
        var valueToValidate = (0, _containsEvent2.default)(updateOn, eventName) ? value : modelValue;

        // If any sync validity is invalid,
        // do not run async validation
        var asyncValidatorKeys = Object.keys(asyncValidators);
        var syncValid = Object.keys(fieldValue.validity).every(function (key) {
          // If validity is based on async validator, skip
          if (!!~asyncValidatorKeys.indexOf(key)) return true;

          return fieldValue.validity[key];
        });

        if (!syncValid) return false;

        return function (dispatch) {
          (0, _mapValues2.default)(asyncValidators, function (validator, key) {
            return dispatch(_actions2.default.asyncSetValidity(model, function (_, done) {
              var outerDone = function outerDone(valid) {
                var validity = _icepick2.default.merge(fieldValue.validity, _defineProperty({}, key, valid));

                done(validity);
              };

              validator((0, _getValue2.default)(valueToValidate), outerDone);
            }));
          });

          return valueToValidate;
        };
      }
    }, {
      key: 'getNodeErrors',
      value: function getNodeErrors() {
        var node = this.node,
            fieldValue = this.props.fieldValue;


        if (!node || !node.willValidate) {
          return null;
        }

        var nodeErrors = {};

        _validityKeys2.default.forEach(function (key) {
          var errorValidity = node.validity[key];

          // If the key is invalid or they key was
          // previously invalid and is now valid,
          // set its validity
          if (errorValidity || fieldValue && fieldValue.errors[key]) {
            nodeErrors[key] = errorValidity;
          }
        });

        return nodeErrors;
      }
    }, {
      key: 'setViewValue',
      value: function setViewValue(viewValue) {
        if (!isReadOnlyValue(this.props.controlProps)) {
          this.setState({ viewValue: this.parse(viewValue) });
        }
      }
    }, {
      key: 'handleIntents',
      value: function handleIntents() {
        var _this2 = this;

        var _props5 = this.props,
            model = _props5.model,
            modelValue = _props5.modelValue,
            fieldValue = _props5.fieldValue,
            intents = _props5.fieldValue.intents,
            controlProps = _props5.controlProps,
            dispatch = _props5.dispatch,
            updateOn = _props5.updateOn,
            _props5$validateOn = _props5.validateOn,
            validateOn = _props5$validateOn === undefined ? updateOn : _props5$validateOn;


        if (!intents.length) return;

        intents.forEach(function (intent) {
          switch (intent.type) {
            case _actionTypes2.default.FOCUS:
              {
                if (_isNative2.default) return;

                var readOnlyValue = isReadOnlyValue(controlProps);
                var focused = fieldValue.focus;

                if (focused && _this2.node.focus && (!readOnlyValue || typeof intent.value === 'undefined' || intent.value === controlProps.value)) {
                  _this2.node.focus();

                  dispatch(_actions2.default.clearIntents(model, intent));
                }

                return;
              }
            case 'validate':
              if ((0, _containsEvent2.default)(validateOn, 'change')) {
                dispatch(_actions2.default.clearIntents(model, intent));
                _this2.validate();
              }
              return;

            case 'load':
              if (!(0, _shallowEqual2.default)(modelValue, intent.value)) {
                dispatch(_actions2.default.clearIntents(model, intent));
                dispatch(_actions2.default.load(model, intent.value));
              }
              return;

            default:
              return;
          }
        });
      }
    }, {
      key: 'parse',
      value: function parse(value) {
        return this.props.parser ? this.props.parser(value) : value;
      }
    }, {
      key: 'handleChange',
      value: function handleChange(event) {
        this.setViewValue((0, _getValue2.default)(event));
        this.handleUpdate(event);
      }
    }, {
      key: 'handleKeyPress',
      value: function handleKeyPress(event) {
        // Get the value from the event
        // in case updateOn="blur" (or something other than "change")
        var parsedValue = this.parse((0, _getValue2.default)(event));

        if (event.key === 'Enter') {
          this.props.dispatch(this.getChangeAction(parsedValue));
        }
      }
    }, {
      key: 'handleLoad',
      value: function handleLoad() {
        var _props6 = this.props,
            model = _props6.model,
            modelValue = _props6.modelValue,
            fieldValue = _props6.fieldValue,
            _props6$controlProps = _props6.controlProps,
            controlProps = _props6$controlProps === undefined ? emptyControlProps : _props6$controlProps,
            onLoad = _props6.onLoad,
            dispatch = _props6.dispatch,
            changeAction = _props6.changeAction,
            parser = _props6.parser;

        var defaultValue = undefined;

        if (controlProps.hasOwnProperty('defaultValue')) {
          defaultValue = controlProps.defaultValue;
        } else if (controlProps.hasOwnProperty('defaultChecked')) {
          defaultValue = controlProps.defaultChecked;
        }

        var loadActions = [this.getValidateAction(defaultValue)];

        if (typeof defaultValue !== 'undefined') {
          loadActions.push(changeAction(model, defaultValue));
        } else {
          if (parser) {
            var parsedValue = parser(modelValue);

            if (parsedValue !== modelValue) {
              loadActions.push(changeAction(model, parsedValue));
            }
          }
        }

        (0, _batchActions.dispatchBatchIfNeeded)(model, loadActions, dispatch);

        if (onLoad) onLoad(modelValue, fieldValue, this.node);
      }
    }, {
      key: 'createEventHandler',
      value: function createEventHandler(eventName) {
        var _this3 = this;

        var _props7 = this.props,
            dispatch = _props7.dispatch,
            model = _props7.model,
            updateOn = _props7.updateOn,
            _props7$validateOn = _props7.validateOn,
            validateOn = _props7$validateOn === undefined ? updateOn : _props7$validateOn,
            asyncValidateOn = _props7.asyncValidateOn,
            _props7$controlProps = _props7.controlProps,
            controlProps = _props7$controlProps === undefined ? emptyControlProps : _props7$controlProps,
            parser = _props7.parser,
            ignore = _props7.ignore;


        var eventAction = {
          focus: _actions2.default.silentFocus,
          blur: _actions2.default.blur
        }[eventName];

        var controlEventHandler = {
          focus: controlProps.onFocus,
          blur: controlProps.onBlur,
          change: controlProps.onChange
        }[eventName];

        var dispatchBatchActions = function dispatchBatchActions(persistedEvent) {
          var eventActions = [eventAction && eventAction(model), (0, _containsEvent2.default)(validateOn, eventName) && _this3.getValidateAction(persistedEvent, eventName), (0, _containsEvent2.default)(asyncValidateOn, eventName) && _this3.getAsyncValidateAction(persistedEvent, eventName), (0, _containsEvent2.default)(updateOn, eventName) && _this3.getChangeAction(persistedEvent)];

          (0, _batchActions.dispatchBatchIfNeeded)(model, eventActions, dispatch);

          return persistedEvent;
        };

        return function (event) {
          if ((0, _containsEvent2.default)(ignore, eventName)) {
            return controlEventHandler ? controlEventHandler(event) : event;
          }

          if (isReadOnlyValue(controlProps)) {
            return (0, _redux.compose)(dispatchBatchActions, (0, _persistEventWithCallback2.default)(controlEventHandler || _identity2.default))(event);
          }

          return (0, _redux.compose)(dispatchBatchActions, parser, _getValue2.default, (0, _persistEventWithCallback2.default)(controlEventHandler || _identity2.default))(event);
        };
      }
    }, {
      key: 'attachNode',
      value: function attachNode() {
        var node = findDOMNode && findDOMNode(this);

        if (node) this.node = node;
      }
    }, {
      key: 'validate',
      value: function validate() {
        var _props8 = this.props,
            model = _props8.model,
            modelValue = _props8.modelValue,
            fieldValue = _props8.fieldValue,
            validators = _props8.validators,
            errorValidators = _props8.errors,
            dispatch = _props8.dispatch;


        if (!validators && !errorValidators) return modelValue;
        if (!fieldValue) return modelValue;

        var fieldValidity = (0, _getValidity2.default)(validators, modelValue);
        var fieldErrors = (0, _getValidity2.default)(errorValidators, modelValue);

        var errors = validators ? (0, _merge2.default)((0, _invertValidity2.default)(fieldValidity), fieldErrors) : fieldErrors;

        if (!(0, _shallowEqual2.default)(errors, fieldValue.errors)) {
          dispatch(_actions2.default.setErrors(model, errors));
        }

        return modelValue;
      }
    }, {
      key: 'render',
      value: function render() {
        var _props9 = this.props,
            _props9$controlProps = _props9.controlProps,
            controlProps = _props9$controlProps === undefined ? emptyControlProps : _props9$controlProps,
            component = _props9.component,
            control = _props9.control;


        var mappedProps = (0, _omit2.default)(this.getMappedProps(), disallowedProps);

        // If there is an existing control, clone it
        if (control) {
          return (0, _react.cloneElement)(control, mappedProps, controlProps.children);
        }

        return (0, _react.createElement)(component, _extends({}, controlProps, mappedProps));
      }
    }]);

    return Control;
  }(_react.Component);

  process.env.NODE_ENV !== "production" ? Control.propTypes = propTypes : void 0;

  Control.defaultProps = {
    changeAction: s.actions.change,
    updateOn: 'change',
    asyncValidateOn: 'blur',
    parser: _identity2.default,
    controlProps: emptyControlProps,
    ignore: [],
    dynamic: false,
    mapProps: controlPropsMap.default,
    component: 'input'
  };

  function mapStateToProps(state, props) {
    var model = props.model,
        _props$controlProps = props.controlProps,
        controlProps = _props$controlProps === undefined ? (0, _omit2.default)(props, Object.keys(propTypes)) : _props$controlProps;


    var modelString = (0, _getModel2.default)(model, state);
    var fieldValue = s.getFieldFromState(state, modelString) || _initialFieldState2.default;

    return {
      model: modelString,
      modelValue: s.get(state, modelString),
      fieldValue: fieldValue,
      controlProps: controlProps
    };
  }

  var ConnectedControl = (0, _resolveModel2.default)((0, _reactRedux.connect)(mapStateToProps)(Control));

  /* eslint-disable react/prop-types */
  ConnectedControl.input = function (props) {
    return _react2.default.createElement(ConnectedControl, _extends({
      component: 'input',
      mapProps: _extends({}, controlPropsMap.default, props.mapProps)
    }, (0, _omit2.default)(props, 'mapProps')));
  };

  ConnectedControl.text = function (props) {
    return _react2.default.createElement(ConnectedControl, _extends({
      component: 'input',
      mapProps: _extends({}, controlPropsMap.text, props.mapProps)
    }, (0, _omit2.default)(props, 'mapProps')));
  };

  ConnectedControl.textarea = function (props) {
    return _react2.default.createElement(ConnectedControl, _extends({
      component: 'textarea',
      mapProps: _extends({}, controlPropsMap.textarea, props.mapProps)
    }, (0, _omit2.default)(props, 'mapProps')));
  };

  ConnectedControl.radio = function (props) {
    return _react2.default.createElement(ConnectedControl, _extends({
      component: 'input',
      type: 'radio',
      mapProps: _extends({}, controlPropsMap.radio, props.mapProps)
    }, (0, _omit2.default)(props, 'mapProps')));
  };

  ConnectedControl.checkbox = function (props) {
    return _react2.default.createElement(ConnectedControl, _extends({
      component: 'input',
      type: 'checkbox',
      mapProps: _extends({}, controlPropsMap.checkbox, props.mapProps),
      changeAction: props.changeAction || s.actions.checkWithValue
    }, (0, _omit2.default)(props, 'mapProps')));
  };

  ConnectedControl.file = function (props) {
    return _react2.default.createElement(ConnectedControl, _extends({
      component: 'input',
      type: 'file',
      mapProps: _extends({}, controlPropsMap.file, props.mapProps)
    }, (0, _omit2.default)(props, 'mapProps')));
  };

  ConnectedControl.select = function (props) {
    return _react2.default.createElement(ConnectedControl, _extends({
      component: 'select',
      mapProps: _extends({}, controlPropsMap.select, props.mapProps)
    }, (0, _omit2.default)(props, 'mapProps')));
  };

  ConnectedControl.reset = function (props) {
    return _react2.default.createElement(ConnectedControl, _extends({
      component: 'button',
      type: 'reset',
      mapProps: _extends({}, controlPropsMap.reset, props.mapProps)
    }, (0, _omit2.default)(props, 'mapProps')));
  };

  return ConnectedControl;
}

exports.createControlClass = createControlClass;
exports.default = createControlClass();