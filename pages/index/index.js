
const util = require("../../utils/util.js");
const qiniuUploader = require("../../utils/qiniuUploader");
const uploader = require("../../utils/uploadImage");

const app = getApp()

wx.onUserCaptureScreen(function (res) {
  console.log("res：" + JSON.stringify(res));
})

Page({
  data: {
    show_auth:app.globalData.show_auth,
    userInfo: {}
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

  },
  
  onShow: function (option) {

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
      _this.getPost(_this);
      _this.topic();
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
  openDetail: function () {
    wx.navigateTo({
      url: '/pages/album_detail/album_detail?type=0&new_message=1'
    })
  },
})