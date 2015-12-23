import $ from 'jquery';
const canvas = $('<canvas></canvas>').appendTo('body')[0];
const ctx = canvas.getContext('2d');
// network的中心焦点
let originDot = null;
// network连接点集合
let targetDots = {
  maxNum: 15,
  dom: []
};
// 更换network焦点的时间step
let step_changeorigindot = 0;
let timer_changeorigindot = null;
// network绘制的区域限制
const lineBox = {
  width: 600,
  height: 500,
  box: {}
};

let winW, winH;
// 所有绘制圆点的集合
let dots = {
  sum: 50,
  dom: []
};

//canvas充满屏幕
function updateCanvasSize() {
  winW = $(window).width() * 0.8;
  winH = $(window).height() * 0.6;
  canvas.width = winW;
  canvas.height = winH;
  $(canvas).css({
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -winH / 2,
    marginLeft: -winW / 2
  });
  ctx.fillStyle = "#B3C1C7";
  ctx.strokeStyle = '#C1CCD2';
  dots.dom = [];
  if (timer_changeorigindot) {
    clearInterval(timer_changeorigindot);
  }
  step_changeorigindot = Math.min(winW, winH) * 16;
  timer_changeorigindot = setInterval(getOriginDot, step_changeorigindot);
}
//逐帧绘制
function draw() {
  ctx.clearRect(0, 0, winW, winH);
  if (dots.dom.length === 0) {
    return;
  }
  if (originDot) {
    for (let i = 0, sum = dots.sum; i < sum; i++) {
      const dot = dots.dom[i];
      dot.move();
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2, true);
      ctx.fill();
    }
    drawLines();
  } else {
    getOriginDot();
  }
  window.requestAnimationFrame(draw);
}
//创建圆点
function createDots() {
  for (let i = 0, sum = dots.sum; i < sum; i++) {
    let x = Math.random() * winW;
    let y = Math.random() * winH;
    let dot = new Dot(x, y, winW, winH);
    dots.dom.push(dot);
  }
}
//绘制连线
function drawLines() {
  targetDots.dom = [];
  lineBox.box.left = Math.max(originDot.x - lineBox.width / 2, 0);
  lineBox.box.right = Math.min(originDot.x + lineBox.width / 2, winW);
  lineBox.box.top = Math.max(originDot.y - lineBox.height / 2, 0);
  lineBox.box.bottom = Math.min(originDot.y + lineBox.height / 2, winH);
  ctx.beginPath();
  for (let i = 0, sum = dots.sum; i < sum; i++) {
    let dot = dots.dom[i];
    if (dot.x >= lineBox.box.left && dot.x <= lineBox.box.right && dot.y >= lineBox.box.top && dot.y <= lineBox.box.bottom) {
      if (targetDots.dom.length < targetDots.maxNum) {
        targetDots.dom.push(dot);
        ctx.moveTo(originDot.x, originDot.y);
        ctx.lineTo(dot.x, dot.y);
      }
    }
  }
  for (let i = 0, len = targetDots.dom.length; i < len; i++) {
    let _index = i + 1;
    if (_index < len) {
      ctx.moveTo(targetDots.dom[i].x, targetDots.dom[i].y);
      ctx.lineTo(targetDots.dom[_index].x, targetDots.dom[_index].y);
    }
  }
  ctx.stroke();
}
//获取焦点
function getOriginDot() {
  let index = Math.floor(Math.random() * dots.sum);
  originDot = dots.dom[index];
}
//圆点class
class Dot {
  constructor(x, y, boxW, boxH) {
    //坐标
    this.x = x;
    this.y = y;
    //偏移量
    this.tranlateX = 0;
    this.tranlateY = 0;
    //活动范围
    this.box = {
      width: boxW,
      height: boxH
    };
    this.radius = (0.5 + Math.random()) * 5;
    // 运动方向
    this.directions = {
      x: (Math.random() - 0.5) > 0 ? true : false,
      y: (Math.random() - 0.5) > 0 ? true : false
    }
  }
  move() {
    // 超出边界时反向运动
    if ((this.directions.x && this.x + this.radius >= this.box.width) || (!this.directions.x && this.x - this.radius <= 0)) {
      this.directions.x = !this.directions.x;
    }
    if ((this.directions.y && this.y + this.radius >= this.box.height) || (!this.directions.y && this.y - this.radius <= 0)) {
      this.directions.y = !this.directions.y;
    }
    this.tranlateX = this.directions.x ? Math.round(0.5 + Math.random()) : -Math.round(0.5 + Math.random());
    this.tranlateY = this.directions.y ? Math.round(0.5 + Math.random()) : -Math.round(0.5 + Math.random());
    this.x += this.tranlateX;
    this.y += this.tranlateY;
  }
}
updateCanvasSize();
createDots();
window.requestAnimationFrame(draw);

$(window).on('resize', function() {
  ctx.clearRect(0, 0, winW, winH);
  updateCanvasSize();
  createDots();
});
