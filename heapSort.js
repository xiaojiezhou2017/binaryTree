let customTree = null;
function handleArrChange(value) {
  if (!value) {
    custom = null;
  }
  customTree = value.split(',');
}
function drawTree(binaryTree) {
  clearRootDom();
  function _darwTree(tree, n, parent) {
    if (2 * n + 1 > tree.length) {
      return;
    }
    const leftValue = tree[2 * n];
    const rightValue = tree[2 * n + 1];
    const left = appendNode(parent, leftValue, 'left');
    left.setAttribute('id', 'id-' + 2 * n);
    _darwTree(tree, 2 * n, left);
    if (rightValue !== undefined) {
      const right = appendNode(parent, rightValue, 'right');
      right.setAttribute('id', 'id-' + (2 * n + 1));
      _darwTree(tree, 2 * n + 1, right);
    }
  }
  const root = appendNode(undefined, binaryTree[1]);
  root.setAttribute('id', 'id-' + 1);
  root.setAttribute('data-root', true);
  _darwTree(binaryTree, 1, root);
}

drawTree(binaryTree);

function push(item, isExchange = false) {
  let pos = binaryTree.push(item) - 1;
  print(binaryTree);
  drawTree(binaryTree);
  swim(pos, item, isExchange);
  // drawTree(binaryTree);
}

// 上浮一个元素
function swim(pos, value, isExchange = false) {
  let parentPos;
  let p = pos;
  while ((parentPos = Math.floor(p / 2)) >= 1) {
    parentValue = binaryTree[parentPos];
    if (parentValue < value) {
      if (isExchange) {
        exchange(binaryTree, parentPos, p);
      }
      pushOpration({ data: [p, parentPos, value], type: 'exchange' });
    }
    p = parentPos;
  }
}

// 删除根节点, 也就是最大的元素
function delMax() {
  // binaryTree[1] = 0;
  drawTree(binaryTree);
  const last = binaryTree.length - 1;
  pushOpration({ data: [last, 1, binaryTree[last]], type: 'exchange' });
  pushOpration({ data: last, type: 'remove' });
  clearList.push(() => {
    binaryTree.pop();
  });
  sink(1, binaryTree[binaryTree.length - 1]);
  render();
}

function sink(pos, value, len = binaryTree.length) {
  let p = pos;
  while (p * 2 <= len) {
    const childPos = 2 * p;
    let replace = childPos;
    const childValue = binaryTree[childPos];
    const rightChildValue = binaryTree[childPos + 1] || -Infinity;
    /**
     * 这里需要判断childPos < len的原因
     * len代表可以查找到的最后的节点,位置的寻找不应该超过len
     * 假设左节点的childPos === len 那么此时右边节点 childPos = len + 1, 就会超出范围
     * 执行
     * 所以这里要保证的是右边节点不能超出范围
     *
     * 那为什么while的循环的结束条件不是p * 2 + 1 <= len 这样就能保证右边节点不会超过len！！！！
     * 这样做的问题：
     * 考虑元素len正好是截止在左节点处，那么此时p * 2 + 1 <= len会导致左节点被跳过。
     */
    if (childPos < len && rightChildValue > childValue) {
      replace = childPos + 1;
    }
    if (value >= binaryTree[replace]) {
      break;
    } else {
      // exchange(binaryTree, p, replace);
      pushOpration({ data: [p, replace, value, 'sink'], type: 'exchange' });
    }
    p = replace;
  }
}

function handleSort() {
  // 构造堆排序的过程
  binaryTree = Array.apply(null, { length: 15 }).map((i, index) => index);
  shuffle(binaryTree);
  binaryTree[0] = '';
  // binaryTree = ['', 13, 9, 0, 1, 7, 11, 3, 5, 6, 12, 10, 8, 2, 14];
  console.log('binaryTree', binaryTree.slice());
  if (customTree) {
    binaryTree = customTree.slice();
    binaryTree.unshift('');
  }
  drawTree(binaryTree);

  async function sort(arr) {
    let len = arr.length;
    for (let i = Math.floor(len / 2); i >= 1; i--) {
      const value = arr[i];
      sink(i, value, len - 1);
      await render();
    }
    len--; //
    while (len > 1) {
      pushOpration({ data: [len, 1, arr[len], 'sort'], type: 'exchange' });
      await render();
      pushOpration({ data: len, type: 'sorted' });
      len--;
      sink(1, arr[1], len);
      await render();
    }
  }
  print(binaryTree);
  sort(binaryTree);
}
