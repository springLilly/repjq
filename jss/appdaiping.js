$(function(){
	var gooddraft = (function(){
		init = function(){
			loadGooddraft();//初始化数据
		}
		var loadGooddraft = function(){
			$.ajax({
				url: "./selectProjectList.php",
				data: {},
				type: "GET",
				dataType: "json",
				success: function(data){
					if(data.code == "SUCCESS"){
						var ul = "";
						$.each(data.map.appriseProjectList,function(index,value){
							ul += "<article><button id='"+value.id+"'><ul><li>"+value.appraiseDate+" &nbsp;待评稿件  &nbsp;第"+value.appraiseCount+"次</li>";
							ul += "<li style='margin: .02666667rem 0 .12rem'>待评稿件范围：<span>"+value.startDate+"~"+value.endDate+"</span></li>";
							ul += "<li style='float:left'>主持评委：<span>"+value.mainJudgeName+"</span></li>";
							if(value.status == "1"){
								ul += "<li style='text-align: right;'><span class='status'>待评</span></li></ul></button></article>";
							}else{
								ul += "<li style='text-align: right;'><span class='status'>已评</span></li></ul></button></article>";
							}
						})
						$("section").html(ul);
						$(".status").each(function(){
							if($(this).text() == "已评"){
								$(this).parents("button").attr("disabled",true);
								$(this).css({"color":"#AEAEAE","border":"1px solid #AEAEAE"})
							}else{
								$(this).parents("button").attr("disabled",false);
							}
						})
						$("article button").each(function(){
							$(this).on("tap",function(){
							 	location.href = "./apphaogao.html?projectId="+$(this).attr("id");
							})
						})
					}
				}
			})
		}
		return {
			init : init
		}
	})()
	$(function(){
		gooddraft.init();
	})
	
})