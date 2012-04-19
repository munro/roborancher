var util = require('./util');

function EventQueue() {
  console.log(util);
  this.queue = new util.PriorityQueue();
}

EventQueue.prototype.push_event = function(priority, fn) {
  this.queue.push(priority, fn);
};

EventQueue.prototype.pop_event = function(data) {
  var item = this.queue.pop();

  item.value = item.value(data);
  return item;
};

EventQueue.prototype.size = function() {
  return this.queue.size();
}


if(1 == 1) {
  var queue = new EventQueue();

  queue.push_event(Math.random(), function() {
    return 'event1';
  });

  queue.push_event(Math.random(), function() {
    return 'event2'; 
  });

  queue.push_event(Math.random(), function() {
    return 'event3';
  });

  queue.push_event(Math.random(), function() {
    return 'event4'; 
  });


  while(queue.size()) {
    console.log(queue.pop_event());
  }

}

