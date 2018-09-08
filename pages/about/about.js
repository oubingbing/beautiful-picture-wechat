const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    about:'',
    imageUrl: app.globalData.imageUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAbout();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
 * 获取用户信息
 */
  getAbout: function () {
    let _this = this;
    app.http("GET", `/user/about`, {}, function (res) {
      let resData = res.data;
      console.log(resData)
      if (resData.code == 0) {
        _this.setData({ about: resData.data });
      }
    })
  },
})