var common = require('../../utils/subjectUtil.js');
Page({
    data: {
        //text:"这是一个页面"
        functions: [
            { id: 'Notification', name: '通知公告' },
            { id: 'iGV', name: 'iGV' },
            { id: 'iGT', name: 'iGT' },
            { id: 'oGV', name: 'oGV' },
            { id: 'oGET', name: 'oGET' },
            { id: 'BD', name: 'BD' },
            { id: 'MKT', name: 'MKT' },
            { id: 'MC', name: 'MC' }
        ],
        hidden: false,
        tabTd: false,
        expandTd: true,
        Item: [],
        collectSelected: false,
        selectLabel: '',
        labelSelected: false,
        hideLoading: true,
        refresh: {},
        model: 'model_1',
        //hasMore:true,
        //hasRefesh:false
        count: 0,
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
        //页面初始化，options为页面跳转带来的参数
        this.loadContents();
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
    //图标旋转
    /*tabTd: function () {
        var tabTd = this.data.tabTd;
        if (tabTd == true)
            this.setData({ tabTd: false, expandTd: true });
        else
            this.setData({ tabTd: true, expandTd: false });
    },*/
    //type单选
    labelTd: function (e) {
        var page = this;
        /*wx.showLoading({
            title:'加载中'
        })*/
        page.setData({ hideLoading: false });
        wx.showNavigationBarLoading()
        page.setData({ labelSelected: true })
        var index = e.target.dataset.index;
        console.log("id是:" + index);
        this.setData({
            selectLabel: index,
        });
        var arraySelected = new Array();
        wx.request({
            url: 'https://88994702.aiesecdict.com/getAllNotis.php',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                var subjects = res.data;
                console.log(subjects);
                for(var i = 0; i < subjects.length; i++){
                    if(subjects[i].Type == index){
                        arraySelected.push(subjects[i]);
                    }
                }
                console.log("arraySelected : "+arraySelected);
                page.setData({ Item: arraySelected, hidden: true });
                page.setData({ hideLoading: true });
                //wx.hideLoading({})
                wx.hideNavigationBarLoading()
            }
        })
    },
    //type多选
    /* labelExTd: function (e) {
        var page = this;
        if (page.data.labelSelected == true) {
            page.setData({ selectLabel: '', Item: [] })
        }
        page.setData({ labelSelected: false })
        var checked = e.detail.value;
        console.log(checked);
        var changed = {};
        for (var i = 0; i < page.data.functions.length; i++) {
            if (checked.indexOf(page.data.functions[i].name) !== -1) {
               changed['functions[' + i + '].checked'] = true;
            }
            else {
              changed['functions[' + i + '].checked'] = false;
            }
        }
        var array = [];
        page.setData(changed);
        var Param = [];
        for(var i = 0;i<checked.length;i++){
            wx.request({
                url: 'https://88994702.aiesecdict.com/Search.php',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                Title: checked[i]
            },
            success: function (res) {
                console.log("checked[i]是："+checked[i])
                var string = "labelExTdResult["+i+"]";
                Param[i]=res.data;
                console.log("Param[i]是："+Param[i]);
            }
            })
        }
        page.setData({Param:Param});
        for (var i = 0; i < array.length; i++)
            console.log("array是：" + array[i]);
    },*/
    //跳转详细内容界面
    toDetail: function (e) {
        common.toDetail(e);
    },
    //内容加载
    loadContents: function () {
        var page = this;
        var count = page.data.count;
        /*wx.showLoading({
            title:'加载中'
        })*/
        wx.getSystemInfo({
            success:function(res){
                page.setData({windowHeight:res.windowHeight})
                console.log("屏幕高度: " + res.windowHeight)
            }
        })
        page.setData({ hideLoading: false });
        wx.showNavigationBarLoading()
        var arraySelected = new Array();
        wx.request({
            url: 'https://88994702.aiesecdict.com/getAllNotis.php',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data:{
                count:count
            },
            success: function (res) {
                var subjects = res.data;
                if(page.data.selectLabel!==null){
                    for(var i = 0; i < subjects.length; i++){
                        if(subjects[i].Type == page.data.selectLabel){
                            arraySelected.push(subjects[i]);
                        }
                    }
                    page.setData({ Item: arraySelected, hideLoading: true });
                }else{
                    page.setData({ Item: subjects, hideLoading: true });
                }
                //wx.hideLoading({})
                wx.hideNavigationBarLoading()
                page.onRefreshAnimation();
                page.loadFinish();
            }
        })
    },
    //下拉刷新
    onPullDownRefresh: function () {
        var page = this;
        page.loadContents();
        wx.stopPullDownRefresh();
    },
    //加载时的动画
    onRefreshAnimation: function () {
        this.setData({
            refresh: common.onRefreshAnimation()
        })
    },
    changeModel: function () {
        var model = this.data.model;
        model = common.changeModel(model);
        console.log("model 是：" + model)
        this.setData({
            model: model
        })
    },
    toTop: function () {
        wx.pageScrollTo({
            scrollTop: 0
        })
    },
    /*loadMore:function(e){
        var page = this;
        page.setData({
            hasRefesh:true,
        })
        if(!this.data.hasMore) return;

    }*/
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
            this.setData({count:0})
            this.loadContents();
        }
        else if(this.data.loadMoreHeight>height){
            this.setData({
                loadMoreHeight:height,
                loading:true,
                pull:false,
                loading_text:'正在加载更多。。。'
            })
            var count = this.data.count;
            count += 10;
            this.setData({count:count});
            this.loadContents();
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
        var moveY = (movePoint.clientY - this.data.downY) * 0.6;
        //1.下拉刷新
        if (this.data.isUpper && moveY > 0) {
            console.log("下拉...dy:", moveY);
            this.setData({
                refreshHeight: moveY
            })
            if (this.data.refreshHeight > this.data.loadingHeight) {
                this.setData({
                    pull: false,
                    refreshing_text: '释放立即刷新'
                })
            }
            else {
                this.setData({
                    pull: true,
                    refreshing_text: '下拉刷新'
                })
            }
        }
        //2.上拉加载更多
        else if (this.data.isLower && moveY < 0) {
            console.log("上拉...dy:", moveY);
            this.setData({
                loadMoreHeight: Math.abs(moveY)
            })
            if (this.data.loadMoreHeight > this.data.loadingHeight) {
                this.setData({
                    pull: false,
                    loading_text: '释放加载更多'
                })
            }
            else {
                this.setData({
                    pull: true,
                    refreshing_text: '上拉加载更多'
                })
            }
        }
    }
})