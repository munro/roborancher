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



/*
 * unit tests
 */
if(0 == 1) {
  var i, item, queue = new PriorityQueue();

  for(i = 0; i < 20; ++i) {
    queue.push(Math.random(), 20 - i);
  }

  while(queue.size()) {
    item = queue.pop();

    console.log('pri: ' + item.priority + ', value: ' + item.value);
  }
}

