/*jslint node: true, newcap: true, nomen: true */

'use strict';

var Self = require('self'),
    test = require('tap').test,
    util = require('../lib/util');

test('test getSet', function (t) {
    var obj = {
        _foo: 123,
        foo: util.getSet('_foo')
    };

    t.equal(obj.foo(), 123);
    t.equal(obj.foo('rwar'), obj);
    t.equal(obj.foo(), 'rwar');
    t.equal(obj.foo('chain').foo('it').foo('bro'), obj);
    t.equal(obj.foo(), 'bro');

    t.end();
});

test('test getSetList', function (t) {
    var Obj = Self({
        _foo: 123,
        _bar: 321,
        _hello: 'world'
    }), obj;

    util.getSetList(['foo', 'bar', 'hello'], Obj.prototype);

    obj = Obj();

    t.equal(obj.foo(), 123);
    t.equal(obj.bar(), 321);
    t.equal(obj.hello(), 'world');

    t.equal(obj.foo(1), obj);
    t.equal(obj.bar(2), obj);
    t.equal(obj.hello(3), obj);

    t.equal(obj.foo(), 1);
    t.equal(obj.bar(), 2);
    t.equal(obj.hello(), 3);

    t.end();
});
