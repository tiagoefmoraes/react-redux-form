'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFormClass = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _shallowEqual = require('../utils/shallow-equal');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _get2 = require('../utils/get');

var _get3 = _interopRequireDefault(_get2);

var _mapValues = require('../utils/map-values');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _merge = require('../utils/merge');

var _merge2 = _interopRequireDefault(_merge);

var _omit = require('../utils/omit');

var _omit2 = _interopRequireDefault(_omit);

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

var _getValidity = require('../utils/get-validity');

var _getValidity2 = _interopRequireDefault(_getValidity);

var _invertValidators = require('../utils/invert-validators');

var _invertValidators2 = _interopRequireDefault(_invertValidators);

var _isValidityInvalid = require('../utils/is-validity-invalid');

var _isValidityInvalid2 = _interopRequireDefault(_isValidityInvalid);

var _getForm = require('../utils/get-form');

var _getForm2 = _interopRequireDefault(_getForm);

var _getModel = require('../utils/get-model');

var _getModel2 = _interopRequireDefault(_getModel);

var _getField = require('../utils/get-field');

var _getField2 = _interopRequireDefault(_getField);

var _isValid = require('../form/is-valid');

var _deepCompareChildren = require('../utils/deep-compare-children');

var _deepCompareChildren2 = _interopRequireDefault(_deepCompareChildren);

var _containsEvent = require('../utils/contains-event');

var _containsEvent2 = _interopRequireDefault(_containsEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propTypes = {
  component: _react.PropTypes.any,
  validators: _react.PropTypes.object,
  errors: _react.PropTypes.object,
  validateOn: _react.PropTypes.oneOf(['change', 'submit']),
  model: _react.PropTypes.string.isRequired,
  modelValue: _react.PropTypes.any,
  formValue: _react.PropTypes.object,
  onSubmit: _react.PropTypes.func,
  dispatch: _react.PropTypes.func,
  children: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.node]),
  store: _react.PropTypes.shape({
    subscribe: _react.PropTypes.func,
    dispatch: _react.PropTypes.func,
    getState: _react.PropTypes.func
  }),
  onUpdate: _react.PropTypes.func,
  onChange: _react.PropTypes.func
};

var defaultStrategy = {
  get: _get3.default,
  getForm: _getForm2.default,
  actions: _actions2.default
};

