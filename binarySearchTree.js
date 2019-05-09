let targetValue = 8;
function handleTarget(value) {
  if (value) {
    print(searchArr);
    drawSearchTree(binarySearchTree);
    targetValue = Number(value);
  }
}
class BinarySearchTree {
  constructor() {
    this.root = undefined;
  }
  put(key, value) {
    this.root = this._put(this.root, key, value);
  }
  /**
   * put方法应该理解为：
   * 和当前节点做比较:
   * 1. 要是当前节点不存在，创建一个新的节点返回
   * 2. key > 当前节点的key, 查找当前节点的右节点
   * 3. key < 当前节点的key, 查找当前节点的左节点
   * 4. key === 当前节点的key值， 重置当前节点的值
   */
  _put(node, key, value) {
    if (node === undefined) {
      return new Node(key, value);
    }
    if (key > node.key) {
      node.right = this._put(node.right, key, value);
    } else if (key < node.key) {
      node.left = this._put(node.left, key, value);
    } else if (key === node.key) {
      node.value === value;
    }
    return node;
  }

  get(key) {
    return this._get(this.root, key);
  }

  _get(node, key) {
    if (node === undefined) {
      return;
    }
    function appOpt(nodes, forevar, info) {
      nodes = nodes || Array.from(node.ref.querySelectorAll('div'));
      pushOpration({
        data: {
          nodes,
          forevar,
          infoEle: node.ref,
          info
        },
        type: 'heightLight'
      });
    }
    console.log('node.key', node.key, 'key', key);
    if (node.key === key) {
      appOpt([node.ref], true, '查找到该元素');
      // return node.value;
      return node;
    } else if (key < node.key) {
      appOpt(undefined, false, `<-${key}小于当前值，向左子树查找`);
      return this._get(node.left, key);
    } else if (key > node.key) {
      appOpt(undefined, false, `${key}大于当前值，向右子树查找->`);
      return this._get(node.right, key);
    }
  }
}

class Node {
  constructor(key, value, left, right) {
    this.key = key;
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

const binarySearchTree = new BinarySearchTree();
// const searchArr = getRandomArr(10);
const searchArr = [9, 5, 7, 6, 8, 3, 2, 6, 4, 10];
searchArr.forEach(i => binarySearchTree.put(i));

function drawSearchTree(tree) {
  clearRootDom();
  _drawSearchTree(tree.root, appendNode(undefined, tree.root.key));
  function _drawSearchTree(parent, parentDom) {
    parent.ref = parentDom;
    if (parent.left) {
      const leftDom = appendNode(parentDom, parent.left.key, 'left');
      _drawSearchTree(parent.left, leftDom);
    }
    if (parent.right) {
      const rightDom = appendNode(parentDom, parent.right.key, 'right');
      _drawSearchTree(parent.right, rightDom);
    }
  }
}

function handleSearch() {
  print(searchArr);
  drawSearchTree(binarySearchTree);
  binarySearchTree.get(targetValue);
  render();
}
