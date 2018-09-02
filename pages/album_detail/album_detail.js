
const app = getApp();

Page({
  data: {
    imageUrl: app.globalData.imageUrl,
    id:'',
    leftList:[],
    rightList:[],
    leftHeight:0,
    rightHeigt:1,
    pageSize: 20,
    pageNumber: 0,
    initPageNumber: 0,
    showGeMoreLoadin:false,
    notDataTips:false
  },
  onLoad: function (option) {
    let id = option.id;
    this.setData({id:id})
    
    this.getList();
  },

  onReady:function(){
    this.viewPicture(this.data.id,1);
  },

  /**
   * 上拉加载更多
   */
  onReachBottom: function () {
    console.log('到底了');
    this.setData({ showGeMoreLoadin: true, notDataTips:false})
    this.getList();
  },

  downloadImage:function(e){
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
              _this.saveDownload(objId,2);
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

  saveDownload:function(id,type){
    app.http("POST", `/picture/download_log/${id}`, {type:type}, function (res) {
      let resData = res.data;
      console.log(resData)
    })
  },

  collectImage:function(e){
    let id = e.currentTarget.dataset.id;
    wx.saveImageToPhotosAlbum({
      filePath:id,
      success(res) {
        console.log();
      }
    })

    app.http("POST", `/picture/collect/${id}`, {}, function (res) {
      let resData = res.data;
      console.log(resData)
    })
  },

  /**
   * 预览图片
   */
  previewImage: function (event) {
    let url = event.target.id;
    let id = event.currentTarget.dataset.imageid;
    console.log(id);

    wx.previewImage({
      current: '',
      urls: [url]
    })
    this.viewPicture(id, 2);
  },

  /**
   * 记录预览记录
   */
  viewPicture:function(id,viewType){
    let _this = this;
    app.http("POST", `/picture/view/${id}`, { type: viewType}, function (res) {
      let resData = res.data;
      console.log(resData)
    })
  },

  getList:function(){
    let _this = this;
    app.http("GET", "/picture/detail/" + _this.data.id + `?pageSize=${this.data.pageSize}&pageNumber=${this.data.pageNumber}`, {}, function (res) {

      _this.setData({ showGeMoreLoadin: false })

      let resData = res.data;
      let leftList = _this.data.leftList;
      let rightList = _this.data.rightList;
      let leftHeight = _this.data.leftHeight;
      let rightHeigt = _this.data.rightHeigt;

      if(resData.code == 0){
        if(resData.data.length > 0){
          resData.data.map(item => {
            if (leftHeight <= rightHeigt) {
              leftList.push(item);
              leftHeight += item.pictureHeight;
            } else {
              rightList.push(item)
              rightHeigt += item.pictureHeight;
            }
          })
          _this.setData({
            leftList: leftList,
            rightList: rightList,
            leftHeight: leftHeight,
            rightHeigt: rightHeigt,
            pageNumber: _this.data.pageNumber + 1
          })
        }else{
          _this.setData({ notDataTips:true})
        }
      }
    })

  }

})