function createFormClass() {
  var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultStrategy;

  var Form = function (_Component) {
    _inherits(Form, _Component);

    function Form(props) {
      _classCallCheck(this, Form);

      var _this = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, props));

      _this.handleSubmit = _this.handleSubmit.bind(_this);
      _this.handleReset = _this.handleReset.bind(_this);
      _this.handleValidSubmit = _this.handleValidSubmit.bind(_this);
      _this.handleInvalidSubmit = _this.handleInvalidSubmit.bind(_this);
      _this.attachNode = _this.attachNode.bind(_this);
      return _this;
    }

    _createClass(Form, [{
      key: 'getChildContext',
      value: function getChildContext() {
        return {
          model: this.props.model,
          localStore: this.props.store
        };
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.handleUpdate();
        this.handleChange();

        if ((0, _containsEvent2.default)(this.props.validateOn, 'change')) {
          this.validate(this.props, true);
        }
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if ((0, _containsEvent2.default)(nextProps.validateOn, 'change')) {
          this.validate(nextProps);
        }
      }
    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps) {
        return (0, _deepCompareChildren2.default)(this, nextProps);
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps) {
        this.handleIntents();

        if (!(0, _shallowEqual2.default)(prevProps.formValue, this.props.formValue)) {
          this.handleUpdate();
        }

        if (!(0, _shallowEqual2.default)(prevProps.modelValue, this.props.modelValue)) {
          this.handleChange();
        }
      }
    }, {
      key: 'handleUpdate',
      value: function handleUpdate() {
        if (this.props.onUpdate) {
          this.props.onUpdate(this.props.formValue);
        }
      }
    }, {
      key: 'handleChange',
      value: function handleChange() {
        if (this.props.onChange) {
          this.props.onChange(this.props.modelValue);
        }
      }
    }, {
      key: 'attachNode',
      value: function attachNode(node) {
        if (!node) return;

        this._node = node;

        this._node.submit = this.handleSubmit;
      }
    }, {
      key: 'validate',
      value: function validate(nextProps) {
        var initial = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var _props = this.props,
            model = _props.model,
            dispatch = _props.dispatch,
            formValue = _props.formValue,
            modelValue = _props.modelValue;
        var validators = nextProps.validators,
            errors = nextProps.errors;


        if (!formValue) return;

        if (!validators && !errors && modelValue !== nextProps.modelValue) {
          // If the form is invalid (due to async validity)
          // but its fields are valid and the value has changed,
          // the form should be "valid" again.
          if (!formValue.$form.valid && (0, _isValid.fieldsValid)(formValue)) {
            dispatch(s.actions.setValidity(model, true));
          }

          return;
        }

        var validatorsChanged = validators !== this.props.validators || errors !== this.props.errors;

        var errorValidators = validators ? (0, _merge2.default)((0, _invertValidators2.default)(validators), errors) : errors;

        var validityChanged = false;
        var fieldsErrors = {};

        // this is (internally) mutative for performance reasons.
        var validateField = function validateField(errorValidator, field) {
          if (!!~field.indexOf('[]')) {
            (function () {
              var _field$split = field.split('[]'),
                  _field$split2 = _slicedToArray(_field$split, 2),
                  parentModel = _field$split2[0],
                  childModel = _field$split2[1];

              var nextValue = parentModel ? s.get(nextProps.modelValue, parentModel) : nextProps.modelValue;

              nextValue.forEach(function (subValue, index) {
                validateField(errorValidator, parentModel + '[' + index + ']' + childModel);
              });
            })();
          } else {
            var _nextValue = field ? s.get(nextProps.modelValue, field) : nextProps.modelValue;

            var currentValue = field ? s.get(modelValue, field) : modelValue;

            var currentErrors = (0, _getField2.default)(formValue, field).errors;

            // If the validators didn't change, the validity didn't change.
            if (!initial && !validatorsChanged && _nextValue === currentValue) {
              fieldsErrors[field] = (0, _getField2.default)(formValue, field).errors;
            } else {
              var fieldErrors = (0, _getValidity2.default)(errorValidator, _nextValue);

              if (!validityChanged && !(0, _shallowEqual2.default)(fieldErrors, currentErrors)) {
                validityChanged = true;
              }

              fieldsErrors[field] = fieldErrors;
            }
          }
        };

        (0, _mapValues2.default)(errorValidators, validateField);

        // Compute form-level validity
        if (!fieldsErrors.hasOwnProperty('')) {
          fieldsErrors[''] = false;
          validityChanged = validityChanged || (0, _isValidityInvalid2.default)(formValue.$form.errors);
        }

        if (validityChanged) {
          dispatch(s.actions.setFieldsErrors(model, fieldsErrors));
        }
      }
    }, {
      key: 'handleValidSubmit',
      value: function handleValidSubmit() {
        var _props2 = this.props,
            dispatch = _props2.dispatch,
            model = _props2.model,
            modelValue = _props2.modelValue,
            onSubmit = _props2.onSubmit;


        dispatch(s.actions.setPending(model));

        if (onSubmit) onSubmit(modelValue);
      }
    }, {
      key: 'handleInvalidSubmit',
      value: function handleInvalidSubmit() {
        this.props.dispatch(s.actions.setSubmitFailed(this.props.model));
      }
    }, {
      key: 'handleReset',
      value: function handleReset(e) {
        if (e) e.preventDefault();

        this.props.dispatch(s.actions.reset(this.props.model));
      }
    }, {
      key: 'handleIntents',
      value: function handleIntents() {
        var _this2 = this;

        var _props3 = this.props,
            model = _props3.model,
            formValue = _props3.formValue,
            dispatch = _props3.dispatch;


        formValue.$form.intents.forEach(function (intent) {
          switch (intent.type) {
            case 'submit':
              {
                dispatch(s.actions.clearIntents(model, intent));

                if (formValue.$form.valid) {
                  _this2.handleValidSubmit();
                } else {
                  _this2.handleInvalidSubmit();
                }

                return;
              }

            default:
              return;
          }
        });
      }
    }, {
      key: 'handleSubmit',
      value: function handleSubmit(e) {
        if (e) e.preventDefault();

        var _props4 = this.props,
            model = _props4.model,
            modelValue = _props4.modelValue,
            formValue = _props4.formValue,
            onSubmit = _props4.onSubmit,
            dispatch = _props4.dispatch,
            validators = _props4.validators,
            errorValidators = _props4.errors;


        var formValid = formValue ? formValue.$form.valid : true;

        if (!validators && onSubmit && formValid) {
          onSubmit(modelValue);

          return modelValue;
        }

        var finalErrorValidators = validators ? (0, _merge2.default)((0, _invertValidators2.default)(validators), errorValidators) : errorValidators;

        var fieldsValidity = {};

        // this is (internally) mutative for performance reasons.
        var validateField = function validateField(validator, field) {
          if (!!~field.indexOf('[]')) {
            (function () {
              var _field$split3 = field.split('[]'),
                  _field$split4 = _slicedToArray(_field$split3, 2),
                  parentModel = _field$split4[0],
                  childModel = _field$split4[1];

              var fieldValue = parentModel ? s.get(modelValue, parentModel) : modelValue;

              fieldValue.forEach(function (subValue, index) {
                validateField(validator, parentModel + '[' + index + ']' + childModel);
              });
            })();
          } else {
            var _fieldValue = field ? s.get(modelValue, field) : modelValue;

            var fieldValidity = (0, _getValidity2.default)(validator, _fieldValue);

            fieldsValidity[field] = fieldValidity;
          }
        };

        (0, _mapValues2.default)(finalErrorValidators, validateField);

        // const fieldsValidity = mapValues(finalErrorValidators, (validator, field) => {
        //   const fieldValue = field
        //     ? s.get(modelValue, field)
        //     : modelValue;

        //   const fieldValidity = getValidity(validator, fieldValue);

        //   return fieldValidity;
        // });

        dispatch(s.actions.batch(model, [s.actions.setFieldsErrors(model, fieldsValidity), s.actions.addIntent(model, { type: 'submit' })]));

        return modelValue;
      }
    }, {
      key: 'render',
      value: function render() {
        var _props5 = this.props,
            component = _props5.component,
            children = _props5.children,
            formValue = _props5.formValue;


        var allowedProps = (0, _omit2.default)(this.props, Object.keys(propTypes));
        var renderableChildren = typeof children === 'function' ? children(formValue) : children;

        return _react2.default.createElement(component, _extends({}, allowedProps, {
          onSubmit: this.handleSubmit,
          onReset: this.handleReset,
          ref: this.attachNode
        }), renderableChildren);
      }
    }]);

    return Form;
  }(_react.Component);

  process.env.NODE_ENV !== "production" ? Form.propTypes = propTypes : void 0;

  Form.defaultProps = {
    validateOn: 'change',
    component: 'form'
  };

  Form.childContextTypes = {
    model: _react.PropTypes.any,
    localStore: _react.PropTypes.shape({
      subscribe: _react.PropTypes.func,
      dispatch: _react.PropTypes.func,
      getState: _react.PropTypes.func
    })
  };

  function mapStateToProps(state, _ref) {
    var model = _ref.model;

    var modelString = (0, _getModel2.default)(model, state);

    return {
      model: modelString,
      modelValue: s.get(state, modelString),
      formValue: s.getForm(state, modelString)
    };
  }

  return (0, _reactRedux.connect)(mapStateToProps)(Form);
}

exports.createFormClass = createFormClass;
exports.default = createFormClass();