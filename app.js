App({
  onLaunch: function (options) {
    var page = this;
    wx.login({
      success: function (res) {
        var appId = 'wx67cd884275a6b9f6';
        var appSecret = 'c79240065f1c8a422295a90350aaa3cd';
        var js_code = res.code;
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + appSecret + '&js_code=' + js_code + '&grant_type=authorization_code',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            var openid = res.data.openid
            //console.log(openid);
            //console.log("试试吧上面就是获得的openid");
             wx.setStorageSync('openid',openid);
             wx.getUserInfo({
               success:function(res){
                 var userInfo = res.userInfo;
                 var nickName = userInfo.nickName;
                 wx.setStorageSync('nickName',nickName);
                 //console.log(nickName);
               }
             })
          }
        })
      }
    })
  },
  onShow: function (options) {

  },
  onHide: function () {

  },
  onError: function (msg) {
    //console.log(msg)
  }
})