$(function () {

  // var history=localStorage.getItem("search_list") || '[]';
  // // console.log(history)
  // // ["12","啊","1","耐克","阿迪","阿迪王","耐克王"]
  // var arr=JSON.parse(history);

  // var data=template("search_tmp",{arr:arr});
  // $(".lt_history").html(data)

  render()
  function getArr() {
    var history = localStorage.getItem("search_list") || '[]';
    var arr = JSON.parse(history);
    return arr;
  }
  //页面渲染
  function render() {
    var arr = getArr();
    var data = template("search_tmp", { arr: arr });
    $(".lt_history").html(data)

  }


  //清空历史记录 
  $(".lt_history").on("click", ".icon_empty", function () {
    //点击按钮的时候 弹出模态框 
    mui.confirm("您是否要清空全部的历史记录", "温馨提示", ["取消", "确认"], function (e) {

      // localStorage.removeItem("search_list");
      // //重新渲染 
      // render();
      // console.log(e)
      if (e.index === 1) {
        // 点击确认按钮的时候 进行清空记录  并且重新渲染 
        localStorage.removeItem("search_list");
        //重新渲染 
        render();

      }

    })

  })


  //删除一条记录 
  $(".lt_history").on("click", ".icon_delete", function () {
    var that = this;


    //点击按钮的时候 弹出模态框 
    mui.confirm("您是否要清空当前这一条记录", "温馨提示", ["取消", "确认"], function (e) {

      // localStorage.removeItem("search_list");
      // //重新渲染 
      // render();
      // console.log(e)
      if (e.index === 1) {
        //获取到该条数据的下标 对应数组进行删除 
        var index = $(that).data("index")
        //获取数组
        var arr = getArr();
        arr.splice(index, 1);
        //再将数组存储到本地里面去 
        localStorage.setItem("search_list", JSON.stringify(arr));
        render()

      }

    })




  })

  // 功能4: 添加搜索记录功能
  // (1) 给搜索按钮添加点击事件
  // (2) 获取搜索关键字
  // (3) 获取数组
  // (4) 添加到数组最前面
  // (5) 存储到本地历史记录中
  // (6) 重新渲染

  $(".search_btn").click(function () {
    var key = $(".search_input").val();
    if (key === "") {
      mui.toast("请输入关键字");
      return;
    }

    //获取数组


    var arr = getArr();


    //需要做长度的限制  以及重复的限制
    if (arr.length >= 10) {
      //删除最后哦一项 
      arr.pop();

    }
    var index=arr.indexOf(key);
    if(index>-1){
      //删除旧的  因为 indexOf的返回值 就是被删除的元素的下标 
      arr.splice(index,1)


    }

    //添加到数组的最前面 
    arr.unshift(key);

    //存储到本地 
    localStorage.setItem("search_list", JSON.stringify(arr))
    //渲染
    render()

    //清空搜索框 
    $(".search_input").val("")
    //需要做长度的限制  以及重复的限制 


    //进行页面跳转 
    location.href="searchList.html?key="+key;



  })


})