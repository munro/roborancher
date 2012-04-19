/*jslint node: true, newcap: true, nomen: true */

'use strict';

var _ = require('underscore');

exports.getSet = function (name) {
    return function (val) {
        if (typeof val !== 'undefined') {
            this[name] = val;
            return this;
        }
        return this[name];
    };
};

exports.getSetList = function (list, obj) {
    return _(list).reduce(function (obj, name) {
        obj[name] = exports.getSet('_' + name);
        return obj;
    }, obj || {});
};
