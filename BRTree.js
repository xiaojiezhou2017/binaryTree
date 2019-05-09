function drawSearchTree(tree) {
    clearRootDom();
    _drawSearchTree(tree.root, appendNode(undefined, tree.root.key), tree.root.key);

    function _drawSearchTree(parent, parentDom, key) {
        parent.ref = parentDom;
        parentDom.setAttribute('id', `id-${key}`);
        if (parent.left) {
            const leftDom = appendNode(parentDom, parent.left.key, 'left');
            _drawSearchTree(parent.left, leftDom, parent.left.key);
        }
        if (parent.right) {
            const rightDom = appendNode(parentDom, parent.right.key, 'right');
            _drawSearchTree(parent.right, rightDom, parent.right.key);
        }
    }
}

// const searchArr = getRandomArr(10);
const Arr = [9, 5, 7, 6, 8, 3, 2, 6, 4, 10];
Arr.forEach(i => binarySearchTree.put(i));

drawSearchTree(binarySearchTree);
function setFixed(ele, { left, top }) {
    ele.style.position = 'fixed';
    ele.style.left = left + 'px';
    ele.style.top = top + 'px';
    ele.style.transition = 'all 0s'
}

function hideLine (parent, value) {
    const path = `.line-${value}`;
    const lines = parent.querySelector(path);
    lines.style.display = 'none';
}

async function rotateLeft (node) {
    const pos = getPos(node.ref);
    const right = node.right;
    const left = node.left;
    const leftDom = left.ref;
    const rightDom = right.ref;
    const rightPos = getPos(rightDom);
    const leftPos = getPos(leftDom);
    setFixed(rightDom, rightPos);
    setFixed(node.ref, getPos(node.ref));
    await Promise.all[moveByLine(pos, leftPos, node.ref), hideLine(node.ref, node.right.key, 'right')];
    await moveByLine(rightPos, pos, rightDom);
    /** 移动子树 **/
    await hideLine(rightDom, right.left.key);
    const leftChild = getPos(node.left.ref);
    const rightLeftChild = getPos(right.left.ref);
    const targetPos = { left: rightLeftChild.left, top: leftChild.top };
    console.log('targetPos', targetPos);
    console.log('leftChild', leftChild);
    console.log('source', rightLeftChild);
    setFixed(right.left.ref,  rightLeftChild);
    moveByLine(rightLeftChild, targetPos, right.left.ref);
    expandLine(pos, leftPos);
}

const node = binarySearchTree.get(5);
rotateLeft(node);

