$(function () {
  //发送ajax请求 获取一级分类数据
  var currentPage = 1;
  var pageSize = 2;
  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize,
      },
      dataType: "json",
      success: function (info) {
        var data = template("tmp", info);
        $("tbody").html(data)

        // 分页 
        $("#pagenator").bootstrapPaginator({
          bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page,//当前页
          totalPages: Math.ceil(info.total / info.size),//总页数

          onPageClicked: function (event, originalEvent, type, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render()
          }
        });

      }
    })
  }

  //点击添加分类按钮 显示模态框
  $(".addBtn").click(function () {
    $("#addModal").modal("show")
  })

  // 3. 通过表单校验插件, 实现表单校验
  $('#form').bootstrapValidator({
    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',   // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

    // 配置字段
    fields: {
      categoryName: {
        // 配置校验规则
        validators: {
          // 非空校验
          notEmpty: {
            message: "一级分类名称不能为空"
          }
        }
      }
    }
  });
  //submit 按鈕默認提交
  // 4. 注册表单校验成功事件, 阻止默认成功的提交, 通过 ajax 进行提交
  $("#form").on("success.form.bv",function(e){
     e.preventDefault();
     $.ajax({
       type:"post",
       url:"/category/addTopCategory",
       dataType:"json",
       data:$("#form").serialize(),
       success:function(info){
        //  console.log(info)
         if(info.success){
          $("#addModal").modal("hide")
          currentPage=1;
          render();
           // 3. 重置模态框的表单, 传 true 不仅重置校验状态, 还重置表单内容
           $("#form").data('bootstrapValidator').resetForm(true)

         }

       }
     })


  })




})