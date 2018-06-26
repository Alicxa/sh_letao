$(function () {

  var currentPage = 1;
  var pageSize = 5;
  render();
  // 渲染数据以及分页
  function render() {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      dataType: "json",
      data: {
        page: currentPage,
        pageSize: pageSize,
      },
      success: function (info) {
        console.log(info)
        var data = template("tmp", info)
        $("tbody").html(data)
        $("#pagenator").bootstrapPaginator({
          bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page,//当前页
          totalPages: Math.ceil(info.total / info.size),//总页数
          size: "small",//设置控件的大小，mini, small, normal,large
          onPageClicked: function (event, originalEvent, type, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render()
          }
        });


      }
    })
  }
  //点击添加按钮 模态框显示
  $(".addBtn").click(function () {
    $("#addModal").modal("show")

  })
  //获取一级扥类名称
  $.ajax({
    type: "get",
    url: "/category/queryTopCategoryPaging",
    dataType: "json",
    data: {
      page: 1,
      pageSize: 100,
    },
    success: function (info) {
      console.log(info)
      var data = template("selectTmp", info);
      $(".dropdown-menu").html(data)

    }
  })
  // 事件委托 当我们点击dropdown-menu地下的ul li并不能直接选中 需要赋值进去
  $(".dropdown-menu").on("click", "a", function () {
    var txt=$(this).text();
    $("#dropdownTxt").text(txt);
    var id=$(this).data("id");
    $('[name="categoryId"]').val(id);
    $("#form").data('bootstrapValidator').updateStatus("categoryId", "VALID")


  })


  // 图片上传
  $("#fileUpload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      // console.log(data.result.picAddr);
      $("#imgBox img").attr("src", data.result.picAddr)
       // 将图片地址存在 name="brandLogo" 的 input 框中
      $('[name="brandLogo"]').val(data.result.picAddr)
      $("#form").data('bootstrapValidator').updateStatus("brandLogo", "VALID")
    }
  });

  // 5. 通过表单校验插件实现表单校验功能
  $("#form").bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [],
  
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
  
    //3. 指定校验字段
    fields: {
      //校验用户名，对应name表单的name属性
      categoryId: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请选择一级分类'
          },
          
         
        }
      },
      brandName: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入二级分类'
          },
          
         
        }
      },
      brandLogo: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请上传图片'
          },
          
         
        }
      },
    }
  


})

  $("#form").on("success.form.bv",function(e){
    e.preventDefault();
    $.ajax({
      type:"post",
      url:"/category/addSecondCategory",
      dataType:"json",
      data:$("#form").serialize(),
      success:function(info){
        // console.log(info)
        if(info.success){
          //关闭模态框
          $("#addModal").modal("hide")
          //渲染第一页
          currentPage=1;
          render()

          //重置
          $("#form").data('bootstrapValidator').resetForm(true);

          $("#dropdownTxt").text("请输入一级分类");
          $("#imgBox img").attr("src", "images/none.png")


        }

      }
    })

  })
  
})