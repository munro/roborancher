define([], function () {
    var exports = {};

    /*
     * EventObject
     */
    function EventObject() {
        this.events = {};
    };
    
    EventObject.prototype.on = function(name, fn) {
        var e = this.events[name] || [];
        e.push(fn);
    };
    
    EventObject.prototype.on = function(name) {
        var args = Array.prototype.slice.call(arguments, 1),
            e = this.events[name] || [],
            i;
    
        for(i = 0; i < e.length; ++i) {
            e[i].apply(e[i], args);
        }
    };
    
    exports.EventObject = EventObject
    
    
    /*
     * EventQueue
     */
    function EventQueue() {
        this.queue = new util.PriorityQueue();
    };
    
    EventQueue.prototype.pushEvent = function(priority, fn) {
        this.queue.push(priority, fn);
    };
    
    EventQueue.prototype.popEvent = function() {
        var item = this.queue.pop();
        item.value = item.value.apply(item.value, arguments);
        return item;
    };
    
    exports.EventQueue = EventQueue;
    
    
    /*
     * PriorityQueue
     */
    function PriorityQueue() {
        this.priority_array = [];
    };
    
    PriorityQueue.prototype.push = function(priority, value) {
        var i, size;
    
        /* find correct spot in array */
        size = this.size();
        for(i = 0; i < size; ++i) {
            if(priority < this.priority_array[i].priority)
                break;
        }
    
        this.priority_array.splice(i, 0, {'priority': priority, 'value': value});
    }
    
    PriorityQueue.prototype.pop = function() { 
        return this.size() ? this.priority_array.shift() : undefined;
    }
    
    PriorityQueue.prototype.size = function() {
        return this.priority_array.length;
    }
    
    exports.PriorityQueue = PriorityQueue;
    
    /*
     * StateGraph 
     */
    
    function StateGraph() {
        this.states = {};
    }
    
    StateGraph.prototype.state = function(name, fn) {
        this.states [name] = fn;
    }
    
    StateGraph.prototype.go = function(name) {
        var args = Array.prototype.slice.call(arguments, 1);
        return (this.states[name] ? this.states[name] : function() {}).apply(this, args);
    }
    
    
    exports.StateGraph = StateGraph;
    
    /*
     * unit tests
     */
    if(0 == 1) {
        var game = new StateGraph(),
            numbers = new PriorityQueue(),
            i;
    
        /* random array */
        for(i = 0; i < 20; ++i) {
            numbers.push(Math.random(), 20 - i);
        }
    
        game.state('start', function(numbers) {
            console.log('Game start');
        
            if(!numbers.size())
                return this.go('end', 0);
    
            return this.go('play-turn', numbers, numbers.pop().value, 0, 1);
        });
    
        game.state('play-turn', function(numbers, prev, score, turn) {
            var guess, next;
            
            console.log('===Turn ' + turn + '===')
    
            /* game over? */
            if(!numbers.size())
                return this.go('end', score);
    
            /* make a guess */
            guess = 10 < prev ? false : true;
            console.log('Guess: The next number will be ' + (guess ? 'greater' : 'less') + ' than ' + prev + '.');
    
            /* check guess, update score */
            next = numbers.pop().value;
            guess = guess ? next > prev : next < prev;
            score += guess ? 1 : 0;
            console.log('The number was ' + next + '.');
            console.log('Guess was ' + (guess ? 'correct' : 'incorrect') + ', you score is ' + score + '.');
    
            this.go('play-turn', numbers, next, score, turn + 1);
        });
    
        game.state('end', function(score) {
            console.log('Final Score: ' + score);
            console.log('Game Over!') ;
        });
    
    
        /* start game! */
        game.go('start', numbers);
    }

    return exports;
});
