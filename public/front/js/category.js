

$(function () {
  // 渲染左边的内容
  
  $.ajax({
    type: "get",
    url: "/category/queryTopCategory",
    dataType: "json",
    success: function (info) {
      //  console.log(info);
      var data = template("first_tmp", info)
      $(".lt_category_left ul").html(data)
      renderSecond(info.rows[0].id)

    }
  })

  // 添加点击事件 
  $(".lt_category_left").on("click", "a", function () {
    $(this).addClass("current").parent().siblings().find("a").removeClass("current");
    var id = $(this).data("id");
    // console.log(1)
    // console.log(id)
    renderSecond(id)


  })


  function renderSecond(id) {

    $.ajax({
      type: "get",
      url: "/category/querySecondCategory",
      dataType: "json",
      data: {
        id:id,
      },
      success: function (info) {
        // console.log(info)
        var tmpstr = template("second_tmp", info);
        $(".lt_category_right ul").html(tmpstr)

      }
    })

  }



})