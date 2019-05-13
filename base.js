const animationList = []; // 动画列表
let clearList = []; // 动画执行完成，执行清理动作
function handleChangeSpeed(ratio) {
    speed = BASE_SPEED * ratio;
}

function print(arr) {
    const container = document.querySelector('#console');
    const items = arr.reduce((prev, next, index) => {
        return `${prev}<span class="item">${next}</span>`;
    }, '');
    container.innerHTML = items;
}

const FONT_SIZE = 12;
const SHAPE = '30';
const LINE_WIDTH = 300;
const deep = 0;
const deepMap = {};
const RATIO = 3;
const BASE_DEG = 15;
const BASE_SPEED = 0.6;
let speed = BASE_SPEED;

// 排序二叉树
let binaryTree = [''];

function getDeep() {
    let deep = 1;
    const deepMap = new Map();

    return function (target, value) {
        if (target === undefined) {
            return 0;
        }
        if (deepMap.has(target)) {
            return deepMap.get(target);
        } else {
            deepMap.set(target, deep++);
            return deepMap.get(target);
        }
    };
}

const getDeeper = getDeep();

function appendNode(parent, value = '', dir, strategy, color) {
    function defaultStrategy(parent) {
        return {
            baseDeg: (parent.deg || BASE_DEG) * 1.5,
            lineWidth: (parent.len || LINE_WIDTH) * 0.7
        };
    }

    strategy = strategy || defaultStrategy;

    const moveStance = SHAPE / 2;
    // text
    const textWrap = document.createElement('span');
    const textNode = document.createTextNode(value);
    textWrap.appendChild(textNode);
    addClass(textWrap, 'text-wrap ');
    textWrap.setAttribute(
        'style',
        `position: absolute; top:${moveStance -
        FONT_SIZE / 2 +
        'px'}; left: ${moveStance - FONT_SIZE / 2 + 'px'}`
    );

    // info
    const infoWrap = document.createElement('span');
    const infoText = document.createTextNode('');
    addClass(infoWrap, 'info');
    infoWrap.appendChild(infoText);

    if (!parent) {
        const root = document.createElement('div');
        root.setAttribute('data-root', true);
        root.setAttribute('class', 'box');
        root.style.left = window.innerWidth / 2 - SHAPE / 2 + 'px';
        document.body.appendChild(root);
        root.appendChild(textWrap);
        root.appendChild(infoWrap);
        const {baseDeg, lineWidth} = strategy({});
        root.deg = baseDeg;
        root.len = lineWidth;
        return root;
    }
    // 树的深度
    const deep = parent.deep || 1;
    // 每层边长旋转的角度
    const {baseDeg, lineWidth} = strategy(parent);
    // const baseDeg = (parent.deg || BASE_DEG) * 1.5;
    //  const baseDeg = BASE_DEG + deep + RATIO;
    // 边的长度
    // const lineWidth = (parent.len || LINE_WIDTH) * 0.7;

    const fragment = document.createDocumentFragment();
    const x = 0;
    const y = 0;
    const line = document.createElement('div');
    line.setAttribute('class', `line line-${value} line-${dir}`);

    const transformDeg =
        dir === 'right' ? `${baseDeg}deg` : `${180 - baseDeg}deg`;
    line.style.width = lineWidth - 15 + 'px';
    line.style.transformOrigin = 'left top';
    line.style.borderColor = color;
    // line.style.transform = `rotate(45deg) translateX(${moveStance}px) translateY(${moveStance}px)`;
    line.style.transform = `translateX(${moveStance}px) translateY(${moveStance}px) rotate(${transformDeg})`;

    const child = document.createElement('div');
    child.setAttribute('class', 'box');
    child.appendChild(textWrap);
    child.appendChild(infoWrap);
    child.deep = deep + 1;
    child.len = lineWidth;
    child.deg = baseDeg;

    fragment.appendChild(line);

    const deg = Math.PI / 180;
    const letStance = x + lineWidth * Math.cos(deg * baseDeg);
    const topStance = y + lineWidth * Math.sin(deg * baseDeg);
    if (dir === 'right') {
        child.style.left = letStance + 'px';
    } else if (dir === 'left') {
        child.style.left = -letStance + 'px';
    }
    child.style.top = topStance + 'px';
    fragment.appendChild(child);
    parent.appendChild(fragment);
    return child;
}

