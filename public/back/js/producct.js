$(function () {
  //动态渲染数据
  var currentPage = 1;
  var pageSize = 2;
  var picArr = [];
  render();
  function render() {

    $.ajax({
      type: "get",
      dataType: "json",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (info) {
        // console.log(info)
        var data = template("tmp", info);
        $("tbody").html(data);
        // 分页
        $("#pagenator").bootstrapPaginator({
          bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page,//当前页
          totalPages: Math.ceil(info.total / info.size),//总页数
          size: "normal",//设置控件的大小，mini, small, normal,large
          itemTexts: function (type, page, current) {
            // console.log(arguments)
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return page;
            }

          },
          tooltipTitles: function (type, page, current) {
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return "前往" + page + "页";
            }

          },
          useBootstrapTooltip: true,
          onPageClicked: function (event, originalEvent, type, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render();

          }
        });


      }
    })

  }

  // 点击添加商品按钮弹出模态框
  $(".addBtn").click(function () {
    $("#addModal").modal("show");

    //  请求二级分类数据

    $.ajax({
      type: "get",
      dataType: "json",
      data: {
        page: 1,
        pageSize: 100,

      },
      url: "/category/querySecondCategoryPaging",
      success: function (info) {
        // console.log(info)
        var data = template("selectTmp", info)
        $(".dropdown-menu").html(data)


      }

    })
  })

  //点击二级分类下拉菜单对应显示
  //使用事件委托
  $(".dropdown-menu").on("click", "a", function () {
    var txt = $(this).text();
    $("#dropdownTxt").text(txt);
    var id = $(this).data("id");
    $('[name="brandId"]').val(id);

    // 手动重置隐藏域校验状态
    $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");





  })

  //图片上传

  $("#fileUpload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      var picUrl = data.result.picAddr;
      picArr.unshift(data.result);
      $("#imgBox").prepend('<img src="' + picUrl + '" width="100" height="100">');

      //如果长度大于3  就应该删除 
      if (picArr.length > 3) {
        //删除最后一个  也就是最早添加的哪一个
        picArr.pop();
        //图片结构也要对应删除 
        $("#imgBox img:last-of-type").remove()

      }

      if (picArr.length === 3) {
        $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID");

      }




    }
  });


  //表单校验 
  $("#form").bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [],

    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    // 配置校验字段
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      // 要求: 商品库存要求是 必须是非零开头的数字
      // 1 11 121
      /*
      * [1-9]  可以出现 1-9 中的任意一个
      * [^0]   除了0都可以出现, 包括字母
      *
      * \d     数字 [0-9]
      *  + 可以出现 一次 或 多次
      *  * 可以出现 0次 或 的多次
      *  ? 可以出现 0次 或 1次
      *  {n} 可以先 n 次
      * */
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          //正则校验
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存必须是非零开头的数字'
          }
        }
      },
      // 尺码校验需求: 必须是 xx-xx 的格式, xx 表示数字
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺码"
          },
          //正则校验
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '商品尺码必须是 xx-xx 的格式, 例如 32-40'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品现价"
          }
        }
      },
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传 3 张图片"
          }
        }
      }
    }

  })

  //表单校验成功事件  阻止默认的提交

  $("#form").on("success.form.bv", function (e) {
    e.preventDefault();

    // 获取表单中的数据
    var paramsStr = $('#form').serialize();

    //拼接数据
    paramsStr += "&picAddr1=" + picArr[0].picAddr + "&picName1=" + picArr[0].picName;
    paramsStr += "&picAddr2=" + picArr[1].picAddr + "&picName2=" + picArr[1].picName;
    paramsStr += "&picAddr3=" + picArr[2].picAddr + "&picName3=" + picArr[2].picName;
    console.log(paramsStr)


    //发送ajax请求
    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: paramsStr,
      dataType: "json",
      success: function (info) {
        // console.log(info)
        if (info.success) {
          //关闭模态框 
          $("#addModal").modal("hide");

          currentPage=1;
          render();

          // 手动重置文本
          $('#dropdownTxt').text("请选择二级分类");

          // 手动重置图片, 找到所有图片, 让所有图片自杀
          $('#imgBox img').remove();



        }

      }

    })

  })


})