function drawBrTree(tree) {
    clearRootDom();
    _drawBrTree(tree.root, appendNode(undefined, tree.root.key), tree.root.key);

    function _drawBrTree(parent, parentDom, key) {
        parent.ref = parentDom;
        parentDom.setAttribute('id', `id-${key}`);
        if (parent.left) {
            const leftDom = appendNode(parentDom, parent.left.key, 'left', undefined, parent.left.color);
            _drawBrTree(parent.left, leftDom, parent.left.key);
        }
        if (parent.right) {
            const rightDom = appendNode(parentDom, parent.right.key, 'right', undefined, parent.right.color);
            _drawBrTree(parent.right, rightDom, parent.right.key);
        }
    }
}

function handleBrTreePush (value) {
    document.body.setAttribute('class', 'white-theme');
    brTree.put(value);
}
class BRTree extends BinarySearchTree {
    isRed (node) {
        if (isUndefined(node)) {
            return false;
        }
        return node.color === 'red';
    }
    async put (key, value) {
        this.root = await this._put(this.root, key, value);
        drawBrTree(this);
        this.root.color = 'black';
    }
    async rotateRight (node) {
        await rotateRight(node);
        const left = node.left;
        node.left = left.right;
        left.right = node;
        left.color = node.color;
        node.color = 'red';
        drawBrTree(this);
        return left;
    }
    async rotateLeft (node) {
        await rotateLeft(node);
        const right = node.right;
        node.right = right.left;
        right.left = node;
        right.color = node.color;
        node.color = 'red';
        drawBrTree(this);
        return right;
    }
    async flipColors  (node) {
        node.color = 'red';
        await changeBorderColor(node.key, 'red');
        node.left.color = 'black';
        await changeBorderColor(node.left.key, 'black');
        node.right.color = 'black';
        await changeBorderColor(node.right.key, 'black');
        console.log('flipColors');
        drawBrTree(this);
    }
    async _put (node, key, value) {
        const { isRed }  = this;
        if (isUndefined(node)) {
            return new Node(key, value, undefined, undefined, 'red');
        }
        if (key > node.key) {
            node.right = await this._put(node.right, key, value);
        } else if (key < node.key) {
            node.left =  await this._put(node.left, key, value);
        } else if (key === node.key) {
            node.value === value;
        }
        drawBrTree(this);
        if (isRed(node.right) && !isRed(node.left)) {
            node = await this.rotateLeft(node);
        } else if (isRed(node.left) && isRed(node.left.left)) {
            node = await this.rotateRight(node);
        } else if (isRed(node.left) && isRed(node.right)) {
            await this.flipColors(node);
        }
        return node;
    }
}
// const searchArr = getRandomArr(10);
const brTree = new BRTree();
function setFixed(ele, { left, top }) {
    ele.style.position = 'fixed';
    ele.style.left = left + 'px';
    ele.style.top = top + 'px';
    ele.style.transition = 'all 0s'
}

function hideLine (parent, value) {
    const path = `.line-${value}`;
    const lines = parent.querySelector(path);
    return new Promise(resolve => {
        setTimeout(() => {
            lines.style.display = 'none';
            resolve();
        }, 1000)
    })
}

function changeBorderColor (value, color) {
    const path = `.line-${value}`;
    const node = getElement(value);
    const parent = node.parentNode;
    const line = parent.querySelector(path);
    if (line) {
        return new Promise((resolve, reject) => {
            line.color = color;
            setTimeout(() => {
                resolve();
            }, 1000);
        })
    }
    return Promise.resolve();

}

async function rotateLeft (node) {
    return rotateRight(node, 'left');
}

function getComputedPos (node, child) {
    const { left: cl, top: ct } = getPos(child);
    const { left: nl, top: nt } = getPos(node);
    const left = cl + (nl - cl) * 2;
    return { left, top: ct}
}

async function rotateRight (node, flag = 'right') {
    const hideLines = [];
    const pos = getPos(node.ref);
    let  right = node.right;
    if (flag === 'right') {
        right = node.left;
    }
    // const leftDom = left.ref;
    const rightDom = right.ref;
    const rightPos = getPos(rightDom);
    // const leftPos = getPos(leftDom);
    setFixed(rightDom, rightPos);
    // setFixed(node.ref, getPos(node.ref));
    // 调整两个主要节点的位置,并且隐藏指向的线段
    const tPos = getComputedPos(node.ref, rightDom, flag);
    setFixed(node.ref, pos);
    await hideLine(node.ref, right.key, flag);
    await moveByLine(pos, tPos, node.ref);

    // await Promise.all[moveByLine(pos, leftPos, node.ref), hideLine(node.ref, node.right.key, 'right')];
    await moveByLine(rightPos, pos, rightDom);
    /** 移动子树 **/
    hideLines.push(await expandLine(pos, tPos, 'red'));
    if (right[flag]) {
        await hideLine(rightDom, right[flag].key);
        const leftChild = getPos(node[flag].ref);
        const rightLeftChild = getPos(right[flag].ref);
        const targetPos = { left: rightLeftChild.left, top: leftChild.top };
        setFixed(right[flag].ref,  rightLeftChild);
        await moveByLine(rightLeftChild, targetPos, right[flag].ref, 'top');
        hideLines.push((await expandLine(getPos(node.ref), getPos(right[flag].ref))));
    }
    hideLines.forEach(i => i.call(null));
}


async function handleBrTree () {
    /**
    document.body.setAttribute('class', 'white-theme');
    for (let i = 1; i < 13; i++) {
        await brTree.put(i);
    }
     **/
    /**
    const node = brTree.get(0);
    rotateLeft(node);
     **/
}

