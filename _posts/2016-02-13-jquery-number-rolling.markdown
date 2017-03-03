---
layout: post
title:  "JQuery数字上下滚动"
date:   2016-02-12 20:17:08
categories: JS
comments: true
---

实现数字上下滚动动画效果。<br><br>

<style type="text/css">
  [class*="animateNumbers"] {
    float: left;
    position: relative;
    width: 29%;
    overflow: hidden;
    margin: 0 25px 10px 0;
    line-height: 30px;
    height: 30px;
  }
  [class*="animateNumbers"]:after {
    clear: both;
    display:block;
    content: '';
  }

  [class*="animateNumbers"] span {
    color: #13BEEC;
    font-size: 28px;
    font-weight: bold;
    font-family: Georgia, "Times New Roman", Times, serif;
    position: absolute;
  }
</style>

<div id="number2" class="animateNumbers-thousands" number="368921.57"></div>
<div id="number2" class="animateNumbers-percent" number="0.6708"></div>
<div id="number1" class="animateNumbers" number="126859.02"></div>
<p style="text-align:right; margin:20px 100px 100px 0;">
  <a href="javascript:void(0);" onClick="RandomNum(10000000,19999999)">随机切换数字</a>
</p>

<script type="text/javascript" src="{{ "/assets/js/jquery.min.js" | prepend: site.baseurl }}"></script>
<script type="text/javascript" src="{{ "/assets/js/numbersAnimate.js" | prepend: site.baseurl }}"></script>
<script>
  $(function() {
    $(".animateNumbers").each(function(idx, it){
      $(it).numbersAnimate({numbers: $(it).attr("number")});
    });

    $(".animateNumbers-thousands").each(function(idx, it) {
      $(it).numbersAnimate({
        numbers: $(it).attr("number"),
        thousands: true
      });
    });

    $(".animateNumbers-percent").each(function(idx, it) {
      $(it).numbersAnimate({
        numbers: $(it).attr("number"),
        percent: true
      });
    });

  });

  function RandomNum(m, a) {
    var Range = a - m;
    var Rand = Math.random();
    var newNum = (m + Math.round(Rand * Range));
    $(".animateNumbers").numbersAnimate({
      numbers: newNum,
      thousands: true,
      duration: 1500
    });
  }

</script>


## How to use

### Basic use

{% highlight js %}
$(selector).numbersAnimate(option);
{% endhighlight %}

>
**Option**
* numbers:  Number | String, the number to show, default value is 0;
* duration:  int, the duration of the animate, default value is 1500;
* percent:  Boolean, to show the percentage format of the number;
* thousands:  Boolean, to show the thousands format of the number.

<div style="height:40px">  </div>

## Source code

### numbersAnimate.js

```js
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
```

### HTML

{% highlight html %}
<!doctype html>
<html>

<head>
  <meta charset="utf-8">
  <title>Jq数字上下滚动切换插件</title>
  <style type="text/css">
  [class*="animateNumbers"] {
    float: left;
    position: relative;
    width: 29%;
    overflow: hidden;
    margin: 0 25px 10px 0;
    line-height: 30px;
    height: 30px;
  }
  [class*="animateNumbers"]:after {
    clear: both;
    display:block;
    content: '';
  }

  [class*="animateNumbers"] span {
    color: #13BEEC;
    font-size: 28px;
    font-weight: bold;
    font-family: Georgia, "Times New Roman", Times, serif;
    position: absolute;
  }
  </style>
</head>

<body>
  <div id="number2" class="animateNumbers-thousands" number="368921.57"></div>
  <div id="number2" class="animateNumbers-percent" number="0.6708"></div>
  <div id="number1" class="animateNumbers" number="126859.02"></div>
  <p style="text-align:right; margin:20px 100px 60px 0;">
    <a href="javascript:void(0);" onClick="RandomNum(10000000,19999999)">随机切换数字</a>
  </p>

<script type="text/javascript" src="/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="/numbersAnimate.js"></script>
<script type="text/javascript">
  $(function() {
    $(".animateNumbers").each(function(idx, it){
      $(it).numbersAnimate({numbers: $(it).attr("number")});
    });

    $(".animateNumbers-thousands").each(function(idx, it) {
      $(it).numbersAnimate({
        numbers: $(it).attr("number"),
        thousands: true
      });
    });

    $(".animateNumbers-percent").each(function(idx, it) {
      $(it).numbersAnimate({
        numbers: $(it).attr("number"),
        percent: true
      });
    });

  });

  function RandomNum(m, a) {
    var Range = a - m;
    var Rand = Math.random();
    var newNum = (m + Math.round(Rand * Range));
    $("#number3").numbersAnimate({
      numbers: newNum,
      thousands: true,
      duration: 1500
    });
  }
</script>
</body>
</html>
{% endhighlight %}
