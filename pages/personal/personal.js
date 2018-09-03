
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
  },
  openLog: function (e) {
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/history/history?type=' + type
    })
  },
 
})