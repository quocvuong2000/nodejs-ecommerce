const myArray = new MyArray();
myArray.push('hi');
myArray.push('you');
myArray.push('!');
myArray.get(0);
myArray.pop();
myArray.deleteAtIndex(0);
myArray.push('are');
myArray.push('nice');
myArray.shiftItems(0);

class MyArray {
  constructor () {
    this.items = {};
    this.length = 0
  }
}