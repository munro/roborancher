var EventEmitter = require('events').EventEmitter,
    _ = require('underscore');

/*
 * State
 */

function State(fn) {
    EventEmitter.call(this);
    this.fn = fn;
}

State.prototype = Object.create(EventEmitter.prototype);

State.prototype.state = function () {
    // Lazy mixin a sub StateGraph
    _(this).extend(StateGraph.prototype);
    StateGraph.call(this);
    return StateGraph.prototype.state.apply(this, arguments);
};

State.prototype.start = function (args) {
    this.fn.apply(this, args);
    if (this.go && args.length >= 1) {
        this.go.apply(this, args);
    }
};

State.prototype.end = function () {
    this.current && this.states[this.current].end();
    this.emit.apply(this, ['end'].concat(Array.prototype.slice.call(arguments)));
};

/*
 * StateGraph
 */

function StateGraph() {
    this.states = {};
    this.current = false;
}

StateGraph.prototype.state = function (name, fn) {
    if (typeof name === 'undefined') {
        return this.current; // TODO: implement substates
    } else if (typeof fn === 'undefined') {
        return this.current === name; // TODO: implement substates
    } else {
        return (this.states[name] = new State(fn));
    }
};

StateGraph.prototype.go = function (name) {
    if (!this.states[name]) {
        throw 'State `' + name + '` does not exist.';
    } else if (this.current === name) {
        this.states[this.current].go &&
                this.states[this.current].go.apply(this.states[this.current],
                    Array.prototype.slice.call(arguments, 1));
    } else {
        this.current && this.states[this.current].end.call(this.states[this.current]);
        this.current = name;
        this.states[name].start(Array.prototype.slice.call(arguments, 1));
    }
};

StateGraph.prototype.end = function () {
    this.current && this.states[this.current].end();
    this.emit && this.emit.apply(this, ['end'].concat(Array.prototype.slice.call(arguments)));
    this.current = false;
};

module.exports = StateGraph;
