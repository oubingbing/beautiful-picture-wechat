const app = getApp()

let listData = [
  {id:"1",color:"#FF4040",date:"2021/8/18",logo:'https://img0.baidu.com/it/u=1551835336,1449608414&fm=26&fmt=auto&gp=0.jpg',title:"帅战",content:"你的笑容总是那么的治愈","cover":"https://img0.baidu.com/it/u=507055205,3835000679&fm=26&fmt=auto&gp=0.jpg"},
  {id:"2",color:"#6495ED",date:"2021/8/18",logo:'https://img0.baidu.com/it/u=1551835336,1449608414&fm=26&fmt=auto&gp=0.jpg',title:"帅战",content:"夏天遇见你真好","cover":"https://img1.baidu.com/it/u=2043353927,1585764782&fm=26&fmt=auto&gp=0.jpg"},
  {id:"3",color:"#FFD700",date:"2021/8/18",logo:'https://img1.baidu.com/it/u=255551193,4134474626&fm=26&fmt=auto&gp=0.jpg',title:"兴兴",content:"遇到夏天的风，此生无悔","cover":"https://img2.baidu.com/it/u=2537775608,542697426&fm=26&fmt=auto&gp=0.jpg"}
]

Page({
  data: {
    show_auth:app.globalData.show_auth,
    userInfo: {},
    list:listData,
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



  },

  onReady(){
    this.shareInfo()
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
        title: '男神帅哥图集，神仙颜值',
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
          title: '男神帅哥图集，神仙颜值',
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