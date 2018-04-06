$(function() {
	var draft = (function() {
		function transmits() {
        	//地址栏传数据 获取本页的Id
        	var url = decodeURI(location.search);
        	var object = {};
        	if (url.indexOf("?") != -1){
          		var str = url.substr(1);
          		var strs = str.split("=");
        	}
        	return strs;
      	}
      	var loads = transmits();
		init = function() {
			loadDraft();
		},
		loadDraft = function() {
			$.ajax({
				url: "./recommend/articlePreview.do",
				data: {"docId":loads[1]},
				type: "GET",
				dataType: "json",
				success: function(dara) {
					if (data.code == "SUCCESS") {
						var docTopic,paperDate,doAuthor,docContent;
					    if(data.map.article.docTopic=="null" || data.map.article.docTopic==null){
					    	docTopic=" ";
					    }else{
					    	docTopic=data.map.article.docTopic;
					    }
					    if(data.map.article.paperDate=="null" || data.map.article.paperDate==null){
					    	paperDate=" ";
					    }else{
					    	paperDate=data.map.article.paperDate;
					    }
					    if(data.map.article.doAuthor=="null" || data.map.article.doAuthor==null){
					    	doAuthor=" ";
					    }else{
					    	doAuthor=data.map.article.doAuthor;
					    }
					    if(data.map.article.docContent=="null" || data.map.article.docContent==null){
					    	docContent=" ";
					    }else{
					    	docContent=data.map.article.docContent;
					    }
						$("#topic").text(docTopic);
						$("#data").text(paperDate);
						$("#author").text(doAuthor);
						$("#content").text(docContent);
						$("#link").on("tap",function() {
							location.href = data;
						})
					}
				}
			})
		}
		return {
          init : init
      	}
	})();
	$(function() {
        draft.init();
    });
})