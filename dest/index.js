/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "index.js";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var canvas = document.createElement('canvas');
	document.body.appendChild(canvas);
	canvas.style.position = 'absolute';
	canvas.style.top = '50%';
	canvas.style.left = '50%';
	var ctx = canvas.getContext('2d');
	// network的中心焦点
	var originDot = null;
	// network连接点集合
	var targetDots = {
	  maxNum: 15,
	  dom: []
	};
	// 更换network焦点的时间step
	var step_changeorigindot = 0;
	var timer_changeorigindot = null;
	// network绘制的区域限制
	var lineBox = {
	  width: 600,
	  height: 500,
	  box: {}
	};

	var winW = undefined,
	    winH = undefined;
	// 所有绘制圆点的集合
	var dots = {
	  sum: 80,
	  dom: []
	};

	//canvas充满屏幕
	function updateCanvasSize() {
	  winW = document.documentElement ? document.documentElement.clientWidth * 0.8 : document.body.clientWidth * 0.8;
	  winH = document.documentElement ? document.documentElement.clientHeight * 0.6 : document.body.clientHeight * 0.6;
	  canvas.width = winW;
	  canvas.height = winH;
	  canvas.style.marginTop = -winH / 2 + 'px';
	  canvas.style.marginLeft = -winW / 2 + 'px';
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
	    for (var i = 0, sum = dots.sum; i < sum; i++) {
	      var dot = dots.dom[i];
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
	  for (var i = 0, sum = dots.sum; i < sum; i++) {
	    var x = Math.random() * winW;
	    var y = Math.random() * winH;
	    var dot = new Dot(x, y, winW, winH);
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
	  for (var i = 0, sum = dots.sum; i < sum; i++) {
	    var dot = dots.dom[i];
	    if (dot.x >= lineBox.box.left && dot.x <= lineBox.box.right && dot.y >= lineBox.box.top && dot.y <= lineBox.box.bottom) {
	      if (targetDots.dom.length < targetDots.maxNum) {
	        targetDots.dom.push(dot);
	        ctx.moveTo(originDot.x, originDot.y);
	        ctx.lineTo(dot.x, dot.y);
	      }
	    }
	  }
	  for (var i = 0, len = targetDots.dom.length; i < len; i++) {
	    var _index = i === len - 1 ? 0 : i + 1;
	    if (_index < len) {
	      ctx.moveTo(targetDots.dom[i].x, targetDots.dom[i].y);
	      ctx.lineTo(targetDots.dom[_index].x, targetDots.dom[_index].y);
	    }
	  }
	  ctx.stroke();
	}
	//获取焦点
	function getOriginDot() {
	  var index = Math.floor(Math.random() * dots.sum);
	  originDot = dots.dom[index];
	}
	//圆点class

	var Dot = (function () {
	  function Dot(x, y, boxW, boxH) {
	    _classCallCheck(this, Dot);

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
	      x: Math.random() - 0.5 > 0 ? true : false,
	      y: Math.random() - 0.5 > 0 ? true : false
	    };
	  }

	  _createClass(Dot, [{
	    key: 'move',
	    value: function move() {
	      // 超出边界时反向运动
	      if (this.directions.x && this.x + this.radius >= this.box.width || !this.directions.x && this.x - this.radius <= 0) {
	        this.directions.x = !this.directions.x;
	      }
	      if (this.directions.y && this.y + this.radius >= this.box.height || !this.directions.y && this.y - this.radius <= 0) {
	        this.directions.y = !this.directions.y;
	      }
	      this.tranlateX = this.directions.x ? Math.round(0.5 + Math.random()) : -Math.round(0.5 + Math.random());
	      this.tranlateY = this.directions.y ? Math.round(0.5 + Math.random()) : -Math.round(0.5 + Math.random());
	      this.x += this.tranlateX;
	      this.y += this.tranlateY;
	    }
	  }]);

	  return Dot;
	})();

	updateCanvasSize();
	createDots();
	window.requestAnimationFrame(draw);

	window.onresize = function () {
	  ctx.clearRect(0, 0, winW, winH);
	  updateCanvasSize();
	  createDots();
	};

/***/ }
/******/ ]);