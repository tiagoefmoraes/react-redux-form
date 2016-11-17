'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _chai = require('chai');

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _src = require('../src');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var state = {
  deep: {
    deeper: [{ id: 1, value: 'foo' }, { id: 2, value: 'bar' }]
  }
};

describe('tracking', function () {
  describe('track() function', function () {
    it('should exist as a function', function () {
      _chai.assert.ok(_src.track);
      _chai.assert.isFunction(_src.track);
    });

    it('should return a function given a model and a predicate', function () {
      var predicate = function predicate(val) {
        return val.id === 1;
      };

      var tracker = (0, _src.track)('foo.bar', predicate);

      _chai.assert.isFunction(tracker);
    });

    it('should return a tracker that returns the first relevant model', function () {
      var predicate = function predicate(val) {
        return val.id === 2;
      };

      var tracker = (0, _src.track)('deep.deeper', predicate);
      var actual = tracker(state);

      _chai.assert.equal(actual, 'deep.deeper.1');
    });

    it('should return a tracker with Lodash predicate shorthands', function () {
      var tracker = (0, _src.track)('deep.deeper', { id: 2 });
      var actual = tracker(state);

      _chai.assert.equal(actual, 'deep.deeper.1');
    });
  });

  describe('track() with <Field model="...">', function () {
    var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
      testForm: (0, _src.formReducer)('test'),
      test: (0, _src.modelReducer)('test', state)
    }));

    var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(
        _src.Field,
        { model: (0, _src.track)('test.deep.deeper[].value', { id: 2 }) },
        _react2.default.createElement('input', { type: 'text' })
      )
    ));

    var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

    it('should successfully change the proper model', function () {
      input.value = 'testing';
      _reactAddonsTestUtils2.default.Simulate.change(input);

      _chai.assert.deepEqual(store.getState().test.deep.deeper[1], { id: 2, value: 'testing' });
    });
  });

  describe('track() with <Errors model="...">', function () {
    var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
      testForm: (0, _src.formReducer)('test'),
      test: (0, _src.modelReducer)('test', state)
    }));

    var tracker = (0, _src.track)('test.deep.deeper[].value', { id: 2 });

    var form = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(
        'form',
        null,
        _react2.default.createElement(
          _src.Field,
          {
            model: tracker,
            errors: {
              foo: function foo() {
                return 'foo error';
              },
              bar: function bar() {
                return 'bar error';
              }
            }
          },
          _react2.default.createElement('input', { type: 'text' })
        ),
        _react2.default.createElement(_src.Errors, { model: tracker })
      )
    ));

    var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(form, 'input');

    it('should successfully show errors for the proper model', function () {
      input.value = 'testing';
      _reactAddonsTestUtils2.default.Simulate.change(input);

      var errors = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(form, 'span');

      _chai.assert.lengthOf(errors, 2);
    });
  });

  describe('multiple levels of tracking', function () {
    var pred1 = function pred1(question) {
      return question.id === 1;
    };
    var pred2 = function pred2(choice) {
      return choice.id === 2;
    };

    var choices = [{ id: 1, prompt: 'wrong choice' }, { id: 2, prompt: 'right choice' }];

    var questions = [{ id: 1, choices: choices }, { id: 2, choices: [] }];

    var quizState = {
      quiz: { questions: questions }
    };

    it('should work with multiple predicates', function () {
      var tracker = (0, _src.track)('quiz.questions[].choices[].prompt', pred1, pred2);

      _chai.assert.equal(tracker(quizState), 'quiz.questions.0.choices.1.prompt');
    });

    it('should work with multiple predicates (no ending submodel)', function () {
      var tracker = (0, _src.track)('quiz.questions[].choices[]', pred1, pred2);

      _chai.assert.equal(tracker(quizState), 'quiz.questions.0.choices.1');
    });
  });
});