function setPoistion(target, left, top) {
    target.style.left = left + 'px';
    target.style.top = top + 'px';
}

function isUndefined(v) {
    return v === undefined;
}


function expandLine(source, target, color="black") {
    let {left: sl, top: st, value: sv} = source;
    let {left: tl, top: tt, value: tv} = target;
    const leftDis = Math.abs(sl - tl);
    const topDis = Math.abs(tt - st);
    const dis = Math.sqrt(leftDis ** 2 + topDis ** 2);
    let ele = document.createElement('div');
    ele.setAttribute('class', 'move-line');
    ele.style.borderColor = color;
    document.body.appendChild(ele);
    const leftDir = leftDis / dis;
    const topDir = topDis / dis;
    const tanValue = topDis / leftDis;
    const rate = 180 / Math.PI;
    let deg;
    if (sl < tl) {
       deg = Math.atan(tanValue) * rate;
    } else {
      deg = 180 - Math.atan(tanValue)* rate;
    }
    // const deg = theta * Math.PI / 180;
    ele.style.left = sl + 15 + 'px';
    ele.style.top = st + 15 + 'px';
    ele.style.transform = `rotate(${deg}deg)`;
    ele.style.width = '0px';
    const speed = 1;
    let leftPos = sl;
    let topPos = st;
    return new Promise((resolve) => {
        const step = function () {
            leftPos += speed * leftDir;
            topPos += speed * topDir;
            ele.style.width = parseInt(ele.style.width) + speed + 'px';
            const isStop = parseInt(ele.style.width) > dis;
            if (!isStop) {
                window.requestAnimationFrame(step);
            } else {
                resolve(() => {
                    document.body.removeChild(ele);
                });
            }
        };
        window.requestAnimationFrame(step)
    })

}

function moveByLine(source, target, targetDom, moveDir) {
    let {left: sl, top: st, value: sv} = source;
    let {left: tl, top: tt, value: tv} = target;
    const leftDis = Math.abs(sl - tl);
    const topDis = Math.abs(tt - st);
    const dis = Math.sqrt(leftDis ** 2 + topDis ** 2);
    let ele;
    if (isUndefined(targetDom)) {
        ele = document.querySelector('#circle');
        ele.style.visibility = 'visible';
        ele.innerHTML = sv;
    } else {
        ele = targetDom
    }


    const leftDir = leftDis / dis;
    const topDir = topDis / dis;
    let leftPos = sl;
    let topPos = st;

    function getStopFlag () {
        const isLeftBoundary = Math.abs(leftPos - tl) < 3;
        const isTopBoundary = Math.abs(topPos - tt) < 3;
        if (isUndefined(moveDir)) {
            return isLeftBoundary || isTopBoundary;
        } else if (moveDir === 'left') {
            return isLeftBoundary;
        } else if (moveDir === 'top') {
            return isTopBoundary;
        }
    }

    return new Promise(resolve => {
        function step() {
            if (sl < tl) {
                leftPos += speed * leftDir;
            } else {
                leftPos -= speed * leftDir;
            }
            if (st < tt) {
                topPos += speed * topDir;
            } else {
                topPos -= speed * topDir;
            }
            setPoistion(ele, leftPos, topPos);
            if (isUndefined(moveDir)) {

            }
            const isStop = getStopFlag();
            if (!isStop) {
                window.requestAnimationFrame(step);
            } else {
                resolve();
            }
        }

        window.requestAnimationFrame(step);
    });
}

