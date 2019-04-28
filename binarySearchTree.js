class BinarySearchTree {
  constructor() {
    this.root = undefined;
  }
  put(key, value) {
    this.root = this._put(this.root, key, value);
  }
  // 添加方法要不怎么理解, 对这种问题理解不清楚，归根究底是自己对递归过程理解的不是很清楚
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
    this._get(this.root, key);
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

    if (node.key === key) {
      appOpt([node.ref], true, '查找到该元素');
      return node.value;
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
const searchArr = [5, 2, 9, 7, 1, 3, 8, 6, 4, 0];
searchArr.forEach(i => binarySearchTree.put(i));
print(searchArr);

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
  drawSearchTree(binarySearchTree);
  binarySearchTree.get(8);
  render();
}
