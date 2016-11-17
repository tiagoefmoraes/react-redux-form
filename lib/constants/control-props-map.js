'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createControlPropsMap = undefined;

var _isMulti = require('../utils/is-multi');

var _isMulti2 = _interopRequireDefault(_isMulti);

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createControlPropsMap() {
  function getTextValue(value) {
    if (typeof value === 'string') {
      return '' + value;
    } else if (typeof value === 'number') {
      return value;
    }

    return '';
  }

  function isChecked(props) {
    if ((0, _isMulti2.default)(props.model)) {
      if (!props.modelValue) return false;

      return props.modelValue.some(function (item) {
        return item === props.value;
      });
    }

    return !!props.modelValue;
  }

  var textPropsMap = {
    value: function value(props) {
      return !props.defaultValue && !props.hasOwnProperty('value') ? getTextValue(props.viewValue) : props.value;
    },
    name: function name(props) {
      return props.name || props.model;
    },
    onChange: function onChange(_ref) {
      var _onChange = _ref.onChange;
      return _onChange;
    },
    onBlur: function onBlur(_ref2) {
      var _onBlur = _ref2.onBlur;
      return _onBlur;
    },
    onFocus: function onFocus(_ref3) {
      var _onFocus = _ref3.onFocus;
      return _onFocus;
    },
    onKeyPress: function onKeyPress(_ref4) {
      var _onKeyPress = _ref4.onKeyPress;
      return _onKeyPress;
    }
  };

  return {
    default: textPropsMap,
    checkbox: {
      name: function name(props) {
        return props.name || props.model;
      },
      checked: function checked(props) {
        return props.defaultChecked ? props.checked : isChecked(props);
      },
      onChange: function onChange(_ref5) {
        var _onChange2 = _ref5.onChange;
        return _onChange2;
      },
      onBlur: function onBlur(_ref6) {
        var _onBlur2 = _ref6.onBlur;
        return _onBlur2;
      },
      onFocus: function onFocus(_ref7) {
        var _onFocus2 = _ref7.onFocus;
        return _onFocus2;
      },
      onKeyPress: function onKeyPress(_ref8) {
        var _onKeyPress2 = _ref8.onKeyPress;
        return _onKeyPress2;
      }
    },
    radio: {
      name: function name(props) {
        return props.name || props.model;
      },
      checked: function checked(props) {
        return props.defaultChecked ? props.checked : props.modelValue === props.value;
      },
      value: function value(props) {
        return props.value;
      },
      onChange: function onChange(_ref9) {
        var _onChange3 = _ref9.onChange;
        return _onChange3;
      },
      onBlur: function onBlur(_ref10) {
        var _onBlur3 = _ref10.onBlur;
        return _onBlur3;
      },
      onFocus: function onFocus(_ref11) {
        var _onFocus3 = _ref11.onFocus;
        return _onFocus3;
      },
      onKeyPress: function onKeyPress(_ref12) {
        var _onKeyPress3 = _ref12.onKeyPress;
        return _onKeyPress3;
      }
    },
    select: {
      name: function name(props) {
        return props.name || props.model;
      },
      value: function value(props) {
        return props.modelValue;
      },
      onChange: function onChange(_ref13) {
        var _onChange4 = _ref13.onChange;
        return _onChange4;
      },
      onBlur: function onBlur(_ref14) {
        var _onBlur4 = _ref14.onBlur;
        return _onBlur4;
      },
      onFocus: function onFocus(_ref15) {
        var _onFocus4 = _ref15.onFocus;
        return _onFocus4;
      },
      onKeyPress: function onKeyPress(_ref16) {
        var _onKeyPress4 = _ref16.onKeyPress;
        return _onKeyPress4;
      }
    },
    text: textPropsMap,
    textarea: textPropsMap,
    file: {
      name: function name(props) {
        return props.name || props.model;
      },
      onChange: function onChange(_ref17) {
        var _onChange5 = _ref17.onChange;
        return _onChange5;
      },
      onBlur: function onBlur(_ref18) {
        var _onBlur5 = _ref18.onBlur;
        return _onBlur5;
      },
      onFocus: function onFocus(_ref19) {
        var _onFocus5 = _ref19.onFocus;
        return _onFocus5;
      },
      onKeyPress: function onKeyPress(_ref20) {
        var _onKeyPress5 = _ref20.onKeyPress;
        return _onKeyPress5;
      }
    },
    reset: {
      onClick: function onClick(props) {
        return function (event) {
          event.preventDefault();
          props.dispatch(_actions2.default.reset(props.model));
        };
      },
      onFocus: function onFocus(_ref21) {
        var _onFocus6 = _ref21.onFocus;
        return _onFocus6;
      },
      onBlur: function onBlur(_ref22) {
        var _onBlur6 = _ref22.onBlur;
        return _onBlur6;
      }
    }
  };
}

var controlPropsMap = createControlPropsMap();

exports.default = controlPropsMap;
exports.createControlPropsMap = createControlPropsMap;