const app = getApp()

wx.onUserCaptureScreen(function (res) {
  console.log("res：" + JSON.stringify(res));
})

Page({
  data: {
    show_auth:app.globalData.show_auth,
    userInfo: {},
    list:[],
    imageUrl: app.globalData.imageUrl,
    pageSize: 10,
    pageNumber: 0,
    initPageNumber: 0,
    showGeMoreLoadin: false,
    notDataTips:false
  },

  onLoad: function (e) {
    let that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            show_auth:true
          });
        }
      }
    })

    this.getList();

  },

  onReady(){
  },
  
  onShow: function (option) {
    
  },

  downloadImage: function (e) {
    let id = e.currentTarget.dataset.id;
    let objId = e.currentTarget.dataset.objid;
    let _this = this;
    wx.showLoading({
      title: '图片保存中...',
    });
    console.log(id)
    wx.downloadFile({
      url: id,
      success: function (res) {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              wx.hideLoading();
              _this.saveDownload(objId,1);
            },
            fail(res) {
              wx.showToast({
                title: '保存图片失败！',
              })
            }
          })
        }
      }
    })

  },

  saveDownload: function (id,type) {
    app.http("POST", `/picture/download_log/${id}`, {type:type}, function (res) {
      let resData = res.data;
      console.log(resData)
    })
  },

  getList(){
    let _this = this;
    app.http("GET", "/picture/list"+`?pageSize=${ this.data.pageSize }&pageNumber=${ this.data.pageNumber }`, {}, function (res) {
      _this.setData({ showGeMoreLoadin: false })
      let resData = res.data;
      let list = _this.data.list;
      if (resData.code == 0) {
        if(resData.data.length > 0){
          resData.data.map(item => {
            list.push(item)
          })
          console.log(list)
          _this.setData({
            list: list,
            pageNumber: _this.data.pageNumber + 1
          })
        }else{
          _this.setData({ notDataTips:true})
        }
      }
    })
  },

  /**
   * 上拉加载更多
   */
  onReachBottom: function () {
    console.log('到底了');
    this.setData({ 
      showGeMoreLoadin: true,
      notDataTips:false
    })
    this.getList();
  },

  /**
   * 监听用户点击授权按钮
   */
  getAuthUserInfo:function(data){
    app.globalData.show_auth = false;
    this.setData({
      show_auth:false
    });

    let _this = this;
    app.login(null, null, null, function(){
      _this.getList();
      console.log('加载信息');
    });
  },


  /**
 * 预览图片
 */
  previewMoreImage: function (event) {

    console.log(event.target.id);
    console.log(event.currentTarget.dataset.obj);

    let _this = this;

    let images = event.currentTarget.dataset.obj.map(item=>{
      return _this.data.baseImageUrl+item;
    });

    console.log(images);

    let url = event.target.id;

    wx.previewImage({
      current: url,
      urls: images
    })
  },
  /**
   * 进入专辑详情页面
   */
  openDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/album_detail/album_detail?id='+id
    })
  },
})