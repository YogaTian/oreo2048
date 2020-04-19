var Board = require("./grid.js");
var Main = require("./main.js");

Page({ 
  data: {
    hidden: false,
    start: "开始游戏",
    num: [],
    score: 0,
    bestScore: 0, // 最高分
    endMsg: '',
    over: false  // 游戏是否结束 
  },
  // 页面渲染完成
  onReady: function () {
    if(!wx.getStorageSync("highScore"))
      wx.setStorageSync('highScore', 0);
    this.gameStart();
  },
  gameStart: function() {  // 游戏开始
    var main = new Main(4);
    this.setData({
      main: main,
      bestScore: wx.getStorageSync('highScore')
    });
    this.data.main.__proto__ = main.__proto__;
    
    this.setData({
      hidden: true,
      over: false,
      score: 0,
      num: this.data.main.board.grid
    });  
  },
  gameOver: function() {  // 游戏结束
    this.setData({
      over: true 
    });
  
    if (this.data.score >= 2048) {
      this.setData({ 
        endMsg: '恭喜达到2048！'
      });
      wx.setStorageSync('highScore', this.data.score);
    } else if (this.data.score > this.data.bestScore) {
      this.setData({
        endMsg: '创造新纪录！' 
      }); 
      wx.setStorageSync('highScore', this.data.score);
    } else {
      this.setData({
        endMsg: '游戏结束！'
      }); 
    } 
  },
  // 触摸
  touchStartX: 0,
  touchStartY: 0,
  touchEndX: 0,
  touchEndY: 0,
  touchStart: function(ev) { // 触摸开始坐标
    var touch = ev.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;

  },
  touchMove: function(ev) { // 触摸最后移动时的坐标
    var touch = ev.touches[0];
    this.touchEndX = touch.clientX;
    this.touchEndY = touch.clientY;
  },
  touchEnd: function() {
    var disX = this.touchStartX - this.touchEndX;
    var absdisX = Math.abs(disX);
    var disY = this.touchStartY - this.touchEndY;
    var absdisY = Math.abs(disY);

    if(this.data.main.isOver()) { // 游戏是否结束
      this.gameOver();
    } else {
      if (Math.max(absdisX, absdisY) > 10) { // 确定是否在滑动
          this.setData({
            start: "重新开始",
          });
        var direction = absdisX > absdisY ? (disX < 0 ? 1 : 3) : (disY < 0 ? 2 : 0);  // 确定移动方向
        var data = this.data.main.move(direction);
        this.updateView(data);
      }   
    }      
  },
  updateView(data) {
    var max = 0;
    for(var i = 0; i < 4; i++)
      for(var j = 0; j < 4; j++){
        switch (data[i][j]){
          case "平平有齐":
            data[i][j]=2;
            data[i][j]=parseInt(data[i][j]);
            break;
          case "琢炎如玉":
            data[i][j] = 4;
            data[i][j] = parseInt(data[i][j]);
            break;
          case "平生弋顾":
            data[i][j] = 8;
            data[i][j] = parseInt(data[i][j]);
            break;
          case "光明磊罗":
            data[i][j] = 16;
            break;
          case "飞行棋盘":
            data[i][j] = 32;
            break;
          case "雄剧一方":
            data[i][j] = 64;
            break;
          case "攻玉以石":
            data[i][j] = 128;
            break;
          case "百里透红":
            data[i][j] = 256;
            break;
          case "云淡风秦":
            data[i][j] = 512;
            break;
          case "乐园":
            data[i][j] = 1024;
            break;
          case "喝醋":
            data[i][j] = 2048;
            break;  
        }
        if(data[i][j] != "" && data[i][j] > max)
          max = data[i][j];
        switch (data[i][j]) {
          case 2:
            data[i][j] = "平平有齐";
            break;
          case 4:
            data[i][j] = "琢炎如玉";
            break;
          case 8:
            data[i][j] = "平生弋顾";
            break;
          case 16:
            data[i][j] = "光明磊罗";
            break;
          case 32:
            data[i][j] = "飞行棋盘";
            break;
          case 64:
            data[i][j] = "雄剧一方";
            break;
          case 128:
            data[i][j] = "攻玉以石";
            break;
          case 256:
            data[i][j] = "百里透红";
            break;
          case 512:
            data[i][j] = "云淡风秦";
            break;
          case 1024:
            data[i][j] = "乐园";
            break;
          case 2048:
            data[i][j] = "喝醋";
            break;
        }
      }
    this.setData({
      num: data,
      score: max
    });
  },
  onShareAppMessage: function() {
    return {
      title: '2048小游戏',
      desc: '来试试你能达到多少分',
      path: '/page/user?id=123'
    }
  }
})