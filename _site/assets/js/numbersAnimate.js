/*
 * 数字上下滚动切换
 */
$.fn.numbersAnimate = function(_option) {

  var option = $.extend({
    numbers: 0,
    duration: 1500,
    percent: false,   //百分数处理
    thousands: false  //千分数处理
    // separator: ","
  }, _option);

  var that = this,
      number = option.numbers.toString().replace(/[ ]/g, "");//去除空格

  animate();

  function animate() {
    $(that).empty();

    //数字千分位处理
    if (option.thousands === true && !isNaN(number)) {
      number = number.toString();
      var index = number.indexOf(".");

      if (index == -1) {
        //无小数点
        var reg = /(-?\d+)(\d{3})/;
        while (reg.test(number)) {
          number = number.replace(reg, "$1,$2");
        }
      } else {
        var intPart = number.substring(0, index);
        var pointPart = number.substring(index + 1, number.length);
        var reg = /(-?\d+)(\d{3})/;
        while (reg.test(intPart)) {
          intPart = intPart.replace(reg, "$1,$2");
        }
        number = intPart + "." + pointPart;
      }
    }

    //百分数处理
    if (option.percent === true && !isNaN(number)) {
      number = Number(number*100).toFixed(2) + "%";
    }


    var array = number.split("");
    var dot_count = 0;
    //遍历数组
    for (var i = 0; i < array.length; i++) {
      var currentN = array[i];
      //数字append进容器
      var t = $("<span></span>");

      $(t).css("margin-left", (i - dot_count) * 18 + dot_count * 12 + "px");
      //非数字特殊处理
      if (isNaN(currentN)) {
        if (currentN == "." || currentN == ",") {
          dot_count++;
        }
        $(t).append("<span class=\"main\"><span>" + currentN + "</span></span>");
      } else {
        $(t).append("<span class=\"childNumber\">" + array[i] + "</span>");
      }
      $(that).append(t);
      //生成滚动数字,根据当前数字大小来定
      for (var j = 0; j <= currentN; j++) {
        var tt;
        if (j == currentN) {
          tt = $("<span class=\"main\"><span>" + j + "</span></span>");
        } else {
          tt = $("<span class=\"childNumber\">" + j + "</span>");
        }
        $(t).append(tt);
        $(tt).css("margin-top", (j + 1) * 25 + "px");
      }

      $(t).animate({
        marginTop: -((parseInt(currentN) + 1) * 25) + "px"
      }, option.duration, function() {
        $(this).find(".childNumber").remove();
      });
    }
  }
}
