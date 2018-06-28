$(function () {

  // 进度条功能
  $(document).ajaxStart(function () {
    //开启进度条
    NProgress.start();


  })
  $(document).ajaxStop(function () {
    //关闭进度条
   setTimeout(function(){
    NProgress.done();
   },3000)
  })


  //拦截登录功能
  //因为在login页面是不需要拦截的  所以要做判断
  if (location.href.indexOf("login.html") === -1) {
    $.ajax({
      type: "get",
      url: "/employee/checkRootLogin",
      dataType: "json",
      success: function (info) {
        console.log(info)
        if (info.success) {
          console.log("用户已经登录")
        }
        if (info.error === 400) {
          location.href = "login.html";
        }
      }
    })
  }

  // 侧边栏里面 点击分类下拉效果
  $(".cate").click(function () {
    $(".cate .child").stop().slideToggle()
  })
  // 点击菜单按钮侧边栏消失效果
  $(".icon_menu").click(function () {
    $(".lt_aside").toggleClass("hiddenMenu")
    $(".lt_topBar").toggleClass("hiddenMenu")
    $(".lt_main").toggleClass("hiddenMenu")
  })

  //当点击 退出按钮 弹出模态框 
  $(".icon_logOut").click(function () {
    $("#logoutModal").modal("show")

  })

  //当点击模态框里面的退出按钮  退出登录
  $(".logOutBtn").click(function () {
    $.ajax({
      type: "get",
      url: "/employee/employeeLogout",
      dataType: "json",
      success: function (info) {
        if (info.success) {
          location.href = "login.html"

        }

      }
    })
  })
  

})