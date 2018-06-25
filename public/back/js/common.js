// 5. 如果当前用户没有登录, 需要拦截到登陆页面
//    前端是不知道用户是否登陆了的, 但是后台知道, 想知道, 问后台, (访问后台接口即可)
//    注意: 需要将登录页, 排除在外面, 就是登录页可以不登录就访问的
if(location.href.indexOf("login.html")===-1){
  $.ajax({
    type:"get",
    // data
    url:"/employee/checkRootLogin",
    dataType:"json",
    success:function(info){
      console.log(info)
      if(info.error===400){
        // 未登录 直接跳转到登录页
        location.href="login.html";
      }
      if(info.success){
        console.log("当前用户已登录")

      }

    }
  })

}
// 实现进度条功能 (给 ajax 请求加), 注意需要给所有的 ajax 都加
// 发送 ajax 开启进度条, ajax结束, 关闭进度条

// 第一个ajax发送时, 开启进度条
$(document).ajaxStart(function () {
  console.log(1)
  NProgress.start();
});
// 所有的ajax请求完成时调用, 关闭进度条
$(document).ajaxStop(function () {
  console.log(1)
  // NProgress.done();
  //模拟网络延迟
  setTimeout(function(){
    NProgress.done();
  },1000)

});

//左侧的部分显示影藏 
$(".lt_aside .category").click(function(){
  $(".lt_aside .child").stop().slideToggle();
})

$(".lt_main .icon_menu").click(function(){
  $(".lt_aside").toggleClass("hiddenMenu");
  $(".lt_main").toggleClass("hiddenMenu");
  $(".lt_topbar").toggleClass("hiddenMenu");


})
// 只需一行 JavaScript 代码，即可通过元素的 id myModal 调用模态框：

// $('#myModal').modal(options)
$(".icon_logout").click(function(){
  $('#logoutModal').modal("show")

})

//当点击退出按钮的时候  需要销毁用户的登录状态 
$(".logoutBtn").click(function(){
  $.ajax({
    type:"get",
    url:"/employee/employeeLogout",
    dataType:"json",
    success:function(info){
      if(info.success){
        //跳转到登录页
        location.href="login.html";

      }


    }
  })
})