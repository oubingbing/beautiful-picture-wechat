
const app = getApp();

let leftList = [
  {id:1,pictureUrl:'https://img0.baidu.com/it/u=2162400555,3574420861&fm=26&fmt=auto&gp=0.jpg',collect:0},
  {id:2,pictureUrl:'https://img0.baidu.com/it/u=3248710949,1894349855&fm=26&fmt=auto&gp=0.jpg',collect:0},
  {id:3,pictureUrl:'https://img2.baidu.com/it/u=593880155,576141078&fm=26&fmt=auto&gp=0.jpg',collect:0},
  {id:3,pictureUrl:'https://img0.baidu.com/it/u=3017245903,2955151614&fm=26&fmt=auto&gp=0.jpg',collect:0},
  {id:3,pictureUrl:'https://img2.baidu.com/it/u=3327430747,1886779265&fm=26&fmt=auto&gp=0.jpg',collect:0},
  {id:3,pictureUrl:'https://img2.baidu.com/it/u=1248945792,3661963056&fm=26&fmt=auto&gp=0.jpg',collect:0},
  {id:3,pictureUrl:'https://sf3-ttcdn-tos.pstatp.com/img/pgc-image/c511854e5864490eb49af5c5a60b387d~tplv-tt-cs0:360:544.jpeg',collect:0}
]

let rightList = [
  {id:1,pictureUrl:'https://sf3-ttcdn-tos.pstatp.com/img/mosaic-legacy/3e500086fe636ab1424~tplv-tt-cs0:360:600.jpeg',collect:0},
  {id:2,pictureUrl:'https://sf3-ttcdn-tos.pstatp.com/img/pgc-image/0c9b9e1c391d4c45b266bf55935fc342~tplv-tt-cs0:360:640.jpeg',collect:0},
  {id:3,pictureUrl:'https://sf3-ttcdn-tos.pstatp.com/img/pgc-image/39a199da093c40aea17d742fbce351b2~tplv-tt-cs0:360:720.jpeg',collect:0},
  {id:3,pictureUrl:'https://sf3-ttcdn-tos.pstatp.com/img/labis/491d5d0429f86526d72bcfd17b85cde7~tplv-tt-cs0:360:520.jpeg',collect:0},
  {id:3,pictureUrl:'https://sf3-ttcdn-tos.pstatp.com/img/pgc-image/d8210339628a451e826e5c01bf1ed3d0~tplv-tt-cs0:360:638.jpeg',collect:0},
  {id:3,pictureUrl:'https://sf3-ttcdn-tos.pstatp.com/img/pgc-image/612353c4b3634b2081ce61cc3c68e2a2~tplv-tt-cs0:360:720.jpeg',collect:0}
]

Page({
  data: {
    imageUrl: app.globalData.imageUrl,
    id:'',
    leftList:leftList,
    rightList:rightList,
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

  /**
   * 下载图片
   */
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

  /**
   * 保存下载图片记录
   */
  saveDownload:function(id,type){
    app.http("POST", `/picture/download_log/${id}`, {type:type}, function (res) {
      let resData = res.data;
      console.log(resData)
    })
  },

  /**
   * 收藏图片
   */
  collectImage:function(e){
    let id = e.currentTarget.dataset.id;
    let _this = this;
    app.http("POST", `/picture/collect/${id}`, {}, function (res) {
      let resData = res.data;
      let leftList = _this.data.leftList;
      let rightList = _this.data.rightList;
      console.log(resData)
      if (resData.code == 0) {
        leftList.map(item => {
          if (item.id == id) {
            item.collect = 1;
          }
          return item;
        })
        rightList.map(item => {
          if (item.id == id) {
            item.collect = 1;
          }
          return item;
        })

        _this.setData({
          leftList: leftList,
          rightList: rightList,
        })
      }
    })
  },

  /**
   * 取消收藏
   */
  cancelCollect:function(e){
    let id = e.currentTarget.dataset.id;
    let _this = this;
    app.http("POST", `/picture/collect/${id}/cancel`, {}, function (res) {
      let resData = res.data;
      let leftList = _this.data.leftList;
      let rightList = _this.data.rightList;
      console.log(resData)
      if(resData.code == 0){
        leftList.map(item=>{
          if(item.id == id){
            item.collect = 0;
          }
          return item;
        })
        rightList.map(item=>{
          if(item.id == id){
            item.collect = 0;
          }
          return item;
        })

        _this.setData({
          leftList: leftList,
          rightList: rightList,
        })
      }
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

  /**
   * 获取图集列表
   */
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

  },
  /**
 * 分享
 */
  onShareAppMessage: function (res) {
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
  },

})