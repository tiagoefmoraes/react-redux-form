'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = wrapWithModelResolver;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shallowEqual = require('./shallow-equal');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function resolveModel(model, parentModel) {
  if (parentModel) {
    if (model[0] === '.' || model[0] === '[') {
      return '' + parentModel + model;
    }

    if (typeof model === 'function') {
      return function (state) {
        return model(state, parentModel);
      };
    }
  }

  return model;
}

function wrapWithModelResolver(WrappedComponent) {
  var ResolvedModelWrapper = function (_Component) {
    _inherits(ResolvedModelWrapper, _Component);

    function ResolvedModelWrapper(props, context) {
      _classCallCheck(this, ResolvedModelWrapper);

      var _this = _possibleConstructorReturn(this, (ResolvedModelWrapper.__proto__ || Object.getPrototypeOf(ResolvedModelWrapper)).call(this, props, context));

      _this.model = context.model;
      _this.store = context.localStore;
      return _this;
    }

    _createClass(ResolvedModelWrapper, [{
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps) {
        return !(0, _shallowEqual2.default)(this.props, nextProps);
      }
    }, {
      key: 'render',
      value: function render() {
        var resolvedModel = resolveModel(this.props.model, this.model);

        return _react2.default.createElement(WrappedComponent, _extends({}, this.props, {
          model: resolvedModel,
          store: this.store || undefined
        }));
      }
    }]);

    return ResolvedModelWrapper;
  }(_react.Component);

  process.env.NODE_ENV !== "production" ? ResolvedModelWrapper.propTypes = {
    model: _react.PropTypes.any
  } : void 0;

  ResolvedModelWrapper.contextTypes = {
    model: _react.PropTypes.any,
    localStore: _react.PropTypes.shape({
      subscribe: _react.PropTypes.func,
      dispatch: _react.PropTypes.func,
      getState: _react.PropTypes.func
    })
  };

  return ResolvedModelWrapper;
}