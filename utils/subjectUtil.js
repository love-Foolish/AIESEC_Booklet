//跳转详细内容界面
function toDetail(e) {
    wx.setStorageSync('contentId', e.currentTarget.id);
    wx.navigateTo({
        url: '../detail/detail?id=' + e.currentTarget.id
    })
}

//加载时的动画
function onRefreshAnimation() {
    var animation = wx.createAnimation({
        duration: 430,
        delay: 200,
        timingFunction: 'ease-out',
        transformOrigin: 'center center 0',
    })
    this.animation = animation;
    animation.translate(0, -60).step()
    /*this.setData({
        refresh: animation.export()
    })*/
    return animation.export();
}

function changeModel(e) {
    if (e == 'model_1') return 'model_2';
    else return 'model_1';
}
/*
function scroll() {
    console.log("scroll...");
    this.data.scrolling = true;
    this.data.isLower = false;
    this.data.isUpper = false;
}
function lower() {
    console.log("lower...");
    this.data.isLower = true;
    this.data.scrolling = false;
}
function upper() {
    console.log("upper...");
    this.data.isUpper = true;
    this.data.scrolling = false;
}
function start(e) {
    console.log("start");
    if (this.data.scrolling || this.data.loading) return;
    var startPoint = e.touches[0];
    var clientY = startPoint.clientY;
    this.setData({
        downY: clientY,
        refreshHeight: 0,
        loadMoreHeight: 0,
        pull: true,
        refreshing_text: '下拉刷新',
        loading_text: '下拉加载更多'
    })
}
function end(e) {
    this.data.scrolling = false;
    if (this.data.refreshing) {
        return;
    }
    console.log('end');
    var height = this.data.loadingHeight;
    if (this.data.refreshHeight > height) {
        this.setData({
            refreshHeight: height,
            lading: true,
            pull: false,
            refreshing_text: '正在刷新。。。'
        });
        this.loadContents();
    }
    else if (this.data.loadMoreHeight > height) {
        this.setData({
            loadMoreHeight: height,
            loading: true,
            pull: false,
            loading_text: '正在加载更多。。。'
        })
        this.loadContents();
    }
    else {
        this.setData({
            refreshHeight: 0,
            loadMoreHeight: 0,
            loading: false,
            pull: true
        })
    }
}
function loadFinish() {
    var page = this;
    setTimeout(function () {
        page.setData({
            refreshHeight: 0,
            loadMoreHeight: 0,
            loading: false
        })
    }, 1000);
}
function move(e) {
    if (this.data.scrolling || this.data.loading) return;
    var movePoint = e.changedTouches[0];
    var moveY = (movePoint.clientY - this.data.downY) * 0.5;
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
}*/


module.exports = {
    toDetail: toDetail,
    onRefreshAnimation: onRefreshAnimation,
    changeModel: changeModel
}