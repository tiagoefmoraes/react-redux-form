'use strict';

var _jsdom = require('jsdom');

var _jsdom2 = _interopRequireDefault(_jsdom);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiSubset = require('chai-subset');

var _chaiSubset2 = _interopRequireDefault(_chaiSubset);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiSubset2.default);

global.document = _jsdom2.default.jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = { userAgent: 'node.js' };