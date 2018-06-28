$(function () {
  //表单校验
  //使用表单校验插件
  $("#form").bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    // excluded: [':disabled', ':hidden', ':not(:visible)'],

    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    //3. 指定校验字段
    fields: {
      //校验用户名，对应name表单的name属性
      username: {
        validators: {
          //不能为空
          notEmpty: {
            message: '用户名不能为空'
          },
          //长度校验
          stringLength: {
            min: 2,
            max: 6,
            message: '用户名长度必须在2到6位'
          },
          callback: {
            message: "用户名错误"
          }


        }
      },
      password: {
        validators: {
          //不能为空
          notEmpty: {
            message: '密码不能为空'
          },
          //长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: '密码长度必须在6到12位'
          },
          callback: {
            message: "密码错误"
          }

        }
      },
    }

  });
  // 当表单校验成功时，会触发success.form.bv事件，
  // 此时会提交表单，这时候，通常我们需要禁止表单的自动提交，使用ajax进行表单的提交。
  $("#form").on("success.form.bv", function (e) {
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data: $("#form").serialize(),
      dataType: "json",
      success: function (info) {
        console.log(info)
        if (info.success) {
          //成功登录到首页
          location.href = "index.html";

        }
        if (info.error === 1000) {
          // 用户名不存在 跳转到登录页

          $("#form").data('bootstrapValidator').updateStatus("username", "INVALID", "callback")
          // location.href = "login.html";

        }
        if (info.error === 1001) {
          // 密码错误 跳转到登录页
          $("#form").data('bootstrapValidator').updateStatus("password", "INVALID", "callback")
          // location.href = "login.html";

        }


      }
    })

  })
  //重置表单 
  // $("#form").data('bootstrapValidator').resetForm();
  $('[type="reset"]').click(function () {
    $("#form").data('bootstrapValidator').resetForm();
  })
})