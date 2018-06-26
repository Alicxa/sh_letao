$(function(){


// 发送ajax请求 获取后台数据进行渲染表格

$.ajax({
  type:"get",
  url:"/user/queryUser",
  dataType:"json",
  data:{
    page:1,
    pageSize:5
  },
  success:function(info){
    console.log(info)
    var data=template("tmp",info)
    $("tbody").html(data);

  }
})
})