function WolfSlide(sTotalBox, mySetting) {

  this.setting = {
    sSlideBox: '.wolf-main',
    sIndex: '.wolf-index',
    iNow: 0,
    iTime: 2500,
    iDuration: '1s'
  };
  
  for (var key in mySetting) {
    this.setting[key] = mySetting[key];
  }
  
  this.oTotalBox = document.querySelector(sTotalBox);
  this.oSlideBox = this.oTotalBox.querySelector(this.setting.sSlideBox);
  this.oIndex = this.oTotalBox.querySelector(this.setting.sIndex);
  this.oInter = null; //定时器

  this.aSlideList = this.oSlideBox.children; //列表子节点
  this.aIndexList = this.oIndex.children;    //索引子节点

  this.iDuration = this.setting.iDuration; //完全过渡所需要的时间
  this.iTime = this.setting.iTime; //自动轮播的时间间隔
  this.iNow = this.setting.iNow; //移动到第几个元素
  this.iStartX = 0; //记录手指开始按下的X坐标
  this.iStartTranslateX = 0; //物体移动到的X坐标
  
  this.init();
}

WolfSlide.prototype.init = function () {

  var sHtml = '';

  for (var i = 0; i < this.aSlideList.length; i++) {
    sHtml += '<div></div>';
  }

  this.oIndex.innerHTML = sHtml;


  this.tab(); //初始化选项
  this.setInterval(); //初始化定时器
  this.aIndexListClick(); //初始化索引列表点击事件

  this.oSlideBox.addEventListener('touchstart', this.touchstartX.bind(this), false);
  this.oSlideBox.addEventListener('touchmove', this.touchmoveX.bind(this), false);
  this.oSlideBox.addEventListener('touchend', this.touchendX.bind(this), false);
}

WolfSlide.prototype.tab = function () {
  var aSlideList = this.aSlideList;
  var aIndexList = this.aIndexList;

  this.oSlideBox.style.WebkitTransition = this.iDuration;
  this.oSlideBox.style.transition = this.iDuration;
  this.oSlideBox.style.WebkitTransform = 'translateX(' + (-this.iNow * this.oSlideBox.offsetWidth) + 'px)';
  this.oSlideBox.style.transform = 'translateX(' + (-this.iNow * this.oSlideBox.offsetWidth) + 'px)';


  for (var i = 0; i < aSlideList.length; i++) {
    aSlideList[i].classList.remove('on');
    aIndexList[i].classList.remove('on');
  }
  aSlideList[this.iNow].classList.add('on');
  aIndexList[this.iNow].classList.add('on');
}

WolfSlide.prototype.setInterval = function () {
  this.oInter = setInterval(function () {
    this.iNow++;
    this.iNow = this.iNow % this.aSlideList.length;
    this.tab();
  }.bind(this), this.iTime);
}

WolfSlide.prototype.aIndexListClick = function () {
  var aIndexList = this.aIndexList;

  for (var i = 0; i < aIndexList.length; i++) {
    aIndexList[i].addEventListener('click', function (iIndex) {
      clearInterval(this.oInter);
      this.iNow = iIndex;
      this.tab();
      this.setInterval();
    }.bind(this, i), false);
  }

}

WolfSlide.prototype.touchstartX = function () {
  var touchOne = event.changedTouches[0];
  clearInterval(this.oInter);
  this.oSlideBox.style.transition = 'none';;
  this.iStartX = touchOne.pageX; //记录手指开始按下的X坐标
  this.iStartTranslateX = (-this.iNow * this.oSlideBox.offsetWidth);
}

WolfSlide.prototype.touchmoveX = function () {
  var touchOne = event.changedTouches[0];
  var iMoveX = touchOne.pageX - this.iStartX; //计算按下时，和当前移动到的坐标的差值
  this.oSlideBox.style.WebkitTransform = this.oSlideBox.style.transform = 'translateX(' + (this.iStartTranslateX + iMoveX) + 'px)';
}

WolfSlide.prototype.touchendX = function () {
  var touchOne = event.changedTouches[0];
  var iMoveX = touchOne.pageX - this.iStartX;

  this.iNow = (this.iStartTranslateX + iMoveX) / this.oSlideBox.offsetWidth;
  this.iNow = -Math.round(this.iNow);
  if (this.iNow < 0) {
    this.iNow = 0;
  }
  if (this.iNow > this.aSlideList.length - 1) {
    this.iNow = this.aSlideList.length - 1;
  }
  this.tab();
  this.setInterval();
}
