'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _chai = require('chai');

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _capitalize = require('lodash/capitalize');

var _capitalize2 = _interopRequireDefault(_capitalize);

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _toPath = require('lodash/toPath');

var _toPath2 = _interopRequireDefault(_toPath);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _reduxTestStore = require('redux-test-store');

var _reduxTestStore2 = _interopRequireDefault(_reduxTestStore);

var _utils = require('./utils');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _src = require('../src');

var _immutable3 = require('../immutable');

var _isValid = require('../src/form/is-valid');

var _isValid2 = _interopRequireDefault(_isValid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint react/no-multi-comp:0 react/jsx-no-bind:0 */


var testContexts = {
  standard: {
    Field: _src.Field,
    actions: _src.actions,
    modelReducer: _src.modelReducer,
    formReducer: _src.formReducer,
    get: _get3.default,
    length: function length(value) {
      return value.length;
    }
  },
  immutable: {
    Field: _immutable3.Field,
    actions: _immutable3.actions,
    modelReducer: function modelReducer(model, initialState) {
      return (0, _immutable3.modelReducer)(model, _immutable2.default.fromJS(initialState));
    },
    formReducer: _immutable3.formReducer,
    get: function get(value, path) {
      var result = value.getIn((0, _toPath2.default)(path));
      try {
        return result.toJS();
      } catch (e) {
        return result;
      }
    },
    length: function length(value) {
      return value.size;
    }
  }
};

Object.keys(testContexts).forEach(function (testKey) {
  var testContext = testContexts[testKey];
  var Field = testContext.Field;
  var actions = testContext.actions;
  var modelReducer = testContext.modelReducer;
  var formReducer = testContext.formReducer;
  var get = testContext.get;
  var length = testContext.length;

  describe('<Field /> component', function () {
    var textFieldElements = [['input', 'text'], ['input', 'password'], ['input', 'number'], ['input', 'color'], ['textarea']];

    it('should wrap child components in a <div> if more than one', function () {
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        testForm: formReducer('test'),
        test: modelReducer('test', { foo: 'bar' })
      }));
      var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Field,
          { model: 'test.foo' },
          _react2.default.createElement('label', null),
          _react2.default.createElement('input', null)
        )
      ));

      var div = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'div');

      _chai.assert.ok(div);

      _chai.assert.equal(div.childNodes.length, 2);
    });

    it('should wrap child components in a <div> even if only one child', function () {
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        test: modelReducer('test', { foo: 'bar' }),
        testForm: formReducer('test')
      }));
      var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Field,
          { model: 'test.foo' },
          _react2.default.createElement('input', null)
        )
      ));

      _chai.assert.ok(_reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'div'));

      _chai.assert.ok(_reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input'));
    });

    it('should not wrap child components if only one child and null component', function () {
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        test: modelReducer('test', { foo: 'bar' }),
        testForm: formReducer('test')
      }));
      var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Field,
          { model: 'test.foo', component: null },
          _react2.default.createElement('input', null)
        )
      ));

      _chai.assert.throws(function () {
        return _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'div');
      });

      _chai.assert.ok(_reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input'));
    });

    it('should recursively handle nested control components', function () {
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        test: modelReducer('test', { foo: 'bar' }),
        testForm: formReducer('test')
      }));

      var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Field,
          { model: 'test.foo' },
          _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement('label', null),
            _react2.default.createElement('input', null)
          )
        )
      ));

      var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

      _chai.assert.equal(control.value, 'bar', 'should set control to initial value');

      control.value = 'testing';

      _reactAddonsTestUtils2.default.Simulate.change(control);

      _chai.assert.equal(get(store.getState().test, 'foo'), 'testing', 'should update state when control is changed');
    });

    it('should handle nested control components created with React.Children.only', function () {
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        test: modelReducer('test', { foo: 'bar' }),
        testForm: formReducer('test')
      }));

      var ChildOnlyComp = function (_React$Component) {
        _inherits(ChildOnlyComp, _React$Component);

        function ChildOnlyComp() {
          _classCallCheck(this, ChildOnlyComp);

          return _possibleConstructorReturn(this, (ChildOnlyComp.__proto__ || Object.getPrototypeOf(ChildOnlyComp)).apply(this, arguments));
        }

        _createClass(ChildOnlyComp, [{
          key: 'render',
          value: function render() {
            var child = _react2.default.Children.only(this.props.children);

            return _react2.default.createElement(
              'div',
              null,
              child
            );
          }
        }]);

        return ChildOnlyComp;
      }(_react2.default.Component);

      process.env.NODE_ENV !== "production" ? ChildOnlyComp.propTypes = {
        children: _react2.default.PropTypes.node
      } : void 0;

      var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Field,
          { model: 'test.foo' },
          _react2.default.createElement(
            ChildOnlyComp,
            null,
            _react2.default.createElement('input', null)
          )
        )
      ));

      var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

      _chai.assert.equal(control.value, 'bar', 'should set control to initial value');

      control.value = 'testing';

      _reactAddonsTestUtils2.default.Simulate.change(control);

      _chai.assert.equal(get(store.getState().test, 'foo'), 'testing', 'should update state when control is changed');
    });

    it('should bypass null/falsey children', function () {
      _chai.assert.doesNotThrow(function () {
        var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
          test: modelReducer('test', { foo: 'bar' }),
          testForm: formReducer('test')
        }));

        _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            { model: 'test.foo' },
            _react2.default.createElement('input', null),
            _react2.default.createElement(
              'div',
              null,
              false
            )
          )
        ));
      });
    });

    textFieldElements.forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          element = _ref2[0],
          type = _ref2[1];

      describe('with <' + element + ' ' + (type ? 'type="' + type + '"' : '') + '/>', function () {
        var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
          testForm: formReducer('test'),
          test: modelReducer('test', { foo: 'bar' })
        }));

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            { model: 'test.foo' },
            _react2.default.createElement(element, { type: type })
          )
        ));

        var node = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, element);

        it('should have an initial value from the model\'s initialState', function () {
          _chai.assert.equal(node.value, 'bar');
        });

        it('should dispatch a focus event when focused', function () {
          _reactAddonsTestUtils2.default.Simulate.focus(node);

          _chai.assert.containSubset(store.getState().testForm.foo, { focus: true });
        });

        it('should dispatch a blur event when blurred', function () {
          _reactAddonsTestUtils2.default.Simulate.blur(node);

          _chai.assert.containSubset(store.getState().testForm.foo, { focus: false });
        });

        it('should dispatch a change event when changed', function () {
          node.value = 'testing';

          _reactAddonsTestUtils2.default.Simulate.change(node);

          _chai.assert.equal(get(store.getState().test, 'foo'), 'testing');

          node.value = 'testing again';

          _reactAddonsTestUtils2.default.Simulate.change(node);

          _chai.assert.equal(get(store.getState().test, 'foo'), 'testing again');
        });
      });

      describe('with a controlled <' + element + ' ' + (type ? 'type="' + type + '"' : '') + ' /> component', function () {
        var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
          testForm: formReducer('test'),
          test: modelReducer('test', { foo: 'bar' })
        }));

        var TestField = (0, _reactRedux.connect)(function (s) {
          return s;
        })(function (props) {
          var test = props.test;


          return _react2.default.createElement(
            Field,
            { model: 'test.foo' },
            _react2.default.createElement(element, {
              type: type,
              value: get(test, 'foo')
            })
          );
        });

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(TestField, null)
        ));

        var node = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, element);

        it('should have the initial value of the state', function () {
          _chai.assert.equal(node.value, 'bar');
        });

        it('should update the value when the controlled input is changed', function () {
          _reactAddonsTestUtils2.default.Simulate.change(node, {
            target: { value: 'testing' }
          });

          _chai.assert.equal(node.value, 'testing');
        });
      });
    });

    describe('with <input type="radio" />', function () {
      var fields = {
        deep: _react2.default.createElement(
          Field,
          { model: 'test.foo' },
          _react2.default.createElement(
            'label',
            null,
            _react2.default.createElement('input', { type: 'radio', value: 'one' })
          ),
          _react2.default.createElement(
            'label',
            null,
            _react2.default.createElement('input', { type: 'radio', value: 'two' })
          )
        ),
        shallow: _react2.default.createElement(
          Field,
          { model: 'test.foo' },
          _react2.default.createElement('input', { type: 'radio', value: 'one' }),
          _react2.default.createElement('input', { type: 'radio', value: 'two' })
        )
      };

      (0, _mapValues2.default)(fields, function (fieldChild, key) {
        describe('type: ' + key, function () {
          var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
            testForm: formReducer('test'),
            test: modelReducer('test', { foo: 'two' })
          }));

          var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
            _reactRedux.Provider,
            { store: store },
            fieldChild
          ));

          var _TestUtils$scryRender = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(field, 'input'),
              _TestUtils$scryRender2 = _slicedToArray(_TestUtils$scryRender, 2),
              radioOne = _TestUtils$scryRender2[0],
              radioTwo = _TestUtils$scryRender2[1];

          it('should initially set the radio button matching the initial state to checked', function () {
            _chai.assert.equal(radioTwo.checked, true);
            _chai.assert.equal(radioOne.checked, false);
          });

          it('should give each radio input a name attribute of the model', function () {
            _chai.assert.equal(radioOne.name, 'test.foo');
            _chai.assert.equal(radioTwo.name, 'test.foo');
          });

          it('should dispatch a change event when changed', function () {
            _reactAddonsTestUtils2.default.Simulate.change(radioOne);

            _chai.assert.equal(get(store.getState().test, 'foo'), 'one');

            _reactAddonsTestUtils2.default.Simulate.change(radioTwo);

            _chai.assert.equal(get(store.getState().test, 'foo'), 'two');
          });

          it('should check the appropriate radio button when model is externally changed', function () {
            store.dispatch(actions.change('test.foo', 'one'));

            _chai.assert.equal(radioOne.checked, true);
            _chai.assert.equal(radioTwo.checked, false);

            store.dispatch(actions.change('test.foo', 'two'));

            _chai.assert.equal(radioTwo.checked, true);
            _chai.assert.equal(radioOne.checked, false);
          });

          it('should uncheck all radio buttons that are not equal to the value', function () {
            store.dispatch(actions.change('test.foo', 'three'));

            _chai.assert.equal(radioOne.checked, false);
            _chai.assert.equal(radioTwo.checked, false);
          });
        });
      });
    });

    describe('with <input type="checkbox" /> (single toggle)', function () {
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        testForm: formReducer('test'),
        test: modelReducer('test', {
          single: true
        })
      }));

      var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Field,
          { model: 'test.single' },
          _react2.default.createElement('input', { type: 'checkbox' })
        )
      ));

      var checkbox = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

      it('should initially set the checkbox to checked if the model is truthy', function () {
        _chai.assert.equal(checkbox.checked, true);
      });

      it('should give each radio input a name attribute of the model', function () {
        _chai.assert.equal(checkbox.name, 'test.single');
      });

      it('should dispatch a change event when changed', function () {
        _reactAddonsTestUtils2.default.Simulate.change(checkbox);

        _chai.assert.equal(get(store.getState().test, 'single'), false, 'false');

        _reactAddonsTestUtils2.default.Simulate.change(checkbox);

        _chai.assert.equal(get(store.getState().test, 'single'), true, 'true');
      });

      it('should check/uncheck the checkbox when model is externally changed', function () {
        store.dispatch(actions.change('test.single', true));

        _chai.assert.equal(checkbox.checked, true);

        store.dispatch(actions.change('test.single', false));

        _chai.assert.equal(checkbox.checked, false);
      });

      it('should uncheck the checkbox for any falsey value', function () {
        store.dispatch(actions.change('test.single', ''));

        _chai.assert.equal(checkbox.checked, false);
      });
    });

    describe('with <input type="checkbox" /> (multi toggle)', function () {
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        testForm: formReducer('test'),
        test: modelReducer('test', {
          foo: [1]
        })
      }));

      var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Field,
          { model: 'test.foo[]' },
          _react2.default.createElement('input', { type: 'checkbox', value: 1 }),
          _react2.default.createElement('input', { type: 'checkbox', value: 2 }),
          _react2.default.createElement('input', { type: 'checkbox', value: 3 })
        )
      ));

      var checkboxes = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(field, 'input');

      it('should initially set the checkbox to checked if the model is truthy', function () {
        _chai.assert.equal(checkboxes[0].checked, true);
      });

      it('should give each checkbox a name attribute of the model', function () {
        checkboxes.forEach(function (checkbox) {
          _chai.assert.equal(checkbox.name, 'test.foo[]');
        });
      });

      it('should dispatch a change event when changed', function () {
        _reactAddonsTestUtils2.default.Simulate.change(checkboxes[0]);

        _chai.assert.sameMembers(get(store.getState().test, 'foo'), [], 'all unchecked');

        _reactAddonsTestUtils2.default.Simulate.change(checkboxes[1]);

        _chai.assert.sameMembers(get(store.getState().test, 'foo'), [2], 'one checked');

        _reactAddonsTestUtils2.default.Simulate.change(checkboxes[0]);

        _chai.assert.sameMembers(get(store.getState().test, 'foo'), [1, 2], 'two checked');

        _reactAddonsTestUtils2.default.Simulate.change(checkboxes[2]);

        _chai.assert.sameMembers(get(store.getState().test, 'foo'), [1, 2, 3], 'all checked');

        _reactAddonsTestUtils2.default.Simulate.change(checkboxes[0]);

        _chai.assert.sameMembers(get(store.getState().test, 'foo'), [2, 3], 'one unchecked');
      });

      it('should check the appropriate checkboxes when model is externally changed', function () {
        store.dispatch(actions.change('test.foo', [1, 2]));

        _chai.assert.isTrue(checkboxes[0].checked);
        _chai.assert.isTrue(checkboxes[1].checked);
        _chai.assert.isFalse(checkboxes[2].checked);
      });
    });

    describe('with <input type="checkbox" /> (custom onChange)', function () {
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        testForm: formReducer('test'),
        test: modelReducer('test', {
          foo: true
        })
      }));

      var handleOnChange = _sinon2.default.spy(function (e) {
        return e;
      });

      var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Field,
          { model: 'test.foo' },
          _react2.default.createElement('input', { type: 'checkbox', onChange: handleOnChange })
        )
      ));

      var checkbox = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

      _reactAddonsTestUtils2.default.Simulate.change(checkbox);

      it('should call the custom onChange event handler', function () {
        _chai.assert.ok(handleOnChange.calledOnce);
      });

      it('should update the state as expected', function () {
        _chai.assert.isFalse(get(store.getState().test, 'foo'));
      });
    });

    describe('with <input type="file" />', function () {
      it('should update with an array of files', function () {
        var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
          testForm: formReducer('test'),
          test: modelReducer('test', { foo: [] })
        }));

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            { model: 'test.foo' },
            _react2.default.createElement('input', { type: 'file' })
          )
        ));

        var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        _reactAddonsTestUtils2.default.Simulate.change(input, {
          target: {
            type: 'file',
            files: [{ name: 'first.jpg' }, { name: 'second.jpg' }]
          }
        });

        _chai.assert.deepEqual(get(store.getState().test, 'foo'), [{ name: 'first.jpg' }, { name: 'second.jpg' }]);
      });
    });

    describe('with <select>', function () {
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        testForm: formReducer('test'),
        test: modelReducer('test', {
          foo: 'one'
        })
      }));

      var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Field,
          { model: 'test.foo' },
          _react2.default.createElement(
            'select',
            null,
            _react2.default.createElement('option', { value: 'one' }),
            _react2.default.createElement('option', { value: 'two' }),
            _react2.default.createElement('option', { value: 'three' }),
            _react2.default.createElement(
              'optgroup',
              null,
              _react2.default.createElement('option', { value: 'four' }),
              _react2.default.createElement('option', { value: 'five' }),
              _react2.default.createElement('option', { value: 'six' })
            )
          )
        )
      ));

      var select = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'select');
      var options = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(field, 'option');

      it('should select the option that matches the initial state of the model', function () {
        _chai.assert.isTrue(options[0].selected);
        _chai.assert.isFalse(options[1].selected);
        _chai.assert.equal(select.value, 'one');
      });

      it('should dispatch a change event when changed', function () {
        _reactAddonsTestUtils2.default.Simulate.change(options[1]);

        _chai.assert.equal(get(store.getState().test, 'foo'), 'two');
      });

      it('should select the appropriate <option> when model is externally changed', function () {
        store.dispatch(actions.change('test.foo', 'three'));

        _chai.assert.isTrue(options[2].selected);
        _chai.assert.equal(select.value, 'three');
      });

      it('should work with <optgroup>', function () {
        _reactAddonsTestUtils2.default.Simulate.change(options[3]);

        _chai.assert.isTrue(options[3].selected);
        _chai.assert.equal(get(store.getState().test, 'foo'), 'four');
      });
    });

    describe('with <select> (defaultValue)', function () {
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        testForm: formReducer('test'),
        test: modelReducer('test', {
          foo: undefined
        })
      }));

      var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Field,
          { model: 'test.foo' },
          _react2.default.createElement(
            'select',
            { defaultValue: 'two' },
            _react2.default.createElement('option', { value: 'one' }),
            _react2.default.createElement('option', { value: 'two' }),
            _react2.default.createElement('option', { value: 'three' }),
            _react2.default.createElement(
              'optgroup',
              null,
              _react2.default.createElement('option', { value: 'four' }),
              _react2.default.createElement('option', { value: 'five' }),
              _react2.default.createElement('option', { value: 'six' })
            )
          )
        )
      ));

      var select = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'select');
      var options = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(field, 'option');

      it('should select the option that matches the defaultValue attr' + 'if no initial value is provided', function () {
        _chai.assert.isFalse(options[0].selected);
        _chai.assert.isTrue(options[1].selected);
        _chai.assert.equal(select.value, 'two');
      });

      it('the store should have the correct initial value', function () {
        _chai.assert.equal(get(store.getState().test, 'foo'), 'two');
      });
    });

    describe('validators and validateOn property', function () {
      var reducer = formReducer('test');
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        testForm: reducer,
        test: modelReducer('test', {
          foo: '',
          blur: '',
          external: ''
        })
      }));

      it('should set the proper field state for validation', function () {
        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            {
              model: 'test.foo',
              validators: {
                good: function good() {
                  return true;
                },
                bad: function bad() {
                  return false;
                },
                custom: function custom(val) {
                  return val !== 'invalid';
                }
              }
            },
            _react2.default.createElement('input', { type: 'text' })
          )
        ));

        var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        control.value = 'valid';

        _reactAddonsTestUtils2.default.Simulate.change(control);

        _chai.assert.deepEqual(store.getState().testForm.foo.errors, {
          good: false,
          bad: true,
          custom: false
        });

        control.value = 'invalid';

        _reactAddonsTestUtils2.default.Simulate.change(control);

        _chai.assert.deepEqual(store.getState().testForm.foo.errors, {
          good: false,
          bad: true,
          custom: true
        });
      });

      it('should validate on blur when validateOn prop is "blur"', function () {
        var timesValidationCalled = 0;

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            {
              model: 'test.blur',
              validators: {
                good: function good() {
                  return true;
                },
                bad: function bad() {
                  return false;
                },
                custom: function custom(val) {
                  timesValidationCalled += 1;
                  return val !== 'invalid';
                }
              },
              validateOn: 'blur'
            },
            _react2.default.createElement('input', { type: 'text' })
          )
        ));

        var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        control.value = 'valid';

        _chai.assert.equal(timesValidationCalled, 1, 'validation should only be called once upon load');

        _reactAddonsTestUtils2.default.Simulate.change(control);

        _chai.assert.equal(timesValidationCalled, 1, 'validation should not be called upon change');

        _reactAddonsTestUtils2.default.Simulate.blur(control);

        _chai.assert.equal(timesValidationCalled, 2, 'validation should be called upon blur');

        _chai.assert.deepEqual(store.getState().testForm.blur.errors, {
          good: false,
          bad: true,
          custom: false
        }, 'should only validate upon blur');
      });

      it('should validate on external change', function () {
        var timesValidationCalled = 0;

        _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            {
              model: 'test.external',
              validators: {
                required: function required(val) {
                  timesValidationCalled += 1;
                  return val && val.length;
                }
              }
            },
            _react2.default.createElement('input', { type: 'text' })
          )
        ));

        _chai.assert.equal(timesValidationCalled, 1, 'validation called on load');

        _chai.assert.isFalse(store.getState().testForm.external.valid);

        store.dispatch(actions.change('test.external', 'valid'));

        _chai.assert.isTrue(store.getState().testForm.external.valid);

        _chai.assert.equal(timesValidationCalled, 2, 'validation called because of external change');
      });

      it('should send the proper model value to the validators', function () {
        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            {
              model: 'test.items[]',
              validators: {
                required: function required(val) {
                  return val && length(val);
                },
                values: function values(val) {
                  return val;
                }
              }
            },
            _react2.default.createElement('input', { type: 'checkbox', value: 'first' }),
            _react2.default.createElement('input', { type: 'checkbox', value: 'second' })
          )
        ));

        var checkboxes = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(field, 'input');

        _chai.assert.isFalse(store.getState().testForm.items.valid);

        _reactAddonsTestUtils2.default.Simulate.change(checkboxes[0]);

        _chai.assert.isTrue(store.getState().testForm.items.$form.valid);
        _chai.assert.isTrue(store.getState().testForm.items.$form.validity.required);

        _reactAddonsTestUtils2.default.Simulate.change(checkboxes[1]);
        _chai.assert.isTrue(store.getState().testForm.items.$form.validity.required);
        _chai.assert.isTrue(store.getState().testForm.items.$form.validity.values);

        _reactAddonsTestUtils2.default.Simulate.change(checkboxes[0]);
        _chai.assert.isTrue(store.getState().testForm.items.$form.validity.required);
        _chai.assert.isTrue(store.getState().testForm.items.$form.validity.values);

        _reactAddonsTestUtils2.default.Simulate.change(checkboxes[1]);
        _chai.assert.isFalse(store.getState().testForm.items.$form.validity.required);
        _chai.assert.isFalse(store.getState().testForm.items.$form.valid);
      });
    });

    describe('asyncValidators and asyncValidateOn property', function () {
      var reducer = formReducer('test');
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        testForm: reducer,
        test: modelReducer('test', {})
      }));

      it('should set the proper field state for a valid async validation', function (done) {
        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            {
              model: 'test.foo',
              asyncValidators: {
                testValid: function testValid(val, _done) {
                  return setTimeout(function () {
                    return _done(true);
                  }, 10);
                }
              },
              asyncValidateOn: 'blur'
            },
            _react2.default.createElement('input', { type: 'text' })
          )
        ));

        var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        var expectedStates = [function (state) {
          return state.focus === false;
        },

        // initially valid
        function (state) {
          return state.validating === true && (0, _isValid2.default)(state);
        },

        // true after validating
        function (state) {
          return state.validating === false && (0, _isValid2.default)(state);
        }];

        var actualStates = [];

        store.subscribe(function () {
          var state = store.getState();

          actualStates.push(state.testForm.foo);

          if (actualStates.length === expectedStates.length) {
            expectedStates.map(function (expectedFn, i) {
              return _chai.assert.ok(expectedFn(actualStates[i]), '' + i);
            });

            done();
          }
        });

        _reactAddonsTestUtils2.default.Simulate.blur(control);
      });

      it('should set the proper field state for an invalid async validation', function (done) {
        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            {
              model: 'test.foo',
              asyncValidators: {
                testValid: function testValid(val, _done) {
                  return setTimeout(function () {
                    return _done(false);
                  }, 10);
                }
              },
              asyncValidateOn: 'blur'
            },
            _react2.default.createElement('input', { type: 'text' })
          )
        ));

        var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        var expectedStates = [function (state) {
          return state.focus === false;
        },

        // initially valid
        function (state) {
          return state.validating === true && (0, _isValid2.default)(state);
        },

        // false after validating
        function (state) {
          return state.validating === false && !(0, _isValid2.default)(state);
        }];

        var actualStates = [];

        store.subscribe(function () {
          var state = store.getState();

          actualStates.push(state.testForm.foo);

          if (actualStates.length === expectedStates.length) {
            expectedStates.map(function (expectedFn, i) {
              return _chai.assert.ok(expectedFn(actualStates[i]), '' + i);
            });

            done();
          }
        });

        _reactAddonsTestUtils2.default.Simulate.blur(control);
      });
    });

    describe('sync and async validators', function () {
      var reducer = formReducer('test');
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        testForm: reducer,
        test: modelReducer('test', {})
      }));

      var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Field,
          {
            model: 'test.foo',
            validators: {
              required: function required(val) {
                return val && val.length;
              }
            },
            asyncValidators: {
              asyncValid: function asyncValid(_, asyncDone) {
                return asyncDone(false);
              }
            }
          },
          _react2.default.createElement('input', { type: 'text' })
        )
      ));

      var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

      it('async validation should not run when field is invalid', function () {
        input.value = '';
        _reactAddonsTestUtils2.default.Simulate.change(input);
        _reactAddonsTestUtils2.default.Simulate.blur(input);

        _chai.assert.deepEqual(store.getState().testForm.foo.validity, {
          required: false
        });

        _chai.assert.isUndefined(store.getState().testForm.foo.validity.asyncValid);
      });

      it('async validation should not override sync validity', function () {
        input.value = 'asdf';
        _reactAddonsTestUtils2.default.Simulate.change(input);
        _reactAddonsTestUtils2.default.Simulate.blur(input);

        _chai.assert.isDefined(store.getState().testForm.foo.validity.asyncValid);

        _chai.assert.deepEqual(store.getState().testForm.foo.validity, {
          required: true,
          asyncValid: false
        });
      });
    });

    describe('errors property', function () {
      var reducer = formReducer('test');

      it('should set the proper field state for errors', function () {
        var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
          testForm: reducer,
          test: modelReducer('test', {
            foo: ''
          })
        }));

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            {
              model: 'test.foo',
              errors: {
                length: function length(val) {
                  return val.length > 8 && 'too long';
                },
                valid: function valid(val) {
                  return val !== 'valid' && 'not valid';
                }
              }
            },
            _react2.default.createElement('input', { type: 'text' })
          )
        ));

        var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        control.value = 'valid';

        _reactAddonsTestUtils2.default.Simulate.change(control);

        _chai.assert.deepEqual(store.getState().testForm.foo.errors, {
          length: false,
          valid: false
        });

        control.value = 'invalid string';

        _reactAddonsTestUtils2.default.Simulate.change(control);

        _chai.assert.deepEqual(store.getState().testForm.foo.errors, {
          length: 'too long',
          valid: 'not valid'
        });
      });

      it('should only validate errors on blur if validateOn="blur"', function () {
        var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
          testForm: reducer,
          test: modelReducer('test', {
            foo: ''
          })
        }));

        var timesValidationCalled = 0;

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            {
              model: 'test.foo',
              errors: {
                length: function length(val) {
                  return val.length > 8 && 'too long';
                },
                valid: function valid(val) {
                  timesValidationCalled += 1;
                  return val !== 'valid' && 'not valid';
                }
              },
              validateOn: 'blur'
            },
            _react2.default.createElement('input', { type: 'text', required: true })
          )
        ));

        var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        _chai.assert.equal(timesValidationCalled, 1, 'validation should be called on load');

        control.value = 'valid';

        _reactAddonsTestUtils2.default.Simulate.change(control);

        _chai.assert.equal(timesValidationCalled, 1, 'validation should not be called again on change');

        _reactAddonsTestUtils2.default.Simulate.blur(control);

        _chai.assert.equal(timesValidationCalled, 2, 'validation should be called again on blur');

        _chai.assert.deepEqual(store.getState().testForm.foo.errors, {
          length: false,
          valid: false
        });

        control.value = 'invalid string';

        _reactAddonsTestUtils2.default.Simulate.change(control);

        _chai.assert.deepEqual(store.getState().testForm.foo.errors, {
          length: false,
          valid: false
        });

        _reactAddonsTestUtils2.default.Simulate.blur(control);

        _chai.assert.deepEqual(store.getState().testForm.foo.errors, {
          length: 'too long',
          valid: 'not valid'
        });
      });

      it('should handle a validator function for errors', function () {
        var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
          testForm: reducer,
          test: modelReducer('test', {
            foo: ''
          })
        }));

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            {
              model: 'test.foo',
              errors: function errors(val) {
                return !val && !val.length && 'Required';
              }
            },
            _react2.default.createElement('input', { type: 'text' })
          )
        ));

        var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        _chai.assert.equal(store.getState().testForm.foo.errors, 'Required');

        control.value = 'valid';

        _reactAddonsTestUtils2.default.Simulate.change(control);

        _chai.assert.deepEqual(store.getState().testForm.foo.errors, false);
      });
    });

    describe('dynamic components', function () {
      var reducer = formReducer('test');
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        testForm: reducer,
        test: modelReducer('test', {})
      }));

      var DynamicSelectForm = function (_React$Component2) {
        _inherits(DynamicSelectForm, _React$Component2);

        function DynamicSelectForm() {
          _classCallCheck(this, DynamicSelectForm);

          var _this2 = _possibleConstructorReturn(this, (DynamicSelectForm.__proto__ || Object.getPrototypeOf(DynamicSelectForm)).call(this));

          _this2.state = { options: [1, 2] };
          return _this2;
        }

        _createClass(DynamicSelectForm, [{
          key: 'render',
          value: function render() {
            var _this3 = this;

            return _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement('button', { onClick: function onClick() {
                  return _this3.setState({ options: [1, 2, 3] });
                } }),
              _react2.default.createElement(
                Field,
                { model: 'test.foo', dynamic: true },
                _react2.default.createElement(
                  'select',
                  null,
                  this.state.options.map(function (option, i) {
                    return _react2.default.createElement('option', { key: i, value: option });
                  })
                )
              )
            );
          }
        }]);

        return DynamicSelectForm;
      }(_react2.default.Component);

      it('should properly update dynamic components inside <Field>', function () {
        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(DynamicSelectForm, null)
        ));

        var options = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(field, 'option');
        var button = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'button');

        _chai.assert.equal(options.length, 2);

        _reactAddonsTestUtils2.default.Simulate.click(button);

        options = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(field, 'option');

        _chai.assert.equal(options.length, 3);
      });
    });

    describe('wrapper components with component property', function () {
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        test: modelReducer('test', {}),
        testForm: formReducer('test')
      }));

      it('should wrap children with specified component (string)', function () {
        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            { model: 'test.foo', component: 'div' },
            _react2.default.createElement('input', { type: 'text' })
          )
        ));

        var wrapper = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'div');

        _chai.assert.ok(wrapper);
      });

      it('should wrap children with specified component (class)', function () {
        var Wrapper = function (_React$Component3) {
          _inherits(Wrapper, _React$Component3);

          function Wrapper() {
            _classCallCheck(this, Wrapper);

            return _possibleConstructorReturn(this, (Wrapper.__proto__ || Object.getPrototypeOf(Wrapper)).apply(this, arguments));
          }

          _createClass(Wrapper, [{
            key: 'render',
            value: function render() {
              return _react2.default.createElement(
                'main',
                { className: 'wrapper' },
                this.props.children
              );
            }
          }]);

          return Wrapper;
        }(_react2.default.Component);

        process.env.NODE_ENV !== "production" ? Wrapper.propTypes = { children: _react.PropTypes.object } : void 0;

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            { model: 'test.foo', component: Wrapper },
            _react2.default.createElement('input', { type: 'text' })
          )
        ));

        var wrapper = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithClass(field, 'wrapper');

        _chai.assert.ok(wrapper);
      });

      it('should wrap children with specified component (function)', function () {
        /* eslint-disable react/prop-types */
        function Wrapper(props) {
          return _react2.default.createElement(
            'section',
            { className: 'wrapper' },
            props.children
          );
        }
        /* eslint-enable react/prop-types */

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            { model: 'test.foo', component: Wrapper },
            _react2.default.createElement('input', { type: 'text' })
          )
        ));

        var wrapper = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithClass(field, 'wrapper');

        _chai.assert.ok(wrapper);
      });

      it('should wrap children with a <div> when provided with className', function () {
        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            { model: 'test.foo', className: 'wrapper' },
            _react2.default.createElement('input', { type: 'text' })
          )
        ));

        var wrapper = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithClass(field, 'wrapper');

        _chai.assert.ok(wrapper);
      });
    });

    describe('updateOn prop', function () {
      var onEvents = ['change', 'focus', 'blur'];

      onEvents.forEach(function (onEvent) {
        var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
          test: modelReducer('test', { foo: 'initial' }),
          testForm: formReducer('test')
        }));

        it('should update the store when updateOn="' + onEvent + '"', function () {
          var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
            _reactRedux.Provider,
            { store: store },
            _react2.default.createElement(
              Field,
              {
                model: 'test.foo',
                updateOn: onEvent
              },
              _react2.default.createElement('input', { type: 'text' })
            )
          ));

          var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

          _chai.assert.equal(get(store.getState().test, 'foo'), 'initial');

          var testValue = onEvent + ' test';

          control.value = testValue;

          _chai.assert.equal(get(store.getState().test, 'foo'), 'initial', 'Model value should not change yet');

          _reactAddonsTestUtils2.default.Simulate[onEvent](control);

          _chai.assert.equal(get(store.getState().test, 'foo'), testValue);
        });
      });
    });

    describe('validation on load', function () {
      var reducer = formReducer('test');
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        testForm: reducer,
        test: modelReducer('test', {
          foo: 'invalid'
        })
      }));

      it('should always validate the model initially', function () {
        _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            {
              model: 'test.foo',
              validators: {
                initial: function initial(val) {
                  return val !== 'invalid';
                }
              }
            },
            _react2.default.createElement('input', { type: 'text' })
          )
        ));

        _chai.assert.containSubset(store.getState().testForm.foo, {
          validity: {
            initial: false
          },
          errors: {
            initial: true
          }
        });

        _chai.assert.isFalse(store.getState().testForm.foo.valid);
      });
    });

    describe('syncing control defaultValue on load', function () {
      var reducer = modelReducer('test', { foo: '' });
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        test: reducer,
        testForm: formReducer('test')
      }));

      it('should change the model to the defaultValue on load', function () {
        _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            {
              model: 'test.foo'
            },
            _react2.default.createElement('input', { type: 'text', defaultValue: 'testing' })
          )
        ));

        _chai.assert.equal(get(store.getState().test, 'foo'), 'testing');
      });
    });

    describe('change on enter', function () {
      var reducer = modelReducer('test');
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        test: reducer,
        testForm: formReducer('test')
      }));

      it('should change the model upon pressing Enter', function () {
        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            {
              model: 'test.foo',
              updateOn: 'blur'
            },
            _react2.default.createElement('input', { type: 'text' })
          )
        ));

        var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        control.value = 'testing';

        _reactAddonsTestUtils2.default.Simulate.keyPress(control, {
          key: 'Enter',
          keyCode: 13,
          which: 13
        });

        _chai.assert.equal(get(store.getState().test, 'foo'), 'testing');
      });
    });

    describe('changeAction prop', function () {
      var reducer = modelReducer('test', { foo: '' });
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        test: reducer,
        testForm: formReducer('test')
      }));

      it('should execute the custom change action', function () {
        var customChanged = false;

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            {
              model: 'test.foo',
              changeAction: function changeAction(model, value) {
                customChanged = true;
                return actions.change(model, value);
              }
            },
            _react2.default.createElement('input', { type: 'text' })
          )
        ));

        var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        control.value = 'testing';

        _reactAddonsTestUtils2.default.Simulate.change(control);

        _chai.assert.isTrue(customChanged);

        _chai.assert.equal(get(store.getState().test, 'foo'), 'testing');
      });
    });

    describe('event handlers on control', function () {
      var reducer = modelReducer('test', { foo: '', bar: '' });
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        test: reducer,
        testForm: formReducer('test')
      }));

      it('should execute the custom change action', function () {
        var onChangeFn = function onChangeFn(val) {
          return val;
        };
        var onChangeFnSpy = _sinon2.default.spy(onChangeFn);

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            {
              model: 'test.foo'
            },
            _react2.default.createElement('input', { type: 'text', onChange: onChangeFnSpy })
          )
        ));

        var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        control.value = 'testing';

        _reactAddonsTestUtils2.default.Simulate.change(control);

        _chai.assert.isTrue(onChangeFnSpy.calledOnce);
        _chai.assert.isObject(onChangeFnSpy.returnValues[0]);
        _chai.assert.equal(onChangeFnSpy.returnValues[0].constructor.name, 'SyntheticEvent');
        _chai.assert.equal(onChangeFnSpy.returnValues[0].target.value, 'testing');
      });

      it('should not execute custom onChange functions of unchanged controls', function () {
        var onChangeFn = function onChangeFn(val) {
          return val;
        };
        var onChangeFnSpy = _sinon2.default.spy(onChangeFn);

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              Field,
              {
                model: 'test.foo'
              },
              _react2.default.createElement('input', { type: 'text', onChange: onChangeFnSpy })
            ),
            _react2.default.createElement(
              Field,
              {
                model: 'test.bar'
              },
              _react2.default.createElement('input', { type: 'text' })
            )
          )
        ));

        var _TestUtils$scryRender3 = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(field, 'input'),
            _TestUtils$scryRender4 = _slicedToArray(_TestUtils$scryRender3, 2),
            _ = _TestUtils$scryRender4[0],
            controlBar = _TestUtils$scryRender4[1];

        controlBar.value = 'testing';

        _reactAddonsTestUtils2.default.Simulate.change(controlBar);

        _chai.assert.isFalse(onChangeFnSpy.called);
      });

      it('should only execute custom onChange function pertaining to the changed input', function () {
        var onChangeFnFoo = function onChangeFnFoo(val) {
          return val;
        };
        var onChangeFnBar = function onChangeFnBar(val) {
          return val;
        };
        var onChangeFnFooSpy = _sinon2.default.spy(onChangeFnFoo);
        var onChangeFnBarSpy = _sinon2.default.spy(onChangeFnBar);

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              Field,
              {
                model: 'test.foo'
              },
              _react2.default.createElement('input', { type: 'text', onChange: onChangeFnFooSpy })
            ),
            _react2.default.createElement(
              Field,
              {
                model: 'test.bar'
              },
              _react2.default.createElement('input', { type: 'text', onChange: onChangeFnBarSpy })
            )
          )
        ));

        var _TestUtils$scryRender5 = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(field, 'input'),
            _TestUtils$scryRender6 = _slicedToArray(_TestUtils$scryRender5, 2),
            _ = _TestUtils$scryRender6[0],
            controlBar = _TestUtils$scryRender6[1];

        controlBar.value = 'testing';

        _reactAddonsTestUtils2.default.Simulate.change(controlBar);

        _chai.assert.isFalse(onChangeFnFooSpy.called);
        _chai.assert.isTrue(onChangeFnBarSpy.called);
      });

      it('should persist and return the event even when not returned', function () {
        var onChangeFn = function onChangeFn() {};
        var onChangeFnSpy = _sinon2.default.spy(onChangeFn);

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            {
              model: 'test.foo'
            },
            _react2.default.createElement('input', { type: 'text', onChange: onChangeFnSpy }),
            _react2.default.createElement(
              'div',
              null,
              false
            )
          )
        ));

        var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        control.value = 'testing 2';

        _reactAddonsTestUtils2.default.Simulate.change(control);

        _chai.assert.isTrue(onChangeFnSpy.calledOnce);
        _chai.assert.isUndefined(onChangeFnSpy.returnValues[0]);
        _chai.assert.equal(get(store.getState().test, 'foo'), 'testing 2');
      });

      ['focus', 'blur'].forEach(function (event) {
        var eventHandler = 'on' + (0, _capitalize2.default)(event);

        it('should execute the custom ' + event + ' action', function () {
          var targetValue = void 0;

          var onEvent = function onEvent(e) {
            targetValue = e.target.value;

            return e;
          };

          var onEventSpy = _sinon2.default.spy(onEvent);

          var prop = _defineProperty({}, eventHandler, onEventSpy);

          var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
            _reactRedux.Provider,
            { store: store },
            _react2.default.createElement(
              Field,
              {
                model: 'test.foo'
              },
              _react2.default.createElement('input', _extends({ type: 'text' }, prop))
            )
          ));

          var control = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

          control.value = 'testing ' + event;

          _reactAddonsTestUtils2.default.Simulate[event](control);

          _chai.assert.isTrue(onEventSpy.calledOnce);
          _chai.assert.isObject(onEventSpy.returnValues[0]);
          _chai.assert.equal(onEventSpy.returnValues[0].constructor.name, 'SyntheticEvent');

          _chai.assert.equal(targetValue, 'testing ' + event);
        });
      });
    });

    // TODO: control
    it('should remove the item at the specified index of the array' + 'represented by the model', function (done) {
      var initialState = {
        foo: [{ val: 1 }, { val: 2 }, { val: 3 }]
      };

      var store = (0, _reduxTestStore2.default)((0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        form: formReducer('test', initialState),
        test: modelReducer('test', initialState)
      })), done);

      var index = 1;
      _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            Field,
            { model: 'test.foo.0.val' },
            _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement('label', null),
              _react2.default.createElement('input', { defaultValue: 'value' })
            )
          ),
          _react2.default.createElement(
            Field,
            { model: 'test.foo.1.val' },
            _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement('label', null),
              _react2.default.createElement('input', { defaultValue: 'value' })
            )
          ),
          _react2.default.createElement(
            Field,
            { model: 'test.foo.2.val' },
            _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement('label', null),
              _react2.default.createElement('input', { defaultValue: 'value' })
            )
          )
        )
      ));

      _chai.assert.equal(get(store.getState().test, 'foo').length, 3);

      store.when(_src.actionTypes.CHANGE, function (state) {
        _chai.assert.equal(get(state.test, 'foo').length, 2);
      });

      store.dispatch(actions.remove('test.foo', index));
    });

    // TODO: control
    it('should maintain child references', function (done) {
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        test: modelReducer('test', { foo: '' }),
        testForm: formReducer('test')
      }));

      var TestContainer = function (_React$Component4) {
        _inherits(TestContainer, _React$Component4);

        function TestContainer() {
          _classCallCheck(this, TestContainer);

          var _this5 = _possibleConstructorReturn(this, (TestContainer.__proto__ || Object.getPrototypeOf(TestContainer)).call(this));

          _this5.handleClick = _this5.handleClick.bind(_this5);
          _this5.assignRef = _this5.assignRef.bind(_this5);
          return _this5;
        }

        _createClass(TestContainer, [{
          key: 'handleClick',
          value: function handleClick() {
            _chai.assert.isDefined(this.node, 'reference should exist');
            done();
          }
        }, {
          key: 'assignRef',
          value: function assignRef(node) {
            this.node = node;
          }
        }, {
          key: 'render',
          value: function render() {
            return _react2.default.createElement(
              'main',
              { onClick: this.handleClick },
              _react2.default.createElement(
                Field,
                { model: 'test.foo' },
                _react2.default.createElement('input', { ref: this.assignRef })
              )
            );
          }
        }]);

        return TestContainer;
      }(_react2.default.Component);

      var foo = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(TestContainer, null)
      ));

      var main = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(foo, 'main');

      _reactAddonsTestUtils2.default.Simulate.click(main);
    });

    // TODO: control
    it('should not override custom value prop', function () {
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        test: modelReducer('test', { foo: '' }),
        testForm: formReducer('test')
      }));

      var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Field,
          { model: 'test.foo' },
          _react2.default.createElement('input', { value: 'defined' })
        )
      ));

      var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

      _chai.assert.equal(input.value, 'defined');

      input.value = 'changed';

      _reactAddonsTestUtils2.default.Simulate.change(input);

      _chai.assert.equal(input.value, 'defined', 'externally controlled input should not change');
    });

    // TODO: control
    it('should allow an input to remain uncontrolled with value={undefined}', function () {
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        test: modelReducer('test', { foo: '' }),
        testForm: formReducer('test')
      }));

      var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Field,
          { model: 'test.foo' },
          _react2.default.createElement('input', { value: undefined })
        )
      ));

      var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

      input.value = 'changed';

      _reactAddonsTestUtils2.default.Simulate.change(input);

      _chai.assert.equal(input.value, 'changed');
    });

    // TODO: control
    it('should render a Component with an idempotent mapStateToProps', function () {
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        test: modelReducer('test', { foo: '' }),
        testForm: formReducer('test')
      }));

      var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Field,
          { model: 'test.foo' },
          _react2.default.createElement('input', null)
        )
      ));
      var filter = function filter(_ref3) {
        var constructor = _ref3.constructor;
        return constructor.displayName === 'Connect(Control)';
      };
      var components = _reactAddonsTestUtils2.default.findAllInRenderedTree(field, filter);
      _chai.assert.lengthOf(components, 1, 'exactly one connected Control was rendered');

      var _components = _slicedToArray(components, 1),
          component = _components[0];

      var oldStateProps = component.stateProps;
      var didUpdate = component.updateStatePropsIfNeeded();
      var failures = Object.keys(component.stateProps).filter(function (k) {
        return component.stateProps[k] !== oldStateProps[k];
      });
      (0, _chai.assert)(!didUpdate, 'stateProps should not have changed, changed props: ' + failures.join(', '));
    });

    // TODO: control
    it('should not override the name prop', function () {
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        test: modelReducer('test', { foo: '' }),
        testForm: formReducer('test')
      }));

      var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Field,
          { model: 'test.foo' },
          _react2.default.createElement('input', { name: 'another[name]' })
        )
      ));

      var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

      _chai.assert.equal(input.name, 'another[name]');
    });

    // TODO: control
    it('should allow a custom mapProps() prop for use in Control', function () {
      var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
        test: modelReducer('test', { foo: 'initial' }),
        testForm: formReducer('test')
      }));

      var CustomInput = function CustomInput(props) {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement('input', props)
        );
      };

      var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          Field,
          {
            model: 'test.foo',
            mapProps: _src.controls.text
          },
          _react2.default.createElement(CustomInput, null)
        )
      ));

      var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

      _chai.assert.equal(input.value, 'initial');

      input.value = 'new value';

      _reactAddonsTestUtils2.default.Simulate.change(input);

      _chai.assert.equal(input.value, 'new value');
      _chai.assert.equal(get(store.getState().test, 'foo'), 'new value');
    });

    describe('unmounting', function () {
      it('should set the validity of the model to true when umounted', function () {
        var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
          test: modelReducer('test', { foo: '' }),
          testForm: formReducer('test', { foo: '' })
        }));

        var container = document.createElement('div');

        var field = _reactDom2.default.render(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            {
              model: 'test.foo'
            },
            _react2.default.createElement('input', null)
          )
        ), container);

        var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        store.dispatch(actions.setValidity('test.foo', false));
        _chai.assert.isFalse(store.getState().testForm.foo.valid);

        _reactDom2.default.unmountComponentAtNode(container);

        _chai.assert.isTrue(store.getState().testForm.foo.valid);
      });

      it('should only reset the validity of field-specific validators', function () {
        var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
          test: modelReducer('test', { foo: '' }),
          testForm: formReducer('test', { foo: '' })
        }));

        var container = document.createElement('div');

        var field = _reactDom2.default.render(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            {
              model: 'test.foo',
              validators: {
                internal: function internal() {
                  return false;
                }
              }
            },
            _react2.default.createElement('input', null)
          )
        ), container);

        var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        _chai.assert.isFalse(store.getState().testForm.foo.valid);

        store.dispatch(actions.setValidity('test.foo', _extends({}, store.getState().testForm.foo.validity, {
          external: false
        })));

        _chai.assert.isFalse(store.getState().testForm.foo.valid);

        _reactDom2.default.unmountComponentAtNode(container);

        _chai.assert.isFalse(store.getState().testForm.foo.valid);

        store.dispatch(actions.setValidity('test.foo', _extends({}, store.getState().testForm.foo.validity, {
          external: true
        })));

        _chai.assert.isTrue(store.getState().testForm.foo.valid);
      });
    });

    describe('with input type="reset"', function () {
      it('should reset the given model', function () {
        var store = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore)((0, _redux.combineReducers)({
          test: modelReducer('test', { foo: '' }),
          testForm: formReducer('test', { foo: '' })
        }));

        var container = document.createElement('div');

        var field = _reactDom2.default.render(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              Field,
              {
                model: 'test.foo'
              },
              _react2.default.createElement('input', { type: 'text' })
            ),
            _react2.default.createElement(
              Field,
              {
                model: 'test.foo'
              },
              _react2.default.createElement('input', { type: 'reset' })
            )
          )
        ), container);

        var _TestUtils$scryRender7 = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(field, 'input'),
            _TestUtils$scryRender8 = _slicedToArray(_TestUtils$scryRender7, 2),
            input = _TestUtils$scryRender8[0],
            reset = _TestUtils$scryRender8[1];

        input.value = 'changed';

        _reactAddonsTestUtils2.default.Simulate.change(input);

        _chai.assert.equal(get(store.getState().test, 'foo'), 'changed');

        _reactAddonsTestUtils2.default.Simulate.click(reset);

        _chai.assert.equal(get(store.getState().test, 'foo'), '');
      });
    });

    describe('with edge-case values', function () {
      it('should work with value = 0', function () {
        var store = (0, _redux.createStore)((0, _redux.combineReducers)({
          test: modelReducer('test', { foo: 0 }),
          testForm: formReducer('test')
        }), (0, _redux.applyMiddleware)(_reduxThunk2.default));

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            { model: 'test.foo' },
            _react2.default.createElement('input', { type: 'text' })
          )
        ));

        var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        _chai.assert.equal(input.value, '0');
      });
    });

    describe('external change with updateOn="blur"', function () {
      it('should update the input value on external change', function () {
        var store = (0, _redux.createStore)((0, _redux.combineReducers)({
          test: modelReducer('test', { foo: '' }),
          testForm: formReducer('test')
        }), (0, _redux.applyMiddleware)(_reduxThunk2.default));

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            { model: 'test.foo', updateOn: 'blur' },
            _react2.default.createElement('input', { type: 'text' })
          )
        ));

        var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        _chai.assert.equal(input.value, '');

        store.dispatch(actions.change('test.foo', 'external'));

        _chai.assert.equal(input.value, 'external');
      });
    });

    describe('whitelisting props', function () {
      it('should not pass extraneous props to child components', function () {
        var store = (0, _redux.createStore)((0, _redux.combineReducers)({
          test: modelReducer('test', { foo: 0 }),
          testform: formReducer('test')
        }), (0, _redux.applyMiddleware)(_reduxThunk2.default));

        var field = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            Field,
            {
              model: 'test.foo',
              className: 'test-class',
              style: { color: 'red' }
            },
            _react2.default.createElement('input', { type: 'text' })
          )
        ));

        var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

        _chai.assert.isNull(input.getAttribute('class'));
        _chai.assert.isNull(input.getAttribute('style'));
      });
    });

    describe('function as children', function () {
      var store = (0, _utils.testCreateStore)({
        test: modelReducer('test', { foo: 'bar' }),
        testForm: formReducer('test')
      });
      var field = (0, _utils.testRender)(_react2.default.createElement(
        Field,
        { model: 'test.foo' },
        function (fieldValue) {
          return _react2.default.createElement('input', {
            className: fieldValue.focus ? 'focused' : ''
          });
        }
      ), store);

      var input = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(field, 'input');

      it('treats the return value as expected with normal children', function () {
        _chai.assert.equal(input.value, 'bar');

        input.value = 'testing';
        _reactAddonsTestUtils2.default.Simulate.change(input);

        _chai.assert.equal(input.value, 'testing');
        _chai.assert.equal(get(store.getState().test, 'foo'), 'testing');
      });

      it('rerenders the function when the field value changes', function () {
        _chai.assert.throws(function () {
          return _reactAddonsTestUtils2.default.findRenderedDOMComponentWithClass(field, 'focused');
        });

        _reactAddonsTestUtils2.default.Simulate.focus(input);

        _chai.assert.isTrue(store.getState().testForm.foo.focus);

        _chai.assert.ok(_reactAddonsTestUtils2.default.findRenderedDOMComponentWithClass(field, 'focused'));
      });
    });
  });
});