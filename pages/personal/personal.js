
const app = getApp();

Page({
  data: {
    user: '',
    newLetterNumber: 0,
    serviceId: '',
    showNormal: false,
    showAudit: false
  },

  onLoad: function () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#f78ca0'
    })
    let userStorage = wx.getStorageSync('user');
    if (userStorage) {
      this.setData({
        user: userStorage
      })
    }
    this.userInfo();
  },

  /**
   * 浏览历史记录
   */
  openLog: function (e) {
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/history/history?type=' + type
    })
  },

  /**
   * 获取用户信息
   */
  userInfo: function () {
    let _this = this;
    app.http("GET", `/user/profile`, {}, function (res) {
      let resData = res.data;
      console.log(resData)
      if(resData.code == 0){
        _this.setData({user:resData.data});
        wx.setStorageSync('user', resData.data);
      }
    })
  },
 
})