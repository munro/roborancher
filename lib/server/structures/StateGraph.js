/*
 * State
 */

function State(graph, fn) {
    EventEmitter.prototype.call(this);
    this.graph = graph;
    this.fn = fn;
}

State.prototype = Object.create(require('events').EventEmitter.prototype);

State.prototype.start = function (args) {
    this.fn.apply(this.graph, args);
};

State.prototype.end = function () {
    this.emit.apply(this.graph, ['end'].concat(args));
};

/*
 * StateGraph
 */

function StateGraph() {
    this.states = {};
    this.current = false;
}

StateGraph.prototype.state = function (name, fn) {
    return (this.states[name] = new State(this, fn));
};

StateGraph.prototype.go = function (name) {
    if (!this.states[name]) {
        throw 'State `' + name + '` does not exist.';
    } else if (this.current === this.states[name]) {
        throw 'Already at state `' + name + '`';
    }
    this.current && this.current.end();
    this.states[name].start(Array.prototype.slice.call(arguments, 1));
};

StateGraph.prototype.end = function () {
    this.current = this.state && this.state.end(), false;
};

exports.StateGraph = StateGraph;
