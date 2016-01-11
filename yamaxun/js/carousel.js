;(function($, window, document, undefined){
  var Carousel = function(element){
    
    this.$ele = element;    //父容器
    this.$lis = this.$ele.find('ul li');
    this.$imgs = this.$ele.find('img');
    this.$nav = this.$ele.find('div');
    this.$spans = this.$ele.find('div span');
    this.current_index = 0; //当前图片的下标
    this.next_index = 0;    //下一张图片的下标
    this.prev_index = 0;    //上一张图片的下标
    this.isAnimate = false; //是否处于动画中的状态标识
    this.defaults = {       //默认参数配置
      'autoplay' : true,    //是否自动播放
      'duration' : 1000,    //动画持续时间
      'delay' : 5000,       //播放的时间间隔
      'nav' : false         //是否显示图片导航
    };
    //合并参数
    $.extend(this.defaults, this.getSetting());
    //根据配置参数设置容器高度以及是否显示图片导航
    this.setSetting();
    //监听滑动事件
    this.move();
    //自动播放
    this.autoplay();
  };
  Carousel.prototype = {
    getSetting : function(){
      var setting = this.$ele.attr('data-setting');
      return (setting && setting!="") ? $.parseJSON(setting) : {};
    },
    setSetting : function(){
      //根据图片的高度设置容器的高
      var height = this.$imgs.eq(0).height();
      this.$ele.css({
        height: height
      });
      
      //是否显示图片导航
      if(this.defaults.nav){
        this.$nav.css('display','block');
      }else{
        this.$nav.css('display','none');
      }
    },
    move : function(){
      var self = this;
      var startX = startY = 0;
      this.$ele[0].addEventListener('touchstart', function(e){
        var touches = e.touches[0];
        startX = touches.pageX;
        startY = touches.pageY;
      }, false);
      this.$ele[0].addEventListener('touchmove', function(e){
        var touches = e.touches[0];
        var endX = touches.pageX,
            endY = touches.pageY,
            moveX = endX - startX,
            moveY = endY - startY;
        if(moveX<0 && Math.abs(moveX)>Math.abs(moveY)){
          self.moveLeft();
        }else if(moveX>0 && Math.abs(moveX)>Math.abs(moveY)){
          self.moveRight();
        }
      }, false);
    },
    moveLeft : function(){
      var self = this;
      if(this.isAnimate){
        return false;
      }
      this.isAnimate = true;
      this.next_index = this.current_index + 1;
      this.next_index = this.next_index >= this.$lis.length ? 0 : this.next_index;
      this.$lis.eq(this.current_index).animate({'left':'-100%'},this.defaults.duration);
      this.$lis.eq(this.next_index).css({'left':'100%','z-index':10}).animate({'left':0},this.defaults.duration,function(){self.isAnimate=false;});
      this.current_index++;
      this.current_index = this.current_index >= this.$lis.length ? 0 : this.current_index;
      this.$spans.removeClass('current').eq(this.current_index).addClass('current');
    },
    moveRight : function(){
      var self = this;
      if(this.isAnimate){
        return false;
      }
      this.isAnimate = true;
      this.prev_index = this.current_index - 1;
      this.prev_index = this.next_index < 0 ? this.$lis.length-1 : this.prev_index;
      this.$lis.eq(this.current_index).animate({'left':'100%'},this.defaults.duration);
      this.$lis.eq(this.prev_index).css({'left':'-100%','z-index':10}).animate({'left':0},this.defaults.duration,function(){self.isAnimate=false;});
      this.current_index--;
      this.current_index = this.current_index < 0 ? this.$lis.length-1 : this.current_index;
      this.$spans.removeClass('current').eq(this.current_index).addClass('current');
    },
    autoplay : function(){
      var self = this;
      if(this.defaults.autoplay){
        window.setInterval(function(){self.moveLeft();},self.defaults.delay);
      }
    }
  };

  Carousel.init = function(carousel){
    var _this_ = this;
    carousel.each(function(){
      new _this_($(this));
    })
  };

  window['Carousel'] = Carousel;

})(jQuery, window, document);