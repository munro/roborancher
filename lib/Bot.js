/*jslint node: true, newcap: true, nomen: true */

'use strict';

var EventEmitter = require('events').EventEmitter,
    Self = require('self'),
    util = require('./util');

var Bot = Self(EventEmitter, {
    initialize: function (self, pos, rot) {
        self._pos = pos;
        self._rot = rot;
        self._flags = 0;
        self._won = false;
    }
});

util.getSetList(['pos', 'rot', 'flag', 'won'], Bot.prototype);

module.exports = Bot;
