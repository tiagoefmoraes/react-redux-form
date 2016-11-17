'use strict';

var _chai = require('chai');

var _src = require('../src');

describe('model action creators', function () {
  describe('actions.change()', function () {
    it('should return an action', function () {
      _chai.assert.containSubset(_src.actions.change('foo.bar', 'baz'), {
        model: 'foo.bar',
        multi: false,
        type: _src.actionTypes.CHANGE,
        value: 'baz'
      });
    });

    it('should detect when a model is multi-value', function () {
      _chai.assert.isTrue(_src.actions.change('multi.value[]', 'baz').multi);
    });
  });

  describe('actions.reset()', function () {
    it('should return an action', function () {
      _chai.assert.deepEqual(_src.actions.reset('foo.bar'), {
        type: _src.actionTypes.RESET,
        model: 'foo.bar'
      });
    });
  });

  describe('actions.xor() thunk', function () {
    it('should return a function that dispatches a change event', function (done) {
      var fn = _src.actions.xor('foo.bar', 2);
      var dispatch = function dispatch(action) {
        done(_chai.assert.equal(action.type, _src.actionTypes.CHANGE));
      };
      var getState = function getState() {
        return {
          foo: {
            bar: [1, 2, 3]
          }
        };
      };

      _chai.assert.isFunction(fn);

      fn(dispatch, getState);
    });

    it('should change a collection via symmetric difference', function (done) {
      var fn = _src.actions.xor('foo.bar', 2);
      var dispatch = function dispatch(action) {
        done(_chai.assert.deepEqual(action.value, [1, 3]));
      };
      var getState = function getState() {
        return {
          foo: {
            bar: [1, 2, 3]
          }
        };
      };

      fn(dispatch, getState);
    });
  });

  describe('actions.push() thunk', function () {
    it('should return a function that dispatches a change event', function (done) {
      var fn = _src.actions.push('foo.bar', 4);
      var dispatch = function dispatch(action) {
        done(_chai.assert.equal(action.type, _src.actionTypes.CHANGE));
      };
      var getState = function getState() {
        return {
          foo: {
            bar: [1, 2, 3]
          }
        };
      };

      _chai.assert.isFunction(fn);

      fn(dispatch, getState);
    });

    it('should change a collection by pushing an item to it', function (done) {
      var fn = _src.actions.push('foo.bar', 4);
      var dispatch = function dispatch(action) {
        done(_chai.assert.deepEqual(action.value, [1, 2, 3, 4]));
      };
      var getState = function getState() {
        return {
          foo: {
            bar: [1, 2, 3]
          }
        };
      };

      fn(dispatch, getState);
    });
  });

  describe('actions.toggle() thunk', function () {
    it('should return a function that dispatches a change event', function (done) {
      var fn = _src.actions.push('foo.bar');
      var dispatch = function dispatch(action) {
        done(_chai.assert.equal(action.type, _src.actionTypes.CHANGE));
      };
      var getState = function getState() {
        return {
          foo: {
            bar: false
          }
        };
      };

      _chai.assert.isFunction(fn);

      fn(dispatch, getState);
    });

    it('should toggle the model value', function (done) {
      var fn = _src.actions.toggle('foo.bar');
      var dispatch = function dispatch(action) {
        done(_chai.assert.isTrue(action.value));
      };
      var getState = function getState() {
        return {
          foo: {
            bar: false
          }
        };
      };

      fn(dispatch, getState);
    });
  });

  describe('actions.filter() thunk', function () {
    it('should return a function that dispatches a change event', function (done) {
      var fn = _src.actions.filter('foo.bar', function (i) {
        return i % 2 === 0;
      });
      var dispatch = function dispatch(action) {
        done(_chai.assert.equal(action.type, _src.actionTypes.CHANGE));
      };
      var getState = function getState() {
        return {
          foo: {
            bar: [1, 2, 3, 4]
          }
        };
      };

      _chai.assert.isFunction(fn);

      fn(dispatch, getState);
    });

    it('should change a collection by returning filtered items', function (done) {
      var fn = _src.actions.filter('foo.bar', function (i) {
        return i % 2 === 0;
      });
      var dispatch = function dispatch(action) {
        done(_chai.assert.deepEqual(action.value, [2, 4]));
      };
      var getState = function getState() {
        return {
          foo: {
            bar: [1, 2, 3, 4]
          }
        };
      };

      fn(dispatch, getState);
    });
  });

  describe('actions.map() thunk', function () {
    it('should return a function that dispatches a change event', function (done) {
      var fn = _src.actions.map('foo.bar', function (i) {
        return i * 2;
      });
      var dispatch = function dispatch(action) {
        done(_chai.assert.equal(action.type, _src.actionTypes.CHANGE));
      };
      var getState = function getState() {
        return {
          foo: {
            bar: [1, 2, 3]
          }
        };
      };

      _chai.assert.isFunction(fn);

      fn(dispatch, getState);
    });

    it('should change a collection by returning mapped items', function (done) {
      var fn = _src.actions.map('foo.bar', function (i) {
        return i * 2;
      });
      var dispatch = function dispatch(action) {
        done(_chai.assert.deepEqual(action.value, [2, 4, 6]));
      };
      var getState = function getState() {
        return {
          foo: {
            bar: [1, 2, 3]
          }
        };
      };

      fn(dispatch, getState);
    });
  });

  describe('actions.remove() thunk', function () {
    it('should return a function that dispatches a change event', function (done) {
      var fn = _src.actions.remove('foo.bar', 2);
      var dispatch = function dispatch(action) {
        done(_chai.assert.equal(action.type, _src.actionTypes.CHANGE));
      };
      var getState = function getState() {
        return {
          foo: {
            bar: [1, 2, 3, 4]
          }
        };
      };

      _chai.assert.isFunction(fn);

      fn(dispatch, getState);
    });

    it('should change a collection by removing the item at the specified index', function (done) {
      var fn = _src.actions.remove('foo.bar', 2);
      var dispatch = function dispatch(action) {
        done(_chai.assert.deepEqual(action.value, [1, 2, 4]));
      };
      var getState = function getState() {
        return {
          foo: {
            bar: [1, 2, 3, 4]
          }
        };
      };

      fn(dispatch, getState);
    });
  });

  describe('actions.move() thunk', function () {
    it('should return a function that dispatches a change event', function (done) {
      var fn = _src.actions.move('foo.bar', 2, 0);
      var dispatch = function dispatch(action) {
        done(_chai.assert.equal(action.type, _src.actionTypes.CHANGE));
      };
      var getState = function getState() {
        return {
          foo: {
            bar: [1, 2, 3, 4]
          }
        };
      };

      _chai.assert.isFunction(fn);

      fn(dispatch, getState);
    });

    it('should change a collection by moving the item to the specified index', function (done) {
      var fn = _src.actions.move('foo.bar', 2, 0);
      var dispatch = function dispatch(action) {
        done(_chai.assert.deepEqual(action.value, [3, 1, 2, 4]));
      };
      var getState = function getState() {
        return {
          foo: {
            bar: [1, 2, 3, 4]
          }
        };
      };

      fn(dispatch, getState);
    });

    it('should ignore invalid from index', function () {
      var fn = _src.actions.move('foo.bar', 4, 0);
      var dispatch = function dispatch() {
        _chai.assert.fail('Should not dispatch action');
      };
      var getState = function getState() {
        return {
          foo: {
            bar: [1, 2, 3, 4]
          }
        };
      };

      _chai.assert.throws(function () {
        return fn(dispatch, getState);
      }, 'Error moving array item: invalid bounds 4, 0');
    });

    it('should ignore invalid to index', function () {
      var fn = _src.actions.move('foo.bar', 3, 4);
      var dispatch = function dispatch() {
        _chai.assert.fail('Should not dispatch action');
      };
      var getState = function getState() {
        return {
          foo: {
            bar: [1, 2, 3, 4]
          }
        };
      };

      _chai.assert.throws(function () {
        return fn(dispatch, getState);
      }, 'Error moving array item: invalid bounds 3, 4');
    });
  });
});

