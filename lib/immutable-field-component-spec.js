'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _chai = require('chai');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _src = require('../src');

var _immutable3 = require('../immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('<Field> with Immutable.js', function () {
  var reducer = (0, _immutable3.modelReducer)('test', _immutable2.default.fromJS({ foo: 'bar' }));

  var store = (0, _redux.createStore)((0, _redux.combineReducers)({
    test: reducer,
    testForm: (0, _src.formReducer)('test', { foo: 'bar' })
  }), (0, _redux.applyMiddleware)(_reduxThunk2.default));

  var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(
      _immutable3.Field,
      { model: 'test.foo' },
      _react2.default.createElement('input', null)
    )
  ));

  var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

  it('control should have the immutable model value', function () {
    _chai.assert.equal(input.value, 'bar');
  });

  it('should be able to change the value', function () {
    input.value = 'new';

    _reactAddonsTestUtils2.default.Simulate.change(input);

    _chai.assert.equal(store.getState().test.get('foo'), 'new');
    _chai.assert.equal(input.value, 'new');
  });

  it('should be able to externally change the value', function () {
    store.dispatch(_src.actions.change('test.foo', 'external'));

    _chai.assert.equal(store.getState().test.get('foo'), 'external');
    _chai.assert.equal(input.value, 'external');
  });
});