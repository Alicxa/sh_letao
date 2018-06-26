$(function(){


// 发送ajax请求 获取后台数据进行渲染表格
var currentPage=1;
var pageSize=5;
//声明变量 标记当前选中的用户 
var currentId;
var isDelete;
render()
function render(){
  $.ajax({
    type:"get",
    url:"/user/queryUser",
    dataType:"json",
    data:{
      page:currentPage,
      pageSize:pageSize
    },
    success:function(info){
      // console.log(info)
      var data=template("tmp",info)
      $("tbody").html(data);

      // 分页功能
      $("#paginator").bootstrapPaginator({
        bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
        currentPage:info.page,//当前页
        totalPages:Math.ceil(info.total/info.size),//总页数
        
        onPageClicked:function(event, originalEvent, type,page){
          //为按钮绑定点击事件 page:当前点击的按钮值
          currentPage=page;
          render()
        }
      });


  
    }
  })
}
// 使用事件委托  让模态框出现
$("tbody").on("click",".btn",function(){
  //模态框显示
  $("#userModal").modal("show");
  //获取Id
  currentId=$(this).parent().data("id")
  // console.log(currentId)
  //判断用户是否包含红色的类名 如果有就需要禁用
  isDelete=$(this).hasClass("btn-danger")?0:1;

})
//点击确认按钮 发送ajax请求
$(".userBtn").click(function(){
 
  $.ajax({
    type:"post",
    url:"/user/updateUser",
    dataType:"json",
    data:{
      id:currentId,
      isDelete:isDelete
    },
    success:function(info){
      // console.log(info)
      if(info.success){
        // 重新渲染
        render()
        //关闭模态框
         //模态框隐藏
         $("#userModal").modal("hide");
      }

    }
  })

})


})