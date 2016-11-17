'use strict';

var _chai = require('chai');

var _src = require('../src');

describe('action types', function () {
  var testActionTypes = Object.keys(_src.actionTypes).map(function (key) {
    return _src.actionTypes[key];
  });

  it('should be present and importable from the index file', function () {
    _chai.assert.ok(testActionTypes.length > 0, 'there should be at least one action type exported');
  });
});