function exchange(arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
    print(arr);
}

function getElement(id) {
    return document.querySelector(`#id-${id}`);
}

function getPos(ele) {
    return ele.getBoundingClientRect();
}

function setVal(ele, value) {
    ele.querySelector('span').innerHTML = value;
}

function hideCircle() {
    document.querySelector('#circle').style.visibility = 'hidden';
}

function setTextClass(parent, className) {
    const span = parent.querySelector('span');
    addClass(span, className);
}

async function handleOpration(opt) {
    const {type, data} = opt;
    console.log('optation=========>', opt);
    if (opt.type === 'exchange') {
        const sourceValue = data[0];
        const targetValue = data[1];
        const value = data[2];
        const sourceEle = getElement(sourceValue);
        const targetEle = getElement(targetValue);
        const source = getPos(sourceEle);
        const target = getPos(targetEle);
        source.value = value;
        await moveByLine(source, target);
        hideCircle();
        setVal(targetEle, value);
        setVal(sourceEle, binaryTree[targetValue]);
        setTextClass(sourceEle, 'jump');
        setTextClass(targetEle, 'jump');
        await new Promise(resolve => {
            setTimeout(() => {
                setTextClass(sourceEle, 'jump');
                setTextClass(targetEle, 'jump');
                resolve();
            }, 1000);
        });
        setTextClass(sourceEle, '');
        setTextClass(targetEle, '');
        exchange(binaryTree, sourceValue, targetValue);
    }
    if (opt.type === 'remove') {
        const parent = Math.floor(data / 2);
        const currentDom = getElement(data);
        const parentDom = getElement(parent);
        const lineDom = currentDom.previousSibling;
        parentDom.removeChild(lineDom);
        parentDom.removeChild(currentDom);
    }
    if (opt.type === 'heightLight') {
        let texEle;
        return new Promise(resolve => {
            data.nodes.forEach(ele => {
                const infoEle = data.infoEle || ele;
                if (infoEle) {
                    texEle = infoEle.querySelector('.info');
                    texEle.innerHTML = data.info || '';
                }
                addClass(ele, 'height-light');
            });
            setTimeout(() => {
                data.nodes.forEach(ele => {
                    if (!data.forevar) {
                        addClass(ele, 'height-light');
                        texEle.innerHTML = '';
                    }
                });
                resolve();
            }, 2000);
        });
    }
    if (opt.type === 'sorted') {
        const ele = getElement(data);
        addClass(ele, 'sorted');
    }
}

async function render() {
    while (animationList.length) {
        const a = animationList.shift();
        await handleOpration(a);
    }
    hideCircle();
    clearList.forEach(i => i.call(null));
    clearList = [];
}

function pushOpration(opt) {
    animationList.push(opt);
}

function shuffle(arr) {
    const getRange = (min, max) => min + Math.floor((max - min) * Math.random());
    const len = arr.length;
    for (let i = 0; i < len - 1; i++) {
        exchange(arr, i, getRange(i, len));
    }
}

function getRandomArr(len) {
    const arr = Array.apply(null, {length: len}).map((i, index) => index);
    shuffle(arr);
    return arr;
}

function addClass(el, value) {
    const hasClass = el.hasAttribute('class');
    if (!hasClass) {
        return el.setAttribute('class', value);
    }
    const className = el.getAttribute('class');
    const classNameArr = className.split(' ').map(i => i.trim());
    const index = classNameArr.findIndex(i => value === i);
    if (index > -1) {
        classNameArr.splice(index, 1);
        el.setAttribute('class', classNameArr.join(' '));
        return;
    }
    classNameArr.push(value);
    el.setAttribute('class', classNameArr.join(' '));
}

function clearRootDom() {
    const rootDom = document.querySelector('[data-root="true"]');
    if (rootDom) {
        document.body.removeChild(rootDom);
    }
    animationList.length = 0;
}
