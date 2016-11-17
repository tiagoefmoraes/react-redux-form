'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _chai = require('chai');

var _src = require('../src');

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _toPath = require('lodash/toPath');

var _toPath2 = _interopRequireDefault(_toPath);

var _get = require('../src/utils/get');

var _get2 = _interopRequireDefault(_get);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

describe('formReducer() (V1)', function () {
  var _formActionsSpec;

  it('should exist as a function', function () {
    _chai.assert.isFunction(_src.formReducer);
  });

  var formActionsSpec = (_formActionsSpec = {}, _defineProperty(_formActionsSpec, _src.actionTypes.CHANGE, [{
    action: _src.actions.change,
    args: ['foo'],
    expectedField: {
      pristine: false,
      validated: false,
      value: 'foo'
    },
    expectedForm: {
      pristine: false
    }
  }, {
    action: _src.actions.change,
    args: [{ foo: 'bar' }],
    expectedField: {
      $form: {
        pristine: false,
        validated: false,
        value: { foo: 'bar' }
      }
    },
    expectedForm: {
      pristine: false
    }
  }, {
    action: _src.actions.change,
    args: [[1, 2, 3]],
    expectedField: {
      $form: {
        pristine: false,
        validated: false,
        value: [1, 2, 3]
      }
    },
    expectedForm: {
      pristine: false
    }
  }, {
    action: _src.actions.load,
    args: ['string'],
    expectedField: {
      pristine: true,
      value: 'string',
      initialValue: 'string'
    },
    expectedForm: {
      pristine: true
    }
  }, {
    action: _src.actions.load,
    args: [42],
    expectedField: {
      pristine: true,
      value: 42,
      initialValue: 42
    },
    expectedForm: {
      pristine: true
    }
  }, {
    action: _src.actions.load,
    args: [{ foo: 'bar' }],
    expectedField: {
      $form: {
        pristine: true,
        value: { foo: 'bar' },
        initialValue: { foo: 'bar' }
      },
      foo: {
        pristine: true,
        value: 'bar',
        initialValue: 'bar'
      }
    },
    expectedForm: {
      pristine: true
    }
  }]), _defineProperty(_formActionsSpec, _src.actionTypes.FOCUS, [{
    action: _src.actions.focus,
    args: [],
    expectedField: { focus: true }
  }]), _defineProperty(_formActionsSpec, _src.actionTypes.SET_PRISTINE, [{
    action: _src.actions.setPristine,
    args: [],
    expectedField: { pristine: true }
  }, {
    action: _src.actions.setPristine,
    initialState: {
      $form: _extends({}, _src.initialFieldState, {
        pristine: false
      }),
      name: _extends({}, _src.initialFieldState, {
        pristine: false
      })
    },
    args: [],
    expectedField: { pristine: true },
    expectedForm: { pristine: true }
  }, {
    action: _src.actions.setPristine,
    initialState: {
      $form: _extends({}, _src.initialFieldState, {
        pristine: false
      }),
      name: _extends({}, _src.initialFieldState, {
        pristine: false
      }),
      other: _extends({}, _src.initialFieldState, {
        pristine: true
      })
    },
    args: [],
    expectedField: { pristine: true },
    expectedForm: { pristine: true }
  }, {
    action: _src.actions.setPristine,
    initialState: {
      $form: _extends({}, _src.initialFieldState, {
        pristine: false
      }),
      name: _extends({}, _src.initialFieldState, {
        pristine: false
      }),
      other: _extends({}, _src.initialFieldState, {
        pristine: false
      })
    },
    args: [],
    expectedField: { pristine: true },
    expectedForm: { pristine: false }
  }]), _defineProperty(_formActionsSpec, _src.actionTypes.SET_DIRTY, [{
    action: _src.actions.setDirty,
    args: [],
    expectedField: { pristine: false }
  }]), _defineProperty(_formActionsSpec, _src.actionTypes.BLUR, [{
    action: _src.actions.blur,
    args: [],
    expectedField: {
      focus: false,
      touched: true
    }
  }, {
    label: 'after submitted',
    action: _src.actions.blur,
    initialState: {
      $form: _extends({}, _src.initialFieldState, {
        submitted: true,
        retouched: false
      }),
      name: _extends({}, _src.initialFieldState, {
        retouched: false
      })
    },
    expectedField: {
      focus: false,
      touched: true,
      retouched: true
    }
  }]), _defineProperty(_formActionsSpec, _src.actionTypes.SET_UNTOUCHED, [{
    action: _src.actions.setUntouched,
    args: [],
    expectedField: { touched: false }
  }]), _defineProperty(_formActionsSpec, _src.actionTypes.SET_TOUCHED, [{
    action: _src.actions.setTouched,
    args: [],
    expectedField: { touched: true }
  }]), _defineProperty(_formActionsSpec, _src.actionTypes.SET_PENDING, [{
    action: _src.actions.setPending,
    args: [],
    expectedForm: {
      pending: true,
      retouched: false
    },
    expectedField: {
      pending: true,
      submitted: false,
      submitFailed: false,
      retouched: false
    }
  }, {
    action: _src.actions.setPending,
    args: [],
    initialState: {
      $form: _extends({}, _src.initialFieldState, {
        retouched: true
      })
    },
    expectedForm: {
      pending: true
    },
    expectedField: {
      pending: true,
      submitted: false,
      submitFailed: false,
      retouched: false
    }
  }]), _defineProperty(_formActionsSpec, _src.actionTypes.SET_VALIDITY, [{
    action: _src.actions.setValidity,
    args: [{ foo: true }],
    expectedField: {
      validity: { foo: true },
      errors: { foo: false },
      validated: true
    }
  }, {
    action: _src.actions.setValidity,
    args: [{ foo: false }],
    expectedField: {
      validity: { foo: false },
      errors: { foo: true },
      validated: true
    }
  }, {
    action: _src.actions.setValidity,
    args: [{ foo: false, bar: true }],
    expectedField: {
      validity: { foo: false, bar: true },
      errors: { foo: true, bar: false },
      validated: true
    }
  }, {
    label: 'validating the form (invalid)',
    action: _src.actions.setValidity,
    model: 'user',
    args: [{ foo: false, bar: true }],
    expectedForm: {
      validity: { foo: false, bar: true },
      errors: { foo: true, bar: false },
      validated: true
    }
  }, {
    label: 'validating the form (valid)',
    action: _src.actions.setValidity,
    model: 'user',
    args: [{ foo: true, bar: true }],
    expectedForm: {
      validity: { foo: true, bar: true },
      errors: { foo: false, bar: false },
      validated: true
    }
  }]), _defineProperty(_formActionsSpec, _src.actionTypes.RESET_VALIDITY, [{
    action: _src.actions.resetValidity,
    model: 'user',
    initialState: {
      $form: _extends({}, _src.initialFieldState, {
        valid: false,
        validity: { foo: false },
        errors: { foo: true }
      }),
      name: _extends({}, _src.initialFieldState, {
        valid: false,
        validity: { required: false },
        errors: { required: true }
      })
    },
    expectedField: {
      validity: {},
      errors: {},
      valid: true
    },
    expectedForm: {
      validity: {},
      errors: {},
      valid: true
    },
    expectedSubField: {
      validity: {},
      errors: {},
      valid: true
    }
  }]), _defineProperty(_formActionsSpec, _src.actionTypes.SET_ERRORS, [{
    label: '1',
    action: _src.actions.setErrors,
    args: [{ foo: true }],
    expectedField: {
      validity: { foo: false },
      errors: { foo: true },
      validated: true
    }
  }, {
    label: '2',
    action: _src.actions.setErrors,
    args: [{ foo: false }],
    expectedField: {
      validity: { foo: true },
      errors: { foo: false },
      validated: true
    }
  }, {
    label: '3',
    action: _src.actions.setErrors,
    args: [{ foo: false, bar: true }],
    expectedField: {
      validity: { foo: true, bar: false },
      errors: { foo: false, bar: true },
      validated: true
    }
  }, {
    label: 'single string error message',
    action: _src.actions.setErrors,
    args: ['single error message'],
    expectedField: {
      errors: 'single error message'
    }
  }, {
    label: 'validating the form (invalid)',
    action: _src.actions.setErrors,
    model: 'user',
    args: [{ foo: false, bar: true }],
    expectedForm: {
      validity: { foo: true, bar: false },
      errors: { foo: false, bar: true },
      validated: true
    }
  }, {
    label: 'validating the form (invalid)',
    action: _src.actions.setErrors,
    model: 'user',
    args: [{ foo: true, bar: true }],
    expectedForm: {
      validity: { foo: false, bar: false },
      errors: { foo: true, bar: true },
      validated: true
    }
  }, {
    label: 'validating the form (valid)',
    action: _src.actions.setErrors,
    model: 'user',
    args: [{ foo: false, bar: false }],
    expectedForm: {
      validity: { foo: true, bar: true },
      errors: { foo: false, bar: false },
      validated: true
    }
  }]), _defineProperty(_formActionsSpec, _src.actionTypes.SET_FIELDS_VALIDITY, [{
    action: _src.actions.setFieldsValidity,
    model: 'user',
    args: [{ foo: false, bar: false }],
    expectedForm: function expectedForm(form) {
      return form.foo.errors === true && form.bar.errors === true;
    }
  }, {
    action: _src.actions.setFieldsValidity,
    model: 'user.deep',
    args: [{ foo: false, bar: false }],
    expectedForm: function expectedForm(form) {
      return form.deep.foo.errors === true && form.deep.bar.errors === true;
    }
  }, {
    action: _src.actions.setFieldsValidity,
    model: 'user',
    args: [{ foo: true, bar: true }, { errors: true }],
    expectedForm: function expectedForm(form) {
      return form.foo.errors === true && form.bar.errors === true;
    }
  }, {
    action: _src.actions.setFieldsValidity,
    model: 'user.deep',
    args: [{ foo: true, bar: true }, { errors: true }],
    expectedForm: function expectedForm(form) {
      return form.deep.foo.errors === true && form.deep.bar.errors === true;
    }
  }, {
    label: 'form-wide boolean validity',
    action: _src.actions.setFieldsValidity,
    model: 'user',
    args: [{ '': false }],
    expectedForm: function expectedForm(form) {
      return form.$form.errors === true && form.$form.valid === false;
    }
  }, {
    label: 'form-wide object errors validity',
    action: _src.actions.setFieldsValidity,
    model: 'user',
    initialState: {
      $form: _src.initialFieldState,
      name: _extends({}, _src.initialFieldState, {
        valid: false,
        validity: false,
        errors: true
      })
    },
    args: [{ '': { passMatch: true } }],
    expectedForm: function expectedForm(form) {
      return form.$form.validity.passMatch === true && form.$form.valid === false;
    }
  }]), _defineProperty(_formActionsSpec, _src.actionTypes.SET_SUBMITTED, [{
    action: _src.actions.setSubmitted,
    args: [],
    expectedForm: function expectedForm(form) {
      return (0, _src.form)(form).touched;
    },
    expectedField: {
      pending: false,
      submitted: true,
      touched: true,
      retouched: false
    }
  }]), _defineProperty(_formActionsSpec, _src.actionTypes.SET_SUBMIT_FAILED, [{
    action: _src.actions.setSubmitFailed,
    model: 'user',
    args: [],
    initialState: {
      $form: _src.initialFieldState,
      name: _src.initialFieldState,
      deep: {
        $form: _src.initialFieldState,
        foo: _src.initialFieldState,
        bar: _src.initialFieldState
      }
    },
    expectedForm: function expectedForm(form) {
      return (0, _src.form)(form).touched;
    },
    expectedField: {
      pending: false,
      submitted: false,
      submitFailed: true,
      touched: true,
      retouched: false
    },
    expectedSubField: {
      pending: false,
      submitted: false,
      submitFailed: true,
      touched: true,
      retouched: false
    }
  }]), _formActionsSpec);

  (0, _mapValues2.default)(formActionsSpec, function (tests, actionType) {
    return tests.forEach(function (_ref) {
      var action = _ref.action,
          _ref$args = _ref.args,
          args = _ref$args === undefined ? [] : _ref$args,
          expectedForm = _ref.expectedForm,
          expectedField = _ref.expectedField,
          expectedSubField = _ref.expectedSubField,
          _ref$initialState = _ref.initialState,
          initialState = _ref$initialState === undefined ? undefined : _ref$initialState,
          _ref$label = _ref.label,
          label = _ref$label === undefined ? '' : _ref$label,
          _ref$model = _ref.model,
          model = _ref$model === undefined ? 'user.name' : _ref$model;

      describe(actionType + ' action ' + label, function () {
        var modelPath = (0, _toPath2.default)(model);
        var localModelPath = modelPath.slice(1);
        var localFormPath = localModelPath.slice(0, -1);

        var reducer = (0, _src.formReducer)('user', { name: '' });
        var updatedState = reducer(initialState, action.apply(undefined, [model].concat(_toConsumableArray(args))));

        if (expectedField) {
          it('should properly set the field state', function () {
            var updatedFieldState = localModelPath.length ? (0, _get2.default)(updatedState, localModelPath) : updatedState.$form;

            _chai.assert.containSubset(updatedFieldState, expectedField);
          });
        }

        if (expectedSubField) {
          it('should properly set the state of the child fields', function () {
            var localFieldsPath = localModelPath.slice(0, -1);

            var updatedFieldsState = localFieldsPath.length ? (0, _get2.default)(updatedState, localFieldsPath) : updatedState;

            function checkSubFields(subFields) {
              (0, _mapValues2.default)(subFields, function (subField, key) {
                if (key === '$form') return;

                if (subField.$form) {
                  checkSubFields(subField);
                } else {
                  _chai.assert.containSubset(subField, expectedSubField);
                }
              });
            }

            checkSubFields(updatedFieldsState);
          });
        }

        if (expectedForm) {
          (function () {
            var form = (0, _get2.default)(updatedState, localFormPath);

            it('should properly set the form state', function () {
              if (typeof expectedForm === 'function') {
                _chai.assert.ok(expectedForm(form));
              } else {
                _chai.assert.containSubset(form.$form, expectedForm);
              }
            });
          })();
        }
      });
    });
  });

  describe('valid state of parent forms', function () {
    var reducer = (0, _src.formReducer)('test', {
      foo: 'foo',
      meta: {
        bar: 'deep'
      }
    });

    var invalidFoo = reducer(undefined, _src.actions.setValidity('test.foo', false));

    it('parent form should be invalid if child is invalid', function () {
      _chai.assert.isFalse(invalidFoo.$form.valid);
      _chai.assert.isFalse(invalidFoo.foo.valid);
    });

    var invalidFooBar = reducer(invalidFoo, _src.actions.setValidity('test.meta.bar', false));

    it('parent form should remain invalid if grandchild is invalid', function () {
      _chai.assert.isFalse(invalidFooBar.$form.valid);
      _chai.assert.isFalse(invalidFooBar.foo.valid);
      _chai.assert.isFalse(invalidFooBar.meta.bar.valid);
    });

    var focusedNewField = reducer(invalidFooBar, _src.actions.focus('test.meta.new', true));

    it('parent form should remain invalid if new field dynamically added', function () {
      _chai.assert.isFalse(focusedNewField.$form.valid);
      _chai.assert.isFalse(focusedNewField.foo.valid);
      _chai.assert.isFalse(focusedNewField.meta.bar.valid);
      _chai.assert.isTrue(focusedNewField.meta.new.valid);
    });

    var invalidFooValidBar = reducer(focusedNewField, _src.actions.setValidity('test.meta.bar', true));

    it('parent form should remain invalid if only grandchild is valid', function () {
      _chai.assert.isFalse(invalidFooValidBar.$form.valid);
      _chai.assert.isFalse(invalidFooValidBar.foo.valid);
      _chai.assert.isTrue(invalidFooValidBar.meta.$form.valid);
      _chai.assert.isTrue(invalidFooValidBar.meta.bar.valid);
    });

    var validFooValidBar = reducer(invalidFooValidBar, _src.actions.setValidity('test.foo', true));

    it('parent form should be valid if all descendants are valid', function () {
      _chai.assert.isTrue(validFooValidBar.foo.valid);
      _chai.assert.isTrue(validFooValidBar.meta.$form.valid);
      _chai.assert.isTrue(validFooValidBar.meta.bar.valid);
      _chai.assert.isTrue(validFooValidBar.$form.valid);
    });
  });

  describe('deep resetting', function () {
    var reducer = (0, _src.formReducer)('test', {
      foo: '',
      meta: {
        bar: ''
      }
    });

    var changedState = reducer(undefined, _src.actions.change('test', {
      foo: 'changed foo',
      meta: { bar: 'changed bar' }
    }));

    it('resetting a parent field should reset child fields in form', function () {
      var resetState = reducer(changedState, _src.actions.reset('test'));

      _chai.assert.equal(resetState.foo.value, '');
      _chai.assert.equal(resetState.meta.bar.value, '');
    });
  });

  describe('resetting after load', function () {
    var reducer = (0, _src.formReducer)('test', {
      foo: ''
    });

    var loadedState = reducer(undefined, _src.actions.load('test.foo', 'new initial'));

    it('should change the initial value for the field', function () {
      _chai.assert.equal(loadedState.foo.initialValue, 'new initial');
      _chai.assert.equal(loadedState.foo.value, 'new initial');
    });

    it('should change the initial value for the form', function () {
      _chai.assert.deepEqual(loadedState.$form.initialValue, { foo: 'new initial' });
      _chai.assert.deepEqual(loadedState.$form.value, { foo: 'new initial' });
    });

    it('resetting a parent field should reset child fields in form', function () {
      var resetState = reducer(loadedState, _src.actions.reset('test'));

      _chai.assert.deepEqual(resetState.$form.value, { foo: 'new initial' });
      _chai.assert.equal(resetState.foo.value, 'new initial');
    });
  });

  describe('resetting to null', function () {
    it('should work and not cause an infinite loop', function () {
      _chai.assert.doesNotThrow(function () {
        var reducer = (0, _src.formReducer)('foo', null);

        var state = reducer(undefined, _src.actions.reset('foo'));

        _chai.assert.containSubset(state, {
          value: null
        });
      });
    });
  });
});