Page({
    data: {
        //text:"这是一个页面"
    },
    onLoad: function (options) {
        //页面初始化，options为页面跳转带来的参数
    },
    onShow: function () {
        //页面显示
    },
    onReady: function () {
        //页面渲染完成
    },
    onHide: function () {
        //页面隐藏
    },
    onUnload: function () {
        //页面卸载
    },
    searchTd:function(){
        wx.navigateTo({
            url:'../searchTd/searchTd'
        })
    }
})