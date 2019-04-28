const animationList = []; // 动画列表
let clearList = []; // 动画执行完成，执行清理动作

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
const BASE_DEG = 20;
const SPEED = 0.6;

// 排序二叉树
let binaryTree = [''];

function getDeep() {
  let deep = 1;
  const deepMap = new Map();

  return function(target, value) {
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

function appendNode(parent, value = '', dir) {
  const moveStance = SHAPE / 2;
  // text
  const textWrap = document.createElement('span');
  const textNode = document.createTextNode(value);
  textWrap.appendChild(textNode);
  textWrap.style.position = 'absolute';
  textWrap.style.top = moveStance - FONT_SIZE / 2 + 'px';
  textWrap.style.left = moveStance - FONT_SIZE / 2 + 'px';

  if (!parent) {
    const root = document.createElement('div');
    root.setAttribute('class', 'box');
    root.style.left = window.innerWidth / 2 - SHAPE / 2 + 'px';
    document.body.appendChild(root);
    root.appendChild(textWrap);
    return root;
  }
  // 树的深度
  const deep = parent.deep || 1;
  // 每层边长旋转的角度
  const baseDeg = (parent.deg || BASE_DEG) * 1.5;
  //  const baseDeg = BASE_DEG + deep + RATIO;
  // 边的长度
  const lineWidth = (parent.len || LINE_WIDTH) * 0.7;

  const fragment = document.createDocumentFragment();
  const x = 0;
  const y = 0;
  const line = document.createElement('div');
  line.setAttribute('class', 'line');

  const transformDeg =
    dir === 'right' ? `${baseDeg}deg` : `${180 - baseDeg}deg`;
  line.style.width = lineWidth - 15 + 'px';
  line.style.transformOrigin = 'left top';
  // line.style.transform = `rotate(45deg) translateX(${moveStance}px) translateY(${moveStance}px)`;
  line.style.transform = `translateX(${moveStance}px) translateY(${moveStance}px) rotate(${transformDeg})`;

  const child = document.createElement('div');
  child.setAttribute('class', 'box');
  child.appendChild(textWrap);
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

// 节点交换
// source { left right value }
function nodeChange(source, target) {}

function setPoistion(target, left, top) {
  target.style.left = left + 'px';
  target.style.top = top + 'px';
}

function moveByLine(source, target) {
  let { left: sl, top: st, value: sv } = source;
  let { left: tl, top: tt, value: tv } = target;
  const leftDis = Math.abs(sl - tl);
  const topDis = Math.abs(tt - st);
  const dis = Math.sqrt(leftDis ** 2 + topDis ** 2);
  const ele = document.querySelector('#circle');
  ele.style.visibility = 'visible';
  ele.innerHTML = sv;
  const leftDir = leftDis / dis;
  const topDir = topDis / dis;
  const speed = SPEED;
  let leftPos = sl;
  let topPos = st;
  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
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
      if (Math.abs(leftPos - tl) < 3 || Math.abs(topPos - tt) < 3) {
        resolve();
        clearInterval(timer);
      }
    }, 10);
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
  parent.querySelector('span').setAttribute('class', className);
}
async function handleOpration(opt) {
  const { type, data } = opt;
  console.log('optation=========>', opt);
  if (opt.type === 'exchange') {
    const sourceValue = data[0];
    const targetValue = data[1];
    const value = data[2];
    const sourceEle = getElement(sourceValue);
    const targetEle = getElement(targetValue);
    const source = getPos(sourceEle);
    const target = getPos(targetEle);
    setTextClass(sourceEle, 'jump');
    setTextClass(targetEle, 'jump');
    source.value = value;
    await moveByLine(source, target);
    setVal(targetEle, value);
    setVal(sourceEle, binaryTree[targetValue]);
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
    const exIndex = getRange(i, len);
    exchange(arr, i, getRange(i, len));
  }
}

function getRandomArr(len) {
  const arr = Array.apply(null, { length: len }).map((i, index) => index);
  shuffle(arr);
  return arr;
}
