var remindData;
 $.ajax({
        url : "${ctx}/daily_management/work_calendar/pmWorkCalendar/findAllRemindDateJson",
        type : "post",
        async : false,  // 默认是true：异步，false：同步
        data:{"create_by":'${fns:getUser().id}'},
        //traditional : true,
        dataType : "jsonp",//数据类型为jsonp  
        jsonp: "jsonpCallback",//服务端用于接收callback调用的function名的参数
        error : function(errorThrown) {
                console.log(errorThrown);
        },  
        success : function(data) {
             //date：data[j] 格式 2017/09/24
               remindData = data;
        }
    }); 
 $.ajax({
        type: "POST", //请求的方式，也有get请求
        url: "data.json", //请求地址，后台提供的,这里我在本地自己建立了个json的文件做例子
        data: {name:name},//data是传给后台的字段，后台需要哪些就传入哪些
        dataType: "json", //json格式，后台返回的数据为json格式的。
        success: function(result){
            var dataObj = result, //返回的result为json格式的数据
            con = "";
            $.each(dataObj, function(index, item){
                con += "<li>姓名："+item.name+"</li>";
                con += "<li>性别："+item.sex+"</li>";
                con += "<li>现居地："+item.address+"</li>";
                con += "<li>岗位："+item.job+"</li>";
            });
            console.log(con);    //可以在控制台打印一下看看，这是拼起来的标签和数据
            $("#con").html(con); //把内容入到这个div中即完成
        }    
    })