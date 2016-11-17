'use strict';

var _chai = require('chai');

var _reduxMockStore = require('redux-mock-store');

var _reduxMockStore2 = _interopRequireDefault(_reduxMockStore);

var _reduxTestStore = require('redux-test-store');

var _reduxTestStore2 = _interopRequireDefault(_reduxTestStore);

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _toPath = require('lodash/toPath');

var _toPath2 = _interopRequireDefault(_toPath);

var _icepick = require('icepick');

var _icepick2 = _interopRequireDefault(_icepick);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _utils = require('./utils');

var _isValid = require('../src/form/is-valid');

var _isValid2 = _interopRequireDefault(_isValid);

var _isPristine = require('../src/form/is-pristine');

var _isPristine2 = _interopRequireDefault(_isPristine);

var _isRetouched = require('../src/form/is-retouched');

var _isRetouched2 = _interopRequireDefault(_isRetouched);

var _src = require('../src');

var _immutable3 = require('../immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var testContexts = {
  standard: {
    actions: _src.actions,
    formReducer: _src.formReducer,
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
    actions: _immutable3.actions,
    formReducer: _immutable3.formReducer,
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
  var actions = testContext.actions;
  var formReducer = testContext.formReducer;
  var getInitialState = testContext.getInitialState;

  describe('field actions', function () {
    describe('change()', function () {
      it('should set the retouched property to true upon change after submit', function () {
        var initialState = getInitialState({ foo: '' });
        var reducer = formReducer('test', initialState);
        var state = reducer(undefined, actions.setSubmitted('test'));

        _chai.assert.containSubset(state.$form, {
          submitted: true,
          retouched: false
        }, 'not retouched yet');

        var changedState = reducer(state, actions.change('test.foo', 'new'));

        _chai.assert.containSubset(changedState.$form, {
          submitted: true
        });

        _chai.assert.isTrue((0, _isRetouched2.default)(changedState), 'form retouched after submit');

        _chai.assert.containSubset(changedState.foo, {
          retouched: true
        }, 'field retouched after submit');
      });

      it('should be able to set change an object to null without throwing an error', function () {
        // this is a weird one, but because $form is now
        // stuffed into the store in each model that is an object
        // the sub fields updater expects to find it.
        // so if it is studdenly changed to null,
        // the .$form breaks. in the code, we just added
        // a condition like subField && subField.$form.
        // this test will ensure that condition stays functioning
        var reducer = formReducer('foo', { a: {} });
        var didThrow = false;

        try {
          reducer(undefined, actions.change('foo.a', null));
        } catch (e) {
          didThrow = true;
        }

        _chai.assert.isFalse(didThrow);
      });
    });

    describe('reset()', function () {
      it('should set the field to the initial field state', function () {
        var reducer = formReducer('test');

        _chai.assert.containSubset(reducer(undefined, actions.reset('test.foo')).foo, _src.initialFieldState);
      });

      it('should be able to set the entire form to the initial state', function () {
        var initialState = getInitialState({ foo: 'bar' });
        var reducer = formReducer('test', initialState);

        var localInitialFormState = reducer(undefined, 'BOGUS / INITIAL STATE');

        _chai.assert.containSubset(reducer(undefined, actions.reset('test')), localInitialFormState);
      });

      it('should reset all errors on the field', function () {
        var reducer = formReducer('test');

        var stateWithErrors = reducer(undefined, actions.setValidity('test.foo', {
          valid: false,
          required: true
        }));

        _chai.assert.deepEqual(stateWithErrors.foo.errors, {
          valid: true,
          required: false
        });

        var stateAfterReset = reducer(stateWithErrors, actions.reset('test.foo'));

        _chai.assert.deepEqual(stateAfterReset.foo.errors, {});
      });

      it('should reset all errors on the form', function () {
        var reducer = formReducer('test');

        var stateWithErrors = reducer(undefined, actions.setValidity('test', {
          valid: false,
          required: true
        }));

        _chai.assert.deepEqual(stateWithErrors.$form.errors, {
          valid: true,
          required: false
        });

        _chai.assert.deepEqual(stateWithErrors.$form.validity, {
          valid: false,
          required: true
        });

        var stateAfterReset = reducer(stateWithErrors, actions.reset('test'));

        _chai.assert.deepEqual(stateAfterReset.$form.errors, {});
      });

      it('should intend to revalidate the field and subfields', function () {
        var reducer = formReducer('test', {
          button: {}
        });

        var resetState = reducer(undefined, actions.reset('test'));

        _chai.assert.include(resetState.$form.intents, { type: 'validate' });

        _chai.assert.include(resetState.button.$form.intents, { type: 'validate' }, 'should intend to revalidate subfields');
      });
    });

    describe('focus()', function () {
      it('should set the focus state of the field to true', function () {
        var reducer = formReducer('test');

        _chai.assert.containSubset(reducer(undefined, actions.focus('test.foo')).foo, {
          focus: true
        });
      });
    });

    describe('blur()', function () {
      it('should set the focus state to false', function () {
        var reducer = formReducer('test');

        _chai.assert.containSubset(reducer(undefined, actions.blur('test.foo')).foo, {
          focus: false,
          touched: true
        });
      });
    });

    describe('setPristine()', function () {
      it('should set the pristine state of the field to true', function () {
        var reducer = formReducer('test');

        _chai.assert.containSubset(reducer(undefined, actions.setPristine('test.foo')).foo, {
          pristine: true
        });
      });

      it('should set the pristine state of the form to true if every ' + 'field is pristine', function () {
        var reducer = formReducer('test');

        var actualPristine = reducer(undefined, actions.setPristine('test.foo'));

        _chai.assert.containSubset(actualPristine.$form, {
          pristine: true
        });

        var actualDirty = reducer(actualPristine, actions.setDirty('test.bar'));

        _chai.assert.isFalse((0, _isPristine2.default)(actualDirty));

        var actualMultiplePristine = reducer(actualDirty, actions.setPristine('test.bar'));

        _chai.assert.isTrue((0, _isPristine2.default)(actualMultiplePristine));
      });

      it('should be able to set the pristine state of the form and each field to true', function () {
        var reducer = formReducer('test');

        var dirtyFormAndField = reducer(undefined, actions.setDirty('test.foo'));

        var pristineFormAndField = reducer(dirtyFormAndField, actions.setPristine('test'));

        _chai.assert.isTrue((0, _isPristine2.default)(pristineFormAndField));

        _chai.assert.containSubset(pristineFormAndField.foo, {
          pristine: true
        });
      });
    });

    describe('setDirty()', function () {
      it('should set pristine state to false', function () {
        var reducer = formReducer('test');

        _chai.assert.containSubset(reducer(undefined, actions.setDirty('test.foo')).foo, {
          pristine: false
        });
      });

      it('should set pristine form state to false', function () {
        var reducer = formReducer('test');

        var actual = reducer(undefined, actions.setDirty('test.foo'));

        _chai.assert.isFalse((0, _isPristine2.default)(actual));
      });
    });

    describe('setPending()', function () {
      it('should set the pending state of the field to true ' + 'and the submitted state to false', function () {
        var reducer = formReducer('test');

        _chai.assert.containSubset(reducer(undefined, actions.setPending('test.foo')).foo, {
          pending: true,
          submitted: false
        });
      });

      it('should set the pending state of the field to the specified state', function () {
        var reducer = formReducer('test');

        var actualPending = reducer(undefined, actions.setPending('test.foo', true));

        _chai.assert.containSubset(actualPending.foo, {
          pending: true,
          submitted: false
        });

        var actualNotPending = reducer(actualPending, actions.setPending('test.foo', false));

        _chai.assert.containSubset(actualNotPending.foo, {
          pending: false,
          submitted: false
        });
      });

      it('should work with forms', function () {
        var reducer = formReducer('test');

        var actualPending = reducer(undefined, actions.setPending('test'));

        _chai.assert.containSubset(actualPending.$form, {
          pending: true,
          submitted: false
        });

        _chai.assert.containSubset(reducer(actualPending, actions.setPending('test', false)).$form, {
          pending: false,
          submitted: false
        });
      });
    });

    describe('setValidating()', function () {
      it('should set the validating state of the field to true', function () {
        var reducer = formReducer('test');

        _chai.assert.containSubset(reducer(undefined, actions.setValidating('test.foo')).foo, {
          validating: true,
          validated: false
        });
      });

      it('should set the validating state of the field to the specified state', function () {
        var reducer = formReducer('test');

        var actualValidating = reducer(undefined, actions.setValidating('test.foo', true));

        _chai.assert.containSubset(actualValidating.foo, {
          validating: true,
          validated: false
        });

        var actualNotValidating = reducer(actualValidating, actions.setValidating('test.foo', false));

        _chai.assert.containSubset(actualNotValidating.foo, {
          validating: false,
          validated: true
        });
      });

      it('should work with forms', function () {
        var reducer = formReducer('test');

        var actualValidating = reducer(undefined, actions.setValidating('test'));

        _chai.assert.containSubset(actualValidating.$form, {
          validating: true,
          validated: false
        });

        _chai.assert.containSubset(reducer(actualValidating, actions.setValidating('test', false)).$form, {
          validating: false,
          validated: true
        });
      });
    });

    describe('setSubmitted()', function () {
      it('should set the submitted state of the field to true ' + 'and the pending state to false', function () {
        var reducer = formReducer('test');

        _chai.assert.containSubset(reducer(undefined, actions.setSubmitted('test.foo')).foo, {
          submitted: true,
          pending: false,
          touched: true
        });
      });

      it('should set the submitted state of the field to the specified state', function () {
        var reducer = formReducer('test');

        var actualSubmitted = reducer(undefined, actions.setSubmitted('test.foo', true));

        _chai.assert.containSubset(actualSubmitted.foo, {
          submitted: true,
          pending: false,
          touched: true
        });

        var actualNotSubmitted = reducer(actualSubmitted, actions.setSubmitted('test.foo', false));

        _chai.assert.containSubset(actualNotSubmitted.foo, {
          submitted: false,
          pending: false,
          touched: true
        });
      });

      it('should work with forms', function () {
        var reducer = formReducer('test');

        var actualSubmitted = reducer(undefined, actions.setSubmitted('test', true));

        _chai.assert.containSubset(actualSubmitted.$form, {
          submitted: true,
          pending: false
        });

        var actualNotSubmitted = reducer(actualSubmitted, actions.setSubmitted('test', false));

        _chai.assert.containSubset(actualNotSubmitted.$form, {
          submitted: false,
          pending: false
        });
      });
    });

    describe('setSubmitFailed()', function () {
      it('should set the submitFailed property to true', function () {
        var reducer = formReducer('test');

        _chai.assert.containSubset(reducer(undefined, actions.setSubmitFailed('test')).$form, {
          submitFailed: true,
          submitted: false,
          pending: false
        });
      });

      it('should set the submitFailed property to false after successful submit', function () {
        var reducer = formReducer('test');
        var state = reducer(undefined, actions.setSubmitFailed('test'));

        _chai.assert.containSubset(reducer(state, actions.setSubmitted('test')).$form, {
          submitFailed: false,
          submitted: true,
          pending: false
        });
      });

      it('should set the submitFailed property to false while pending', function () {
        var reducer = formReducer('test');
        var state = reducer(undefined, actions.setSubmitFailed('test'));

        _chai.assert.containSubset(reducer(state, actions.setPending('test')).$form, {
          submitFailed: false,
          submitted: false,
          pending: true
        });
      });

      it('should set pending and submitted to false', function () {
        var reducer = formReducer('test');
        var state = reducer(undefined, actions.setPending('test'));

        _chai.assert.containSubset(reducer(state, actions.setSubmitFailed('test')).$form, {
          submitFailed: true,
          submitted: false,
          pending: false
        }, 'should set pending to false');

        state = reducer(state, actions.setSubmitted('test'));

        _chai.assert.containSubset(reducer(state, actions.setSubmitFailed('test')).$form, {
          submitFailed: true,
          submitted: false,
          pending: false
        }, 'should set submitted to false');
      });
    });

    describe('setTouched()', function () {
      it('should set the touched and blurred state of the field to true ' + 'and the untouched and focused state to false', function () {
        var reducer = formReducer('test');

        _chai.assert.containSubset(reducer(undefined, actions.setTouched('test.foo')).foo, {
          touched: true,
          retouched: false,
          focus: false
        });
      });

      it('should set the retouched property to true upon touch after submit', function () {
        var reducer = formReducer('test');
        var state = reducer(undefined, actions.setSubmitted('test'));

        _chai.assert.containSubset(state.$form, {
          submitted: true,
          retouched: false
        }, 'not retouched yet');

        _chai.assert.containSubset(reducer(state, actions.setTouched('test')).$form, {
          submitted: true,
          retouched: true
        }, 'retouched after submit');
      });

      it('should set the retouched property to true upon touch after submit failed', function () {
        var reducer = formReducer('test');
        var state = reducer(undefined, actions.setSubmitFailed('test'));

        _chai.assert.containSubset(state.$form, {
          submitted: false,
          submitFailed: true,
          retouched: false
        }, 'not retouched yet');

        _chai.assert.containSubset(reducer(state, actions.setTouched('test')).$form, {
          submitted: false,
          submitFailed: true,
          retouched: true
        }, 'retouched after submit failed');
      });

      it('should set the retouched property to false when pending', function () {
        var reducer = formReducer('test');
        var state = reducer(undefined, actions.setSubmitted('test'));

        state = reducer(state, actions.setTouched('test'));

        _chai.assert.containSubset(state.$form, {
          submitted: true,
          retouched: true
        }, 'retouched after submit and before pending');

        state = reducer(state, actions.setPending('test'));

        _chai.assert.containSubset(state.$form, {
          pending: true,
          submitted: false,
          retouched: false
        }, 'not retouched while pending');
      });
    });

    describe('setUntouched()', function () {
      it('should set the touched state to false', function () {
        var reducer = formReducer('test');

        _chai.assert.containSubset(reducer(undefined, actions.setUntouched('test.foo')).foo, {
          touched: false
        });
      });
    });

    describe('setValidity()', function () {
      it('should set the errors state of the field the inverse of a boolean validity', function () {
        var reducer = formReducer('test');

        _chai.assert.containSubset(reducer(undefined, actions.setValidity('test.foo', true)).foo, {
          errors: false
        });

        _chai.assert.containSubset(reducer(undefined, actions.setValidity('test.foo', false)).foo, {
          errors: true
        });
      });

      it('should set the errors state of the field the inverse of each value of a validity object', function () {
        var reducer = formReducer('test');

        var validity = {
          good: true,
          bad: false
        };

        _chai.assert.containSubset(reducer(undefined, actions.setValidity('test.foo', validity)).foo, {
          errors: {
            good: false,
            bad: true
          }
        });
      });

      it('should set the valid state to true if all values in validity object are true', function () {
        var reducer = formReducer('test');

        var validity = {
          one: true,
          two: true
        };

        var actualForm = reducer(undefined, actions.setValidity('test.foo', validity));

        _chai.assert.isTrue((0, _isValid2.default)(actualForm.foo));

        _chai.assert.isTrue((0, _isValid2.default)(actualForm), 'form should be valid if all fields are valid');
      });

      it('should set the valid state to false if any value in validity object are false', function () {
        var reducer = formReducer('test');

        var validity = {
          one: true,
          two: true,
          three: false
        };

        var actualForm = reducer(undefined, actions.setValidity('test.foo', validity));

        _chai.assert.isFalse((0, _isValid2.default)(actualForm.foo));

        _chai.assert.isFalse((0, _isValid2.default)(actualForm), 'form should be invalid if any fields are invalid');
      });

      it('should be able to set the validity of a form', function () {
        var reducer = formReducer('test');

        var validity = {
          foo: true,
          baz: false
        };

        var actual = reducer(undefined, actions.setValidity('test', validity));

        _chai.assert.containSubset(actual.$form, {
          errors: {
            foo: false,
            baz: true
          }
        });

        _chai.assert.isFalse((0, _isValid2.default)(actual));
      });

      it('should be able to set the validity to a non-boolean value', function () {
        var reducer = formReducer('test');

        var validity = {
          foo: 'truthy string',
          baz: null };

        var actual = reducer(undefined, actions.setValidity('test', validity));

        _chai.assert.containSubset(actual.$form, {
          validity: {
            foo: 'truthy string',
            baz: null
          },
          errors: {
            foo: false,
            baz: true
          }
        });

        _chai.assert.isFalse((0, _isValid2.default)(actual));

        actual = reducer(actual, actions.setValidity('test', {
          foo: false
        }));

        _chai.assert.containSubset(actual.$form, {
          validity: {
            foo: false
          },
          errors: {
            foo: true
          }
        });

        _chai.assert.isFalse((0, _isValid2.default)(actual));

        actual = reducer(actual, actions.setValidity('test', {
          foo: 'truthy string',
          baz: 100
        }));

        _chai.assert.containSubset(actual.$form, {
          validity: {
            foo: 'truthy string',
            baz: 100
          },
          errors: {
            foo: false,
            baz: false
          }
        });

        _chai.assert.isTrue((0, _isValid2.default)(actual));
      });

      it('should overwrite the previous validity', function () {
        var reducer = formReducer('test');

        var oldValidity = {
          existing: true
        };

        var oldState = reducer(undefined, actions.setValidity('test', oldValidity));

        _chai.assert.deepEqual(oldState.$form.validity, oldValidity);

        var newValidity = {
          foo: true,
          bar: false
        };

        var newState = reducer(oldState, actions.setValidity('test', newValidity));

        _chai.assert.deepEqual(newState.$form.validity, newValidity);

        _chai.assert.deepEqual(newState.$form.errors, {
          foo: false,
          bar: true
        });
      });
    });

    describe('setErrors()', function () {
      it('should set the errors state of the field', function () {
        var reducer = formReducer('test');

        var actualInvalid = reducer(undefined, actions.setErrors('test.foo', true));

        _chai.assert.containSubset(actualInvalid.foo, {
          errors: true,
          validity: false
        });

        _chai.assert.isFalse((0, _isValid2.default)(actualInvalid.foo));

        var actualValid = reducer(undefined, actions.setErrors('test.foo', false));

        _chai.assert.containSubset(actualValid.foo, {
          errors: false,
          validity: true
        });

        _chai.assert.isTrue((0, _isValid2.default)(actualValid.foo));
      });

      it('should set the errors state of the field', function () {
        var reducer = formReducer('test');

        var errors = {
          good: true,
          bad: false
        };

        var actual = reducer(undefined, actions.setErrors('test.foo', errors));

        _chai.assert.containSubset(actual.foo, {
          errors: {
            good: true,
            bad: false
          },
          validity: {
            good: false,
            bad: true
          }
        });

        _chai.assert.isFalse((0, _isValid2.default)(actual.foo));
      });

      it('should set the valid state to true if all values in error object are false', function () {
        var reducer = formReducer('test');

        var errors = {
          one: false,
          two: null,
          three: 0
        };

        var actualForm = reducer(undefined, actions.setErrors('test.foo', errors));

        _chai.assert.containSubset(actualForm.foo, {
          validity: {
            one: true,
            two: true,
            three: true
          }
        });

        _chai.assert.isTrue((0, _isValid2.default)(actualForm.foo));

        _chai.assert.isTrue((0, _isValid2.default)(actualForm), 'form should be valid if all fields are valid');
      });

      it('should set the valid state to false if any value in error object is true', function () {
        var reducer = formReducer('test');

        var errors = {
          one: true,
          two: false,
          three: false
        };

        var actualForm = reducer(undefined, actions.setErrors('test.foo', errors));

        _chai.assert.containSubset(actualForm.foo, {
          errors: {
            one: true,
            two: false,
            three: false
          },
          validity: {
            one: false,
            two: true,
            three: true
          }
        });

        _chai.assert.isFalse((0, _isValid2.default)(actualForm.foo));

        _chai.assert.isFalse((0, _isValid2.default)(actualForm), 'form should be invalid if any fields are invalid');
      });

      it('should be able to set the errors of a form', function () {
        var reducer = formReducer('test');

        var errors = {
          foo: true,
          baz: false
        };

        var actual = reducer(undefined, actions.setErrors('test', errors));

        _chai.assert.containSubset(actual.$form, {
          errors: {
            foo: true,
            baz: false
          }
        });

        _chai.assert.isFalse((0, _isValid2.default)(actual));
      });

      it('should be able to set the errors to an object', function () {
        var reducer = formReducer('test');

        var errors = {
          foo: 'foo is required',
          baz: null };

        var actual = reducer(undefined, actions.setErrors('test', errors));

        _chai.assert.containSubset(actual.$form, {
          validity: {
            foo: false,
            baz: true
          },
          errors: {
            foo: 'foo is required',
            baz: null
          }
        });

        _chai.assert.isFalse((0, _isValid2.default)(actual));

        actual = reducer(actual, actions.setErrors('test', {
          foo: false
        }));

        _chai.assert.containSubset(actual.$form, {
          validity: {
            foo: true
          },
          errors: {
            foo: false
          }
        });

        _chai.assert.isTrue((0, _isValid2.default)(actual));

        actual = reducer(actual, actions.setErrors('test', {
          foo: 'foo is required',
          baz: 'baz is also required'
        }));

        _chai.assert.containSubset(actual.$form, {
          validity: {
            foo: false,
            baz: false
          },
          errors: {
            foo: 'foo is required',
            baz: 'baz is also required'
          }
        });

        _chai.assert.isFalse((0, _isValid2.default)(actual));
      });

      it('should be able to set the errors to a string', function () {
        var reducer = formReducer('test');

        var errors = 'This whole thing is invalid';
        var fieldErrors = 'This field is invalid';

        var actual = reducer(undefined, actions.setErrors('test', errors));

        _chai.assert.containSubset(actual.$form, {
          errors: errors,
          validity: false
        });

        _chai.assert.isFalse((0, _isValid2.default)(actual));

        actual = reducer(actual, actions.setErrors('test', false));

        _chai.assert.containSubset(actual.$form, {
          errors: false,
          validity: true
        });

        _chai.assert.isTrue((0, _isValid2.default)(actual));

        var actualField = reducer(undefined, actions.setErrors('test.foo', fieldErrors));

        _chai.assert.containSubset(actualField.foo, {
          errors: fieldErrors,
          validity: false
        });

        _chai.assert.isFalse((0, _isValid2.default)(actualField));

        actualField = reducer(actualField, actions.setErrors('test.foo', false));

        _chai.assert.containSubset(actualField.foo, {
          errors: false,
          validity: true
        });

        _chai.assert.isTrue((0, _isValid2.default)(actualField));
      });
    });

    describe('resetValidity() and resetErrors()', function () {
      var reducer = formReducer('test');

      it('should reset the validity and errors of a field state', function () {
        var stateWithErrors = reducer(undefined, actions.setErrors('test.foo', { bar: true, baz: true }));

        _chai.assert.containSubset(stateWithErrors.foo, {
          validity: { bar: false, baz: false },
          errors: { bar: true, baz: true }
        });

        _chai.assert.isFalse((0, _isValid2.default)(stateWithErrors.foo));

        var actualState = reducer(stateWithErrors, actions.resetValidity('test.foo'));

        _chai.assert.containSubset(actualState.foo, {
          validity: {},
          errors: {}
        });

        _chai.assert.isTrue((0, _isValid2.default)(actualState.foo));
      });

      it('should reset the validity and errors of a form', function () {
        var stateWithErrors = reducer(undefined, actions.setErrors('test.foo', { bar: true, baz: true }));

        var stateWithMoreErrors = reducer(stateWithErrors, actions.setErrors('test.bar', { foo: true, baz: true }));

        _chai.assert.containSubset(stateWithMoreErrors.foo, {
          validity: { bar: false, baz: false },
          errors: { bar: true, baz: true }
        });

        _chai.assert.isFalse((0, _isValid2.default)(stateWithMoreErrors.foo));

        _chai.assert.containSubset(stateWithMoreErrors.bar, {
          validity: { foo: false, baz: false },
          errors: { foo: true, baz: true }
        });

        _chai.assert.isFalse((0, _isValid2.default)(stateWithMoreErrors.bar));

        var actualState = reducer(stateWithMoreErrors, actions.resetValidity('test'));

        _chai.assert.deepEqual(actualState.foo.validity, {});
        _chai.assert.deepEqual(actualState.foo.errors, {});

        _chai.assert.isTrue((0, _isValid2.default)(actualState));

        _chai.assert.containSubset(actualState.foo, {
          validity: {},
          errors: {}
        });

        _chai.assert.isTrue((0, _isValid2.default)(actualState.foo));

        _chai.assert.containSubset(actualState.bar, {
          validity: {},
          errors: {}
        });

        _chai.assert.isTrue((0, _isValid2.default)(actualState.bar));
      });

      it('should be aliased to resetErrors()', function () {
        var stateWithErrors = reducer(undefined, actions.setErrors('test.foo', { bar: true, baz: true }));

        var actualState = reducer(stateWithErrors, actions.resetErrors('test.foo'));

        _chai.assert.deepEqual(actualState.foo.validity, {});
        _chai.assert.deepEqual(actualState.foo.errors, {});

        _chai.assert.isTrue((0, _isValid2.default)(actualState.foo));
      });
    });

    describe('asyncSetValidity() (thunk)', function () {
      it('should asynchronously call setValidity() action', function (testDone) {
        var reducer = formReducer('test');
        var dispatch = function dispatch(action) {
          if (action.type === _src.actionTypes.SET_VALIDITY) {
            var actual = reducer(undefined, action);

            _chai.assert.isFalse((0, _isValid2.default)(actual));

            _chai.assert.containSubset(actual.foo, {
              errors: {
                good: false,
                bad: true
              }
            });

            testDone();
          }
        };

        var getState = function getState() {
          return {
            test: { foo: 5 }
          };
        };

        var validator = function validator(value, done) {
          return done({
            good: value > 4,
            bad: value > 5
          });
        };

        actions.asyncSetValidity('test.foo', validator)(dispatch, getState);
      });

      it('should work with forms to asynchronously call setValidity() action', function (testDone) {
        var reducer = formReducer('test');
        var dispatch = function dispatch(action) {
          if (action.type === _src.actionTypes.SET_VALIDITY) {
            var actual = reducer(undefined, action);

            _chai.assert.containSubset(actual.$form, {
              errors: {
                good: false,
                bad: true
              }
            });

            _chai.assert.isFalse((0, _isValid2.default)(actual));

            testDone();
          }
        };

        var getState = function getState() {
          return {
            test: { foo: 5 }
          };
        };

        var validator = function validator(_ref, done) {
          var foo = _ref.foo;
          return done({
            good: foo > 4,
            bad: foo > 5
          });
        };

        actions.asyncSetValidity('test', validator)(dispatch, getState);
      });

      it('should set validating to true for a field when validating, ' + 'and false when done validating', function (testDone) {
        var validatingStates = [];
        var executedActions = [];

        var reducer = formReducer('test');
        var dispatch = function dispatch(action) {
          executedActions.push(action);
          var state = reducer(undefined, action);

          if (action.type === _src.actionTypes.SET_VALIDATING) {
            validatingStates.push(action.validating);

            _chai.assert.equal(state.foo.validating, action.validating);
          } else if (action.type === _src.actionTypes.SET_VALIDITY) {
            validatingStates.push(state.foo.validating);

            testDone(_chai.assert.deepEqual(validatingStates, [true, false]));
          }
        };

        var getState = function getState() {
          return {};
        };

        var validator = function validator(_, done) {
          return done(true);
        };

        actions.asyncSetValidity('test.foo', validator)(dispatch, getState);
      });

      it('should set validating to true for a form when validating, and false when done validating', function (testDone) {
        var validatingStates = [];
        var executedActions = [];

        var reducer = formReducer('test');
        var dispatch = function dispatch(action) {
          executedActions.push(action);
          var state = reducer(undefined, action);

          if (action.type === _src.actionTypes.SET_VALIDATING) {
            validatingStates.push(action.validating);

            _chai.assert.equal(state.$form.validating, action.validating);
          } else if (action.type === _src.actionTypes.SET_VALIDITY) {
            validatingStates.push(state.$form.validating);

            testDone(_chai.assert.deepEqual(validatingStates, [true, false]));
          }
        };

        var getState = function getState() {
          return {};
        };

        var validator = function validator(_, done) {
          return done(true);
        };

        actions.asyncSetValidity('test', validator)(dispatch, getState);
      });
    });

    describe('submit() (thunk)', function () {
      var submitPromise = function submitPromise(value) {
        return new Promise(function (resolve, reject) {
          if (value.valid) {
            return resolve(true);
          }

          return reject(value.errors);
        });
      };

      var mockStore = (0, _reduxMockStore2.default)([_reduxThunk2.default]);

      it('should exist', function () {
        _chai.assert.isFunction(actions.submit);
      });

      it('should be able to resolve a form as valid', function (done) {
        var expectedActions = [{ type: _src.actionTypes.SET_PENDING, pending: true, model: 'test' }, {
          type: _src.actionTypes.BATCH,
          model: 'test',
          actions: [{ model: 'test', submitted: true, type: _src.actionTypes.SET_SUBMITTED }, { model: 'test', type: _src.actionTypes.SET_VALIDITY, validity: true }]
        }];

        var store = mockStore(function () {
          return {};
        }, expectedActions, done);

        store.dispatch(actions.submit('test', submitPromise({ valid: true })));
      });

      it('should submit errors when form promise is rejected', function (done) {
        var errors = {
          foo: 'Foo is invalid',
          bar: 'Bar is also invalid'
        };

        var expectedActions = [{ type: _src.actionTypes.SET_PENDING, pending: true, model: 'test' }, {
          type: _src.actionTypes.BATCH,
          model: 'test',
          actions: [{
            type: _src.actionTypes.SET_SUBMIT_FAILED,
            submitFailed: true,
            model: 'test'
          }, { type: _src.actionTypes.SET_ERRORS, errors: errors, model: 'test' }]
        }];

        var store = mockStore(function () {
          return {};
        }, expectedActions, done);

        store.dispatch(actions.submit('test', submitPromise({
          valid: false,
          errors: errors
        })));
      });

      it('should not submit if (optional) validators are invalid', function (done) {
        var store = (0, _reduxTestStore2.default)((0, _utils.testCreateStore)({
          testForm: formReducer('test')
        }), done);

        store.when(_src.actionTypes.SET_VALIDITY, function (_, action) {
          _chai.assert.containSubset(action, {
            model: 'test',
            validity: { foo: false }
          });
        });

        var action = actions.submit('test', new Promise(function (r) {
          return r(true);
        }), {
          validators: { foo: function foo() {
              return false;
            } }
        });

        store.dispatch(action);
      });

      it('should submit if (optional) validators are valid', function (done) {
        var store = (0, _reduxTestStore2.default)((0, _utils.testCreateStore)({
          testForm: formReducer('test')
        }), done);

        store.when(_src.actionTypes.SET_VALIDITY, function (_, action) {
          _chai.assert.containSubset(action, {
            model: 'test',
            validity: { foo: true }
          });
        });

        store.when(_src.actionTypes.SET_PENDING, function () {
          return true;
        });
        store.when(_src.actionTypes.SET_SUBMITTED, function (_, action) {
          _chai.assert.isTrue(action.submitted);
        });

        var action = actions.submit('test', new Promise(function (r) {
          return r(true);
        }), {
          validators: { foo: function foo() {
              return true;
            } }
        });

        store.dispatch(action);
      });

      it('should not submit if (optional) errors are invalid', function (done) {
        var store = (0, _reduxTestStore2.default)((0, _utils.testCreateStore)({
          testForm: formReducer('test')
        }), done);

        store.when(_src.actionTypes.SET_ERRORS, function (_, action) {
          _chai.assert.containSubset(action, {
            model: 'test',
            errors: { foo: true }
          });
        });

        var action = actions.submit('test', new Promise(function (r) {
          return r(true);
        }), {
          errors: { foo: function foo() {
              return true;
            } }
        });

        store.dispatch(action);
      });

      it('should submit if (optional) errors are valid', function (done) {
        var store = (0, _reduxTestStore2.default)((0, _utils.testCreateStore)({
          testForm: formReducer('test')
        }), done);

        store.when(_src.actionTypes.SET_VALIDITY, function (_, action) {
          _chai.assert.containSubset(action, {
            model: 'test',
            validity: { foo: true }
          });
        });

        store.when(_src.actionTypes.SET_PENDING, function () {
          return true;
        });
        store.when(_src.actionTypes.SET_SUBMITTED, function (_, action) {
          _chai.assert.isTrue(action.submitted);
        });

        var action = actions.submit('test', new Promise(function (r) {
          return r(true);
        }), {
          errors: { foo: function foo() {
              return false;
            } }
        });

        store.dispatch(action);
      });
    });

    describe('validate() (thunk)', function () {
      var mockStore = (0, _reduxMockStore2.default)([_reduxThunk2.default]);

      it('should set the validity of a model with a validator function', function (done) {
        var store = mockStore(function () {
          return { test: { foo: 'bar' } };
        }, [{ model: 'test.foo', type: _src.actionTypes.SET_VALIDITY, validity: false }, { model: 'test.foo', type: _src.actionTypes.SET_VALIDITY, validity: true }], done);

        store.dispatch(actions.validate('test.foo', function (val) {
          return val === 'invalid';
        }));
        store.dispatch(actions.validate('test.foo', function (val) {
          return val === 'bar';
        }));
      });

      it('should set the validity of a model with a validation object', function (done) {
        var store = mockStore(function () {
          return { test: { foo: 'bar' } };
        }, [{
          model: 'test.foo',
          type: _src.actionTypes.SET_VALIDITY,
          validity: {
            good: true,
            bad: false
          }
        }], done);

        var validators = {
          good: function good(val) {
            return val === 'bar';
          },
          bad: function bad(val) {
            return val === 'invalid';
          }
        };

        store.dispatch(actions.validate('test.foo', validators));
      });
    });

    describe('validateErrors() (thunk)', function () {
      var mockStore = (0, _reduxMockStore2.default)([_reduxThunk2.default]);

      it('should set the errors of a model with an error validator function', function (done) {
        var store = mockStore(function () {
          return { test: { foo: 'bar' } };
        }, [{ model: 'test.foo', type: _src.actionTypes.SET_ERRORS, errors: 'Value is invalid' }, { model: 'test.foo', type: _src.actionTypes.SET_ERRORS, errors: 'Value is invalid again' }, { model: 'test.foo', type: _src.actionTypes.SET_ERRORS, errors: false }], done);

        store.dispatch(actions.validateErrors('test.foo', function (val) {
          return val !== 'valid' && 'Value is invalid';
        }));
        store.dispatch(actions.validateErrors('test.foo', function (val) {
          return val !== 'valid' && 'Value is invalid again';
        }));
        store.dispatch(actions.validateErrors('test.foo', function (val) {
          return val !== 'bar' && 'This should return false';
        }));
      });

      it('should allow any type of value as the error value', function (done) {
        var store = mockStore(function () {
          return { test: { foo: 'bar' } };
        }, [{
          model: 'test.foo', type: _src.actionTypes.SET_ERRORS, errors: ['length', 'required']
        }], done);

        store.dispatch(actions.validateErrors('test.foo', function (val) {
          return val !== 'valid' && ['length', 'required'];
        }));
      });

      it('should set the errors of a model with an error object', function (done) {
        var store = mockStore(function () {
          return { test: { foo: 'bar' } };
        }, [{
          model: 'test.foo',
          type: _src.actionTypes.SET_ERRORS,
          errors: {
            good: false,
            bad: 'Value is not valid'
          }
        }], done);

        var errorValidators = {
          good: function good(val) {
            return val !== 'bar' && 'This should not show';
          },
          bad: function bad(val) {
            return val !== 'valid' && 'Value is not valid';
          }
        };

        store.dispatch(actions.validateErrors('test.foo', errorValidators));
      });
    });

    describe('validateFields() (thunk)', function () {
      var mockStore = (0, _reduxMockStore2.default)([_reduxThunk2.default]);

      it('should set the validity of multiple fields in the same form', function (done) {
        var store = mockStore(function () {
          return { test: { foo: 'bar' } };
        }, [{
          fieldsValidity: {
            '': true,
            foo: true,
            foo_invalid: false,
            foo_valid: true,
            with_keys: {
              key_invalid: false,
              key_valid: true
            }
          },
          model: 'test',
          type: _src.actionTypes.SET_FIELDS_VALIDITY,
          options: {}
        }], done);

        var action = actions.validateFields('test', {
          '': function _(val) {
            return val.foo === 'bar';
          },
          foo: function foo(val) {
            return val === 'bar';
          },
          foo_valid: function foo_valid() {
            return true;
          },
          foo_invalid: function foo_invalid() {
            return false;
          },
          with_keys: {
            key_valid: function key_valid() {
              return true;
            },
            key_invalid: function key_invalid() {
              return false;
            }
          }
        });

        store.dispatch(action);
      });
    });

    describe('validateFieldsErrors() (thunk)', function () {
      var mockStore = (0, _reduxMockStore2.default)([_reduxThunk2.default]);

      it('should set the errors of multiple fields in the same form', function (done) {
        var store = mockStore(function () {
          return { test: { foo: 'invalid' } };
        }, [{
          fieldsValidity: {
            '': 'form is invalid',
            foo: 'foo is invalid',
            foo_invalid: 'foo_invalid is invalid',
            foo_valid: false,
            with_keys: {
              key_invalid: 'key_invalid is invalid',
              key_valid: false
            }
          },
          model: 'test',
          type: _src.actionTypes.SET_FIELDS_VALIDITY,
          options: {
            errors: true
          }
        }], done);

        var action = actions.validateFieldsErrors('test', {
          '': function _(val) {
            return val.foo === 'invalid' && 'form is invalid';
          },
          foo: function foo(val) {
            return val === 'invalid' && 'foo is invalid';
          },
          foo_valid: function foo_valid() {
            return false;
          },
          foo_invalid: function foo_invalid() {
            return 'foo_invalid is invalid';
          },
          with_keys: {
            key_valid: function key_valid() {
              return false;
            },
            key_invalid: function key_invalid() {
              return 'key_invalid is invalid';
            }
          }
        });

        store.dispatch(action);
      });
    });

    describe('validSubmit() (thunk)', function () {
      it('should not submit a form if invalid', function (done) {
        var mockStore = (0, _reduxMockStore2.default)([_reduxThunk2.default]);
        var reducer = formReducer('test');

        var expectedActions = [{
          type: _src.actionTypes.NULL
        }];

        var store = mockStore(function () {
          return {
            testForm: reducer(undefined, actions.setValidity('test', false))
          };
        }, expectedActions, done);

        var action = actions.validSubmit('test', new Promise(function (r) {
          return r();
        }));

        store.dispatch(action);
      });

      it('should be able to resolve a form as valid', function (done) {
        var store = (0, _reduxTestStore2.default)((0, _utils.testCreateStore)({
          testForm: formReducer('test')
        }), done);

        store.when(_src.actionTypes.SET_PENDING, function () {
          return true;
        });

        store.when(_src.actionTypes.SET_SUBMITTED, function (_, action) {
          _chai.assert.containSubset(action, {
            model: 'test',
            submitted: true
          });
        });

        store.when(_src.actionTypes.SET_VALIDITY, function (_, action) {
          _chai.assert.containSubset(action, {
            model: 'test',
            validity: true
          });
        });

        var action = actions.validSubmit('test', new Promise(function (r) {
          return r(true);
        }));

        store.dispatch(action);
      });
    });
  });

  describe('submit() (thunk)', function () {
    it('should set the submitted state to true when submitted', function (done) {
      var store = (0, _reduxTestStore2.default)((0, _utils.testCreateStore)({
        testForm: formReducer('test')
      }), done);

      store.when(_src.actionTypes.SET_PENDING, function () {
        return true;
      });

      store.when(_src.actionTypes.SET_SUBMITTED, function (state) {
        _chai.assert.containSubset(state.testForm.$form, {
          submitted: true,
          pending: false
        });
      });

      store.when(_src.actionTypes.SET_VALIDITY, function (state) {
        _chai.assert.containSubset(state.testForm.$form, {
          submitted: true,
          pending: false
        });
      });

      var action = actions.submit('test', new Promise(function (r) {
        return setTimeout(function () {
          r(true);
        }, 1);
      }));

      store.dispatch(action);
    });
  });
});