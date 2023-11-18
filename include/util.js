const format = (...args) => args.shift().replace(/%([jsd])/g, x => x === '%j' ? JSON.stringify(args.shift()) : args.shift())

class Stack {
  constructor() {
    this.items = [];
    this.iterator = this.stackIterator();
  }

  *stackIterator() {
    for (let i = 0; i < this.items.length; i++) {
      yield this.items[i];
    }
    this.iterator = this.stackIterator();
    return;
  }

  add(item) {
    this.items.push(item);
  }

  size() {
    return this.items.length;
  }

  pop() {
    return this.items.pop();
  }

  get(i) {
    return this.items[i];
  }

  remove(index) {
    if (index > this.items.length-1 || index < 0)
      return null;
    if (this.items.length == 0)
      return null;
    var item = this.items[index];
    this.items.splice(index, 1);
    return item;
  }

  peek(index=1) {
    /**
     * return the first element from the stack but don't delete it
     */
    return this.items[this.items.length - index];
  }

  empty() {
    /**
     * return true if stack is empty
     */
    return this.items.length == 0;
  }
}


