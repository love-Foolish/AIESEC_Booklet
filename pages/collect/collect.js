var common = require('../../utils/subjectUtil.js');
Page({
    data: {
        //text:"这是一个页面"、
        Item: [],
        hidden: true,
        hideLoading:true,
        refresh:{},
        isUpper: true,//scroll-view滚动条默认在最上
        isLower: false,
        loading: false,//是否在加载中,
        refreshing_text: '下拉刷新',
        loading_text: '上拉加载更多',
        loadingHeight: 90,//正在加载时高度
        refreshHeight: 0,//刷新布局高度
        loadMoreHeight: 0,//加载更多布局高度
        windowHeight: 0,//获取屏幕高度  
        currentSize: 0,
        words: [],
        pull:true,//下拉刷新状态 false释放刷新状态; 上拉加载更多状态 false释放加载更多状态
        loading:false,//是否在加载中
        downY:0,//触摸时Y轴坐标
    },
    onLoad: function (options) {
        this.loadCollection()
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
    //加载收藏内容
    loadCollection: function () {
        var page = this;
        /*wx.showLoading({
            title: '加载中'
        })*/
        page.setData({hideLoading:false});
        wx.showNavigationBarLoading()
        var openid = wx.getStorageSync('openid');
        //console.log(openid)
        wx.request({
            url: 'https://88994702.aiesecdict.com/ViewFavourite.php',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                OpenID: openid
            },
            success: function (res) {
                var subjects = res.data;
                page.setData({ Item: subjects, hidden: true, hideLoading: true });
                //wx.hideLoading({})
                wx.hideNavigationBarLoading(),
                    page.onRefreshAnimation()
            }
        })
        page.loadFinish();
    },
    //跳转详细内容界面
   toDetail: function(e){
       common.toDetail(e);
   },
    //下拉刷新
    onPullDownRefresh:function(){
        var page = this;
        page.loadCollection();
        wx.stopPullDownRefresh();
    },
    //加载时的动画
    onRefreshAnimation:function(){
        this.setData({
            refresh:common.onRefreshAnimation()
        })
    },
    changeModel:function(){
        var model = this.data.model;
        model = common.changeModel(model);
        console.log("model 是："+model)
        this.setData({
            model:model
        })
    },
    toTop: function () {
        wx.pageScrollTo({
            scrollTop: 0
        })
    },
    scroll: function () {
        console.log("scroll...");
        this.data.scrolling = true;
        this.data.isLower = false;
        this.data.isUpper = false;
    },
    lower: function () {
        console.log("lower...");
        this.data.isLower = true;
        this.data.scrolling = false;
    },
    upper: function () {
        console.log("upper...");
        this.data.isUpper = true;
        this.data.scrolling = false;
    },
    start:function(e){
        console.log("start");
        if(this.data.scrolling||this.data.loading) return;
        var startPoint = e.touches[0];
        var clientY = startPoint.clientY;
        this.setData({
            downY:clientY,
            refreshHeight:0,
            loadMoreHeight:0,
            pull:true,
            refreshing_text:'下拉刷新',
            loading_text:'下拉加载更多'
        })
    },
    end: function (e) {
        this.data.scrolling = false;
        if (this.data.refreshing) {
            return;
        }
        console.log('end');
        var height=this.data.loadingHeight;
        if (this.data.refreshHeight > height) {
            this.setData({
                refreshHeight:height,
                lading:true,
                pull:false,
                refreshing_text:'正在刷新。。。'
            });
            this.loadCollection();
        }
        else if(this.data.loadMoreHeight>height){
            this.setData({
                loadMoreHeight:height,
                loading:true,
                pull:false,
                loading_text:'正在加载更多。。。'
            })
            this.loadCollection();
        }
        else{
            this.setData({
                refreshHeight:0,
                loadMoreHeight:0,
                loading:false,
                pull:true
            })
        }
    },
    loadFinish:function(){
        var page = this;
        setTimeout(function(){
            page.setData({
                refreshHeight:0,
                loadMoreHeight:0,
                loading:false
            })
        },1000);
    },
    move: function (e) {
        if (this.data.scrolling || this.data.loading) return;
        var movePoint = e.changedTouches[0];
        var moveY = (movePoint.clientY - this.data.downY) * 0.5;
        //1.下拉刷新
        if(this.data.isUpper&&moveY>0){
            console.log("下拉...dy:", moveY);
            this.setData({
                refreshHeight:moveY
            })
            if(this.data.refreshHeight>this.data.loadingHeight){
                this.setData({
                    pull:false,
                    refreshing_text:'释放立即刷新'
                })
            }
            else{
                this.setData({
                    pull:true,
                    refreshing_text:'下拉刷新'
                })
            }
        }
        //2.上拉加载更多
        else if(this.data.isLower&&moveY<0){
            console.log("上拉...dy:", moveY);
            this.setData({
                loadMoreHeight:Math.abs(moveY)
            })
            if(this.data.loadMoreHeight>this.data.loadingHeight){
                this.setData({
                    pull:false,
                    loading_text:'释放加载更多'
                })
            }
            else{
                this.setData({
                    pull:true,
                    refreshing_text:'上拉加载更多'
                })
            }
        }
    }
})