describe('field action creators', function () {
  describe('actions.focus()', function () {
    it('should return an action', function () {
      _chai.assert.deepEqual(_src.actions.focus('foo.bar'), {
        type: _src.actionTypes.FOCUS,
        model: 'foo.bar',
        value: undefined
      });
    });
  });

  describe('actions.blur()', function () {
    it('should return an action', function () {
      _chai.assert.deepEqual(_src.actions.blur('foo.bar'), {
        type: _src.actionTypes.BLUR,
        model: 'foo.bar'
      });
    });
  });

  describe('actions.setPristine()', function () {
    it('should return an action', function () {
      _chai.assert.deepEqual(_src.actions.setPristine('foo.bar'), {
        type: _src.actionTypes.SET_PRISTINE,
        model: 'foo.bar'
      });
    });
  });

  describe('actions.setDirty()', function () {
    it('should return an action', function () {
      _chai.assert.deepEqual(_src.actions.setDirty('foo.bar'), {
        type: _src.actionTypes.SET_DIRTY,
        model: 'foo.bar'
      });
    });
  });

  describe('actions.setInitial()', function () {
    it('should return an action', function () {
      _chai.assert.deepEqual(_src.actions.setInitial('foo.bar'), {
        type: _src.actionTypes.SET_INITIAL,
        model: 'foo.bar'
      });
    });
  });

  describe('actions.setValidity()', function () {
    it('should return an action', function () {
      _chai.assert.deepEqual(_src.actions.setValidity('foo.bar', true), {
        type: _src.actionTypes.SET_VALIDITY,
        model: 'foo.bar',
        validity: true
      });
    });
  });
});