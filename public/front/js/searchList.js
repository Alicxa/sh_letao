$(function () {
  //当我们进入页面的时候 解析地址栏的参数
  var key = getSearch("key");
  //将拼接的内容赋值给input
  $(".search_input").val(key);

  render()
  //渲染数据
  function render() {
    $(".lt_product ul").html(' <div class="loading"></div>');
    // console.log(key)
    var params = {};
    params.proName = $(".search_input").val();
    params.page = 1;
    params.pageSize = 100;

    //还有两个可选参数
    var $current=$(".sort .current");
    if( $current.length>0){
      //大于零 则证明有current类 就有高亮 需要排序
      var sortName=$current.data("type");
      var sortValue=$current.find("i").hasClass("fa-angle-down")?2:1;//排序的值
      params[sortName]=sortValue;
      

    }
    
    //模拟网络延迟

   setTimeout(function(){
    //  console.log(1)
    $.ajax({
      type: "get",
      dataType: "json",
      url: "/product/queryProduct",
      data:  params,
      success: function (info) {
        // console.log(info);

        var data = template("tmp", info);
        $(".lt_product ul").html(data);
      }
    })
   },500)
  }


  //点击搜索按钮 进行搜索
  $(".search_btn").click(function () {

    key = $(".search_input").val();
    // console.log(key);
    if (key === "") {
      mui.toast("请输入搜索关键字");
      return;
    }

    render();

    //接下来的操作
    // 获取数组
    var str = localStorage.getItem("search_list") || "[]";
    var arr = JSON.parse(str);// 1. 不能重复
    var index = arr.indexOf(key);
    if (index > -1) {
      arr.splice(index, 1);
    }
    // 2. 不能超过 10 个
    if (arr.length >= 10) {
      arr.pop();
    }

    //添加到数组的最前面
    arr.unshift(key);

    //将数组存起来 
    localStorage.setItem("search_list", JSON.stringify(arr));
    //清空搜索框 
    $(".search_input").val("");





  })

  //添加排序的功能
  $(".sort a[data-type]").click(function(){
    if($(this).hasClass("current")){
      //有类名就切换箭头方向
      $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up")
    }else{
      //没有类名就添加类名 
     $(this).addClass("current").siblings().removeClass("current");

    }

    render()
  })


})