/*
 * 1. 进行表单校验配置
 *    校验要求:
 *        (1) 用户名不能为空, 长度为2-6位
 *        (2) 密码不能为空, 长度为6-12位
 * */
$(function(){
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
            message: '用户名长度必须在2-6位'
          },
          callback:{
            message:'用户名不存在'
          }
          //正则校验
          // regexp: {
          //   regexp: /^[a-zA-Z0-9_\.]+$/,
          //   message: '用户名由数字字母下划线和.组成'
          // }
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
            message: '密码长度必须在6-12位'
          },
          callback:{
            message:'密码错误'
          }
          //正则校验
          // regexp: {
          //   regexp: /^[a-zA-Z0-9_\.]+$/,
          //   message: '用户名由数字字母下划线和.组成'
          // }
        }
      },
    }
  
  });

   /*
  * 2. 使用 submit 按钮, 进行提交, 表单校验插件, 会在提交时, 进行校验,
  *    (1) 如果校验成功, 会默认提交这次请求, 会进行跳转, 我们需要阻止这次提交, 通过 ajax 提交
  *    (2) 如果校验失败, 会提示用户, 输入有误
  *
  *    需要注册表单校验成功事件, 在成功事件内, 阻止默认的表单提交, 通过 ajax 进行提交
  * */
 $("#form").on("success.form.bv",function(e){
   //阻止默认的表单提交
   e.preventDefault();
   $.ajax({
     type:"post",
     url:"/employee/employeeLogin",
     data:$("#form").serialize(),
     dataType:"json",
     success:function(info){
       console.log(info)
       //登录成功
       if(info.success){
         //跳转到首页
         location.href="index.html"
       }

       //不成功
       if(info.error===1000){
        //  alert("同户名不存在")
        $("#form").data("bootstrapValidator").updateStatus("username","INVALID","callback")

       }
       if(info.error===1001){
        // alert("密码错误")
        $("#form").data("bootstrapValidator").updateStatus("password","INVALID","callback")

      }

      //当我们输入错误的时候 需要重置 但是每次重置都只会重置表单  但是后面的对错信息不对被重置 
      $('[type="reset"]').click(function(){
        $('#form').data("bootstrapValidator").resetForm();
      })

     }
   })

 })
})