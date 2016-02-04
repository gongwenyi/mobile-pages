$(function() {
  var $container = $('#img-container'),
    $window = $(window),
    $largeBox = $('.large-box'), //大图容器
    $largeImg = $largeBox.find('.large-img'), //大图
    win_width = $window.width()>640 ? 640 : $window.width(), //窗口宽度
    win_height = $window.height(), //窗口高度
    padding = 2, //li的margin
    totalLi = 17, //图片的总数
    li_size = 0; //li的宽度、高度

  //初始化图片
  li_size = Math.floor((win_width - 2 * padding) / 3); //计算li的宽高
  var html = '';
  for (var i = 1; i <= totalLi; i++) {
    var p = padding;
    if (i % 3 == 1) {
      p = 0;
    }
    html += '<li data-id="' + i + '"class="animated bounceIn" style="width:' + li_size + 'px;height:' + li_size + 'px;padding-top:' + padding + 'px;padding-left:' + p + 'px"><img src="img/' + i + '.jpg"</li>';
  }

  $container.html(html);

  //查看大图
  var current_id = 0; //当前大图的id
  $container.on('tap', 'li', function() {
    $largeBox.show();
    var id = $(this).attr('data-id');
    current_id = id;
    loadingImg(id);
  });
  //加载大图
  function loadingImg(id, callback) {
    var src = 'img/' + id + '.jpg',
      imgObj = new Image();
    imgObj.src = src;
    imgObj.onload = function() {
      var width = this.width, //大图的真实宽度、高度
        height = this.height,
        show_width = show_height = 0, //大图最终显示的宽度、高度
        paddingLeft = paddingTop = 0; //大图的左边距、上边距
      show_width = parseInt(win_height * width / height);
      paddingLeft = (win_width - show_width) / 2;
      show_height = parseInt(win_width * height / width);
      paddingTop = (win_height - show_height) / 2;
      $largeImg.css('width', 'auto').css('height', 'auto').css('padding-left', 0).css('padding-top', 0);
      if (height / width > 1.2) { //图片的高度比宽度大（竖图）
        $largeImg.attr('src', src).height(win_height).css('padding-left', paddingLeft);
      } else { //图片的高度比宽度小（横图）
        $largeImg.attr('src', src).width(win_width).css('padding-top', paddingTop);
      }
    }
    callback && callback();
  };
  //关闭大图
  $largeBox.on('tap', function() {
    $(this).hide();
  });
  //左滑动显示下一张
  $largeBox.swipeLeft(function() {
    current_id++;
    if (current_id > totalLi) {
      current_id = 1;
    }
    loadingImg(current_id, function() {
      $largeImg[0].addEventListener('webkitAnimationEnd', function() {
        $largeImg.removeClass('animated bounceInRight');
        $largeImg[0].removeEventListener('webkitAnimationEnd');
      }, false);
      $largeImg.addClass('animated bounceInRight');
    });
  });
  //右滑动显示上一张
  $largeBox.swipeRight(function() {
    current_id--;
    if (current_id < 1) {
      current_id = totalLi;
    }
    loadingImg(current_id, function() {
      $largeImg[0].addEventListener('webkitAnimationEnd', function() {
        $largeImg.removeClass('animated bounceInLeft');
        $largeImg[0].removeEventListener('webkitAnimationEnd');
      }, false);
      $largeImg.addClass('animated bounceInLeft');
    });
  });
});