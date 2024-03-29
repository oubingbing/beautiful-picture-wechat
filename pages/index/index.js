const app = getApp()

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
    notDataTips:false,
    sharecomeIn:false,
    detailId:''
  },

  onLoad: function (e) {
    this.getList();
  },

  onReady(){

  },
  
  onShow: function (option) {
    
  },

  getList: function (id, type) {
    let _this = this;
    app.http("GET", `/api/wechat/picture1`,{}, function (res) {
      console.log(res)
      let resData = res.data;
      if(resData.code ==0){
          let data = resData.data
          _this.setData({list:data})
      }
    })
  },

  downloadImage: function (e) {
    let id = e.currentTarget.dataset.id;
    let objId = e.currentTarget.dataset.objid;
    let _this = this;
    wx.showLoading({
      title: '图片保存中...',
    });
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

  shareInfo: function (id, type) {
    app.http("GET", `/app/share`,{}, function (res) {
      console.log(res)
      let resData = res.data;
      if(resData.code ==0){
        console.log(resData.data.shareImage)
        app.globalData.shareImage = resData.data.shareImage;
        app.globalData.shareWord = resData.data.shareWord;
      }
    })
  },

  saveDownload: function (id,type) {
    app.http("POST", `/picture/download_log/${id}`, {type:type}, function (res) {
      let resData = res.data;
    })
  },

  /**
   * 上拉加载更多
   */
  onReachBottom: function () {
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
      let sharecomeIn = _this.data.sharecomeIn;
      let detailId = _this.data.detailId;
      if(sharecomeIn == true){
        _this.setData({ sharecomeIn: false })
        wx.navigateTo({
          url: '/pages/album_detail/album_detail?id='+detailId
        })
      }
      _this.getList();
    });
  },


  /**
 * 预览图片
 */
  previewMoreImage: function (event) {
    let _this = this;

    let images = event.currentTarget.dataset.obj.map(item=>{
      return _this.data.baseImageUrl+item;
    });

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
    return;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/album_detail/album_detail?id='+id
    })
  },

  /**
   * 分享
   */
  onShareAppMessage: function (res) {
    let id = '';
    let url  = res;
    if (res.target != undefined){
      id = res.target.id;
      url = res.target.dataset.image;
    }

    console.log("url:"+url)
    if(id != ''){
      return {
        title: '小姐姐，你真美',
        path: '/pages/index/index?id=' + id,
        imageUrl: url,
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }else{
      if (app.globalData.shareImage == ''){
        return {
          title: '小姐姐，你真美',
          path: '/pages/index/index?id=' + id,
          success: function (res) {
            // 转发成功
          },
          fail: function (res) {
            // 转发失败
          }
        }
      }else{
        return {
          title: app.globalData.shareWord,
          path: '/pages/index/index',
          imageUrl: app.globalData.imageUrl + app.globalData.shareImage,
          success: function (res) {
            // 转发成功
          },
          fail: function (res) {
            // 转发失败
          }
        }
      }
    }
  },
})