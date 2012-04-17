/*jslint node: true, newcap: true, nomen: true */

'use strict';

var EventEmitter = require('events').EventEmitter,
    _ = require('underscore');

var StateGraph, State;

/**
 * StateGraph
 */
StateGraph = function () {
    this.states = {};
    this.current = null;
};

StateGraph.prototype.state = function (name, fn) {
    var args;
    if (typeof name === 'undefined') {
        return this.states[this.current];
    }

    // Define substate
    args = _(arguments).toArray();
    if (args.length > 2) {
        return this.states[name].state.apply(this.states[name], args.slice(1));
    }

    return (this.states[name] = new State(fn));
};

StateGraph.prototype.go = function (name) {
    if (!this.states[name]) {
        throw new Error('State `' + name + '` does not exist.');
    } else if (this.current === name) {
        throw new Error('Already at state `' + name + '`.');
    } else {
        if (this.current) {
            this.states[this.current].end();
        }
        this.current = name;
        this.states[name].start(Array.prototype.slice.call(arguments, 1));
        return this.states[name];
    }
};

StateGraph.prototype.end = function () {
    if (this.current) {
        this.states[this.current].end();
    }
    // This is behavoir is for {State} objects, it's here because mixing in
    // {StateGraph} into a {State} will clobber the existing `end` method.  So
    // we must reimplement the code here.
    if (this.emit) {
        this.emit('end', this);
    }
    this.current = false;
};

/**
 * State
 */
State = function (fn) {
    EventEmitter.call(this);
    this.fn = fn;
};

State.prototype = Object.create(EventEmitter.prototype);

/**
 * Placeholder method for lazily mixing in a sub-StateGraph.
 */
State.prototype.state = function () {
    // Lazy mixin a sub StateGraph
    _(this).extend(StateGraph.prototype);
    StateGraph.call(this);
    return StateGraph.prototype.state.apply(this, arguments);
};

State.prototype.start = function (args) {
    this.fn.apply(this, [this].concat(args));
};

/**
 * This method gets clobbered by the StateGraph when mixing in substates.
 */
State.prototype.end = function () {
    this.emit('end', this);
};

module.exports = StateGraph;
