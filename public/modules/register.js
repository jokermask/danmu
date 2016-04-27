define('modules/register', function(require, exports, module) {

  $(function () {
    init() ;
  });
  
  function init(){
    initClick() ;
  }
  
  function initClick(){
    $("#register-btn").on('click',function(){
      if(checkReg()){
        var data = {
          username:$("#username").val(),
          nickname:$("#nickname").val(),
          password:$("#password").val(),
          email:$("#email").val()
        }
        $.post('/user/register',data,function(res){
          console.log(res) ;
          if(res.code===0) {
            window.location.href = "/";
          }
          else{
            $('.inputWarn').show().text(res.err) ;
          }
        }) ;
      }
    });
  
    $("#return-home").click(function(){
      window.location.href = "/" ;
    });
  }
  //check register formt
  function checkReg(){
    var inputWarn = $('.inputWarn') ;
    var username = $("#username").val() ;
    var password = $("#password").val() ;
    var passconfirm = $("#passwordConfirm").val();
    var nickname = $("#nickname").val();
    var email = $("#email").val() ;
    var nameReg = /^[A-Za-z0-9|_]{6,16}$/;//6~16位字母数字下划线
    var passwordReg = /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,16}$/ ;//6~16位可包含特殊字符
    var emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/ ;
    if(!username||!nameReg.test(username)){
      inputWarn.show() ;
      inputWarn.text('用户名为空或者格式不正确');
      return false ;
    }
    if(!password||!passwordReg.test(password)){
      inputWarn.show() ;
      inputWarn.text('密码为空或格式不正确');
      return false ;
    }
    if(password!=passconfirm){
      inputWarn.show() ;
      inputWarn.text('两次密码不一致');
      return false ;
    }
    if(!nickname){
      inputWarn.show() ;
      inputWarn.text('昵称不能为空哦');
      return false ;
    }
    if(!email||!emailReg.test(email)){
      inputWarn.show() ;
      inputWarn.text('邮箱为空或格式不正确');
      return false ;
    }
    inputWarn.hide() ;
    return true ;
  }

});
