Page({
    data: {
        //text:"这是一个页面"
        detail: {},
        inputVal: "",
        Article: [],
        Comments: [],
        Heated: false,
        Tagged: [],
        //CommentsHeated:[],
        focus:false,
    },
    onLoad: function (options) {
        //页面初始化，options为页面跳转带来的参数
        var postId = options.id;
        //console.log("目前页面的id为：" + postId);
        this.setData({ id: postId })
        this.loadDetail();
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
    bindKeyInput: function (e) {
        this.setData({ inputVal: e.detail.value })
    },
    //点击转发
    onShareAppMessage: function (res) {
        var Title = wx.getStorageSync('title');
        if (res.from == 'button') {
            //console.log(res.target)
        }
        return {
            title: Title,
            path: '/page/detail',
            success: function (res) {
                wx.showToast({
                    title: '分享成功！',
                    icon: 'success',
                    duration: 1500
                })
            },
        }
    },
    //点击收藏
    onCollectionTap: function () {
        var page = this;
        //console.log("page.data.id:" + page.data.id)
        var detailId = page.data.id;
        //console.log("detailId为：" + detailId)
        var detailIdString = detailId + "";
        //console.log("detailIdString是：" + detailIdString);
        var openid = wx.getStorageSync('openid');
        wx.request({
            url: 'https://88994702.aiesecdict.com/ChangeFavourite.php',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                OpenID: openid,
                ID: detailId
            },
            success: function (res) {
                var collected = res.data;
                //console.log("collected是：" + collected)
                page.setData({ Collected: collected })
                
            }
        })
    },
    //点击发表留言
    addComment: function () {
        var page = this;
        if (this.data.inputVal == "") {
            wx.showModal({
                title:'请输入内容',
                //content:'',
                showCancel:false,
                confirmText:'知道了',
                confirmColor:'#0f88eb',
                success:function(res){
                    if(res.confirm)
                    return;
                }
            })
        }
        var detailId = page.data.id;
        var userName = wx.getStorageSync('nickName');
        //console.log("nickName是：" + userName)
        if (page.data.inputVal != "") {
            wx.request({
                url: 'https://88994702.aiesecdict.com/addComment.php',
                method: 'POST',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    id: detailId,
                    author: userName,
                    article: page.data.inputVal
                },
                success: function (res) {
                    var data = res.data;
                    //console.log(data);
                    page.setData({inputVal:""});
                    wx.showToast({
                        title: '评论成功！',
                        icon: 'success',
                        duration: 1500
                    })
                    page.loadDetail();
                }

            })
        }
    },
    //页面初始化
    loadDetail: function () {
        var page = this;
        var detailId = page.data.id;
        //console.log("detailId是："+detailId)
        var detailIdString = detailId + "";
        //console.log("detailIdString是：" + detailIdString);
        var openid = wx.getStorageSync('openid');
        //console.log("loadDetail的detailId是" + detailId)
        wx.request({
            url: 'https://88994702.aiesecdict.com/getThisNoti.php',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            }, data: {
                openid: openid,
                id: detailId
            },
            success: function (res) {
                var subject = res.data;
                var collected = subject[0][0];
                var article = subject[1];
                var content = article.article.split("\r");
                var textArray = new Array;
                var Param = {};
                var images = new Array;
                var k = 0;
                var imagesParam = {};
                for (var i = 0; i < content.length; i++) {
                    if (content[i].search(/\[img=/) != -1) {
                        if (content[i].indexOf("img=") == 1)
                            content[i] = content[i].slice(6, -8);
                        else
                            content[i] = content[i].slice(7, -8);
                        var String = "images["+k+"]";
                        imagesParam[String] = content[i];
                        page.setData(imagesParam);
                        k+=1;
                        var string = "textArray[" + i + "]";
                        Param[string] = true;
                        page.setData(Param);
                    }
                    else{
                        var string = "textArray["+i+"]";
                        Param[string] = false;
                        page.setData(Param);
                    }
                }
                //wx.setStorageSync("title",title);
                var comments = subject.slice(2);
                page.setData({Collected:collected, Article: article, Comments: comments, Content: content})
            }
        })
    },
    //加热这篇文章
    heatThisNotic: function () {
        var page = this;
        var detailId = page.data.id;
        //console.log("loadDetail的detailId是" + detailId)
        wx.request({
            url: 'https://88994702.aiesecdict.com/heatThisNoti.php',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                id: detailId
            },
            success: function () {
                //console.log("加热成功"),
                    wx.setStorageSync("heated", true),
                    page.setData({ Heated: wx.getStorageSync("heated") })
                wx.showToast({
                    title: '加热成功！',
                    icon: 'success',
                    duration: 1500
                })
            }
        })
    },
    //点赞这个评论
    heatThisComment: function (e) {
        var page = this;
        //console.log("page.data.length 是：" + page.data.Comments.length);
        var detailId = page.data.id;
        //console.log("loadDetail的detailId是" + detailId)
        var id = e.target.dataset.id;
        console.log("本条评论的id是：" + id);
        var indexId = e.target.dataset.index;
        console.log("本条评论的indexId是：" + indexId);
        wx.request({
            url: 'https://88994702.aiesecdict.com/heatThisComment.php',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                id: id
            },
            success: function () {
                var Param = {};
                var string = "CommentsHeated[" + id + "]";
                Param[string] = true;
                page.setData(Param);
                console.log(Param);
                console.log("点赞成功")
                wx.showToast({
                    title: '点赞成功！',
                    icon: 'success',
                    duration: 1500
                })
            }
        })
    },
    Focus:function(){
        this.setData({focus:true})
    },
    previewImage:function(e){
        wx.previewImage({
            urls:this.data.images
        })
    }
})