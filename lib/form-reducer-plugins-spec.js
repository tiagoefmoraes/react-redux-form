'use strict';

var _chai = require('chai');

var _src = require('../src');

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _updateField = require('../src/utils/update-field');

var _updateField2 = _interopRequireDefault(_updateField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('formReducer plugins', function () {
  describe('customizing initialFieldState', function () {
    var plugin = function plugin(state, action, localPath) {
      if (action.type === 'CHANGE_STATUS') {
        return (0, _updateField2.default)(state, localPath, { status: action.status });
      }

      return state;
    };

    var reducer = (0, _src.formReducer)('test', { foo: 'bar' }, {
      plugins: [plugin],
      initialFieldState: { status: 'disabled' }
    });

    it('should be able to "extend" the initialFieldState', function () {
      var actual = reducer(undefined, { type: 'bogus' });

      _chai.assert.equal(actual.$form.status, 'disabled');
      _chai.assert.equal(actual.foo.status, 'disabled');
    });

    it('should be able to persist initialFieldState', function () {
      var actual1 = reducer(undefined, _src.actions.change('foo', 'one'));
      var actual2 = reducer(actual1, _src.actions.change('foo', 'two'));

      _chai.assert.equal(actual2.$form.status, 'disabled');
      _chai.assert.equal(actual2.foo.status, 'disabled');
    });

    it('should use the plugin with custom actions', function () {
      var action = {
        type: 'CHANGE_STATUS',
        model: 'test.foo',
        status: 'enabled'
      };
      var actual = reducer(undefined, action);

      _chai.assert.equal(actual.$form.status, 'disabled');
      _chai.assert.equal(actual.foo.status, 'enabled');
    });
  });

  describe('initialize plugin', function () {
    var store = (0, _redux.createStore)((0, _redux.combineReducers)({
      user: (0, _src.modelReducer)('user', {}),
      userForm: (0, _src.formReducer)('user', {})
    }, { user: { firstName: 'G', friends: [{ id: 1, name: 'George' }] } }), (0, _redux.applyMiddleware)(_reduxThunk2.default));

    it('should initialize missing fields', function () {
      store.dispatch(_src.actions.focus('user.firstName'));

      _chai.assert.containSubset(store.getState().userForm.firstName, {
        focus: true,
        model: 'user.firstName'
      });
    });

    it('should initialize missing parent fields', function () {
      store.dispatch(_src.actions.focus('user.friends[0].name'));

      _chai.assert.containSubset(store.getState().userForm.friends[0].name, {
        focus: true,
        model: 'user.friends.0.name'
      });

      _chai.assert.containSubset(store.getState().userForm.friends[0].$form, { model: 'user.friends.0' });

      _chai.assert.containSubset(store.getState().userForm.friends.$form, { model: 'user.friends' });

      _chai.assert.containSubset(store.getState().userForm.$form, { model: 'user' });
    });
  });
});