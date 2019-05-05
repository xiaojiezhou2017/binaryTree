/**
 * 链表
 */

// 链表反转
class listNode {
  constructor(key, next) {
    this.key = key;
    this.next = next;
  }
}

class List {
  constructor() {
    this.head = undefined;
  }

  draw() {
    function strategy(parent) {
      return {
        baseDeg: 0,
        lineWidth: 100
      };
    }
    const appendListNode = function(parent, value) {
      return appendNode.call(null, parent, value, 'right', strategy);
    };
    let prev;
    for (let node = this.head; node; node = node.next) {
      prev = appendListNode(prev, node.key);
      node.ref = prev;
    }
  }

  put(key) {
    if (!this.head) {
      this.head = new listNode(key);
      return;
    }
    let node = this.head;
    while (node.next) {
      node = node.next;
    }
    node.next = new listNode(key);
  }

  print() {
    for (let node = this.head; node; node = node.next) {
      console.log(node.key);
    }
  }

  reserver() {
    let prev;
    let head = this.head;
    while (head) {
      pushOpration(
        {
          data: {
            nodes: [head.ref],
            info: 'next',
            forevar: false 
          },
          type: 'heightLight'
      });
      const next = head.next;
      head.next = prev;
      pushOpration(
        {
          data: {
            nodes: prev ? [prev.ref]: [],
            info: 'prev',
            forevar: false 
          },
          type: 'heightLight'
        }
      );
      prev = head;
      pushOpration(
      { 
        data: {
          nodes: next ? [next.ref] : [],
          info: 'head',
          forevar: false 
        },
        type: 'heightLight'
      });
      head = next;
    }
    this.head = prev;
  }
  static test() {
    console.log('do test');
    let list = new List();
    list.put(1);
    list.put(2);
    list.put(3);
    list.put(4);
    list.draw();
    list.reserver();
    render();
    console.log('ainmation', animationList.slice())
  }
}

// List.test();
