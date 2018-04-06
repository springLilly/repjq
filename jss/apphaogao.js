$(function() {
    var review = (function() {
      var scoreNumber = "";
      function transmits() {
        //地址栏传数据 获取本页的Id
        var url = decodeURI(location.search);
        var object = {};
        if (url.indexOf("?") != -1) {
          var str = url.substr(1);
          var strs = str.split("=");
        }
        return strs;
      }
      var loads = transmits();
      init = function() {
        loadTime();//加载倒计时
        loadReview();//初始化数据
        loadArticle();//加载篇数
        //点击好稿评审让按钮显示
        $("header h4").on("tap", function (e) {
            e.stopPropagation();
            $(".header_buttons").toggle();
        });
        //点击按钮替换好稿评审后的标签
        $(".header_buttons button").each(function () {
            $(this).on("tap", function (e) {
              e.preventDefault();
              $("#show").html($(this).html());
              $(".header_buttons").hide();
              loadReview();
            })
        });
        //选择model的按钮触发的事件
        $("#cover").on("tap",function() {
            $("footer").hide();
            $("section article input").val(scoreNumber);
            $("section article input").focus();
        })
        $("#onlyScore").on("tap",function() {
            $("footer").hide();
            $("section article input").each(function() {
                if($(this).val() == 0){
                    $(this).val(scoreNumber);
                    $(this).focus();
                }
            })
        })
        //提交
        $("#sub").on("tap",function() {
            loadSubmit();
        })
      }
      var loadReview = function (pageNo) {//初始化加载数据
        var spanId = $(".selected")[0];
          $.ajax({
              url: "./projectArticleList.php",
              data: {"projectId":loads[1],"searchType":$(spanId).attr("searchType")},
              type: "GET",
              dataType: "json",
              success: function (data) {
                  if (data.code == "SUCCESS") {
                      var div = "";
                      $.each(data.map.articleList,function(index,value) {
                          div += "<article><div class='lefbox'><div class='huabox'><div class='txtbox'><ul><li style='float: right'><span class='exclusive' data-id='" + value.exclusive + "'>独</span><span class='contrive' data-id='" + value.contrive + "'>策</span></li>";
                          div += "<li id='" + value.id + "'><span class='project' title='" + value.topic + "'>" + value.topic + "</span></li>";
                          div += "<li style='margin: .02666667rem 0 .12rem' class='author' title='" + value.author + "'>" + value.author + "</li>";
                          div += "<li style='float:left'>版次：<span style='margin-right:0.1rem'>" + value.editon + "</span>体裁：<span>" + value.themes + "</span></li>";
                          div += "<li style='text-align: right;'><a class='layoutPathImg' href='javascript:;' attrid='"+value.attr_id+"' docLibid='"+value.doc_lib_id+"'>版面预览</a></li></ul></div></div>";
                          div += "<div class='score'><input name='slider-2' class='pingfen' id='slider-2' data-highlight='true' min='0' max='100' value='"+value.score+"' type='text' style='border:none;font-size: .18666667rem'></div></div><button class='scoreAll'>同步分数</button></article>"
                      })
                      $("section").html(div);
                      $("section #slider-2").slider({});//动态添加的mobile滑块事件触发
                      loadScore();
                      //标题 作者超出为省略号
                      var maxwidth = 13,authorMax = 3;
                      $("section article .project").each(function() {
                          if($(this).text().length > maxwidth){
                              $(this).text($(this).text().substring(0,maxwidth));
                              $(this).html($(this).html() + '…');
                          }
                      });
                      $("section article .author").each(function() {
                          var authorArr = $(this).text().split(",");
                          if(authorArr.length > authorMax){
                              $(this).text(authorArr[1] + "," + authorArr[2] + ",");
                              $(this).html($(this).html() + '…');
                          }
                      });
                      //独和策是否显示
                      $(".txtbox li span.exclusive").each(function(){
                          if($(this).attr("data-id")==1){
                              $(this).show()
                          }else{
                              $(this).hide()
                          }
                      })
                      $(".txtbox li span.contrive").each(function(){
                          if($(this).attr("data-id")==1){
                              $(this).show()
                          }else{
                              $(this).hide()
                          }
                      })
                      //点击标题触发链接
                      $("section article .project").each(function() {
                          $(this).on("tap", function(e) {
                              e.stopPropagation();
                              location.href = "./gaojianyulan.html?projectId=" + $(this).parent("li").attr("id");
                          });
                      })
                      //点击同步分数
                      loadBtn();
                      //点击版面预览
                      loadlayoutPath();
                  }
              } 
          })
      }
      loadScore = function() {
          var expansion = null; //用于判断是否存在滑动的contents
          var container = document.querySelectorAll('article .huabox div');
          for (var index = 0; index < container.length; index++) {
              var x, y, X, Y, swipeX, swipeY;
              //监听左滑盒子的触摸事件
              container[index].addEventListener('touchstart', function (event) {
                //获取触摸点的坐标targetTouches[0].pageX,Y 
                x = event.changedTouches[0].pageX;
                    y = event.changedTouches[0].pageY;
                    swipeX = true;
                    swipeY = true;
                    if (expansion) {
                        //判断是否展开，如果展开则收起
                        expansion.parents('article').attr('class','swiperight');
                    }
              });
              //监听左滑盒子的屏幕上滑动事件 touchmove事件：当手指在屏幕上滑动的时候连续地触发。
              container[index].addEventListener('touchmove', function (event) {
                X = event.changedTouches[0].pageX;
                Y = event.changedTouches[0].pageY;
                //判断左右滑动
                if (swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0) {
                    event.stopPropagation();
                    if (X - x > 10){   //右滑
                        event.preventDefault();
                        $(this).parents('article').attr('class','swiperight');
                    }
                    if (x - X > 10) {   //左滑
                        event.preventDefault();
                        //this.className = "swipeleft";   //左滑展开
                        $(this).parents('article').attr('class','swipeleft');
                        expansion = $(this);
                    }
                    swipeY = false;
                }
                // 上下滑动
                if (swipeY && Math.abs(X - x) - Math.abs(Y - y) < 0) {
                    swipeX = false;
                }
              })
            };

      }
      //加载时间和主持评委
      loadTime = function() {
        $.ajax({
            url: "./projectArticleDetailInit.php",
            data: {},
            type: "GET",
            dataType: "json",
            success: function(data) {
               if (data.code == "SUCCESS") {
                  $("#mainJudgeName").text(data.map.appriseProject.mainJudgeName);
                  getCountDown(data.map.appriseProject.appraiseEndDate);
                  //时政和专刊篇数设置，先写死，有时间再变化
                  $.each(data.map.articleTypeCount,function(index,value){
                      if(value.typeCode == "1"){
                          $(".politics").html("" + value.count);
                      }else{
                          $(".special").html(""  + value.count);
                      }
                  })
               }
            }
        })
      }
      //倒计时
      getCountDown = function(timestamp) {
          var times = Date.parse(new Date());
          clearTime = setInterval(function() {
              var nowTime = new Date();
              var t = timestamp - nowTime.getTime();
              var hour = Math.floor(t / 1000 / 60 / 60 % 24);
              var min = Math.floor(t / 1000 / 60 % 60);
              var sec = Math.floor(t / 1000 % 60);
    
              if (hour < 10) {
                  hour = "0" + hour;
              }
              if (min < 10) {
                  min = "0" + min;
              }
              if (sec < 10) {
                  sec = "0" + sec;
              }
              var countDownTime = hour + ":" + min + ":" + sec;
              $("#appraiseDate").text(countDownTime).css("color","#f00");
            
          },1000);
          if (times > timestamp) {
              clearInterval(clearTime);
              $("#appraiseDate").text("00:00:00");
          }
      }
      loadArticle = function() {//加载篇数
          $.ajax({
              url: "./articleStatusCount.php",
              data: {},
              type: "GET",
              dataType: "json",
              success: function(data) {
                  $("#hasPointCount").text(data.map.hasPointCount);
                  $("#noPointCount").text(data.map.noPointCount);
                  $("#selected").text(Number($("#hasPointCount").text() + $("#noPointCount").text()));
                  $("#show").html("全部(" + $("#selected").text() + ")");
              }
          })
      }
      loadBtn = function() {//按钮点击触发事件
          $("section .scoreAll").on("tap",function() {
              $("footer").show();
              scoreNumber = $(this).parents("article").find("input").val();
          })
      }
      loadSubmit = function() {//提交
          $.ajax({
              url:"./projectArticleSubmit.do",
              data: {"projectId":loads[1]},
              dataType:"json",
              type:"POST",
              success:function(data) {
                  if (data.code=="SUCCESS") {
                      window.opener.falshDate.loadProject(1);
                      window.close();
                  }
              }
          })
      }
      loadlayoutPath = function() {//加载版面图
          $(".layoutPathImg").each(function() {
              $(this).on("tap",function() {
                  location.href = "./banmian.html?type=1&docLibId=" + $(this).attr("docLibid") + "&attId=" + $(this).attr("attrid");
              })
          })
      }
      return {
          init : init
      }
    })();
    $(function(){
        review.init();
    })
})