'use strict';

var _chai = require('chai');

var _src = require('../src');

describe('selectors', function () {
  describe('form() selector', function () {
    it('should contain the actual form state as a subset', function () {
      var reducer = (0, _src.formReducer)('test', { foo: 'bar' });

      var actual = reducer(undefined, { type: null });

      _chai.assert.containSubset((0, _src.form)(actual), actual);
    });

    it('should get the valid state of the form', function () {
      var reducer = (0, _src.formReducer)('test', { foo: 'bar' });
      var invalidForm = reducer(undefined, _src.actions.setValidity('test.foo', false));
      var validForm = reducer(undefined, _src.actions.setValidity('test.foo', true));

      _chai.assert.isFalse((0, _src.form)(invalidForm).valid);
      _chai.assert.isTrue((0, _src.form)(validForm).valid);
    });

    it('should get the pending state of the form', function () {
      var reducer = (0, _src.formReducer)('test', { foo: 'bar' });
      var notPendingForm = reducer(undefined, _src.actions.setPending('test.foo', false));
      var pendingForm = reducer(undefined, _src.actions.setPending('test.foo', true));

      _chai.assert.isFalse((0, _src.form)(notPendingForm).pending);
      _chai.assert.isTrue((0, _src.form)(pendingForm).pending);
    });

    it('should get the retouched state of the form', function () {
      var reducer = (0, _src.formReducer)('test', { foo: 'bar' });
      var untouchedForm = reducer(undefined, _src.actions.setUntouched('test.foo'));
      var touchedForm = reducer(undefined, _src.actions.setTouched('test.foo'));

      _chai.assert.isFalse((0, _src.form)(untouchedForm).touched);
      _chai.assert.isTrue((0, _src.form)(touchedForm).touched);
    });

    it('should get the retouched state of the form', function () {
      var reducer = (0, _src.formReducer)('test', { foo: 'bar' });
      var nonRetouchedForm = reducer(undefined, { type: null });
      var submittedForm = reducer(nonRetouchedForm, _src.actions.setSubmitted('test'));
      var retouchedForm = reducer(submittedForm, _src.actions.setTouched('test.foo'));

      _chai.assert.isFalse((0, _src.form)(nonRetouchedForm).retouched);
      _chai.assert.isFalse((0, _src.form)(submittedForm).retouched);
      _chai.assert.isTrue((0, _src.form)(retouchedForm).retouched);
    });
  });
});