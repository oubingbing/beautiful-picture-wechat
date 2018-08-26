
const app = getApp();

Page({
  data: {
    imageUrl: app.globalData.imageUrl,
    id:'',
    leftList:[],
    rightList:[],
    leftHeight:0,
    rightHeigt:1
  },
  onLoad: function (option) {
    let id = option.id;
    this.setData({id:id})
    
    this.getList();
  },

  onReady:function(){
    this.viewPicture();
  },

  viewPicture:function(){
    let _this = this;
    app.http("PUT", `/picture/view/${_this.data.id}`, {}, function (res) {
      let resData = res.data;
      console.log(resData)

    })
  },

  getList:function(){

    let _this = this;
    app.http("GET", "/picture/detail/"+_this.data.id, {}, function (res) {
      let resData = res.data;
      let leftList = _this.data.leftList;
      let rightList = _this.data.rightList;
      let leftHeight = _this.data.leftHeight;
      let rightHeigt = _this.data.rightHeigt;

      if(resData.code == 0){
        resData.data.pictureItems.map(item=>{
          if(leftHeight <= rightHeigt){
            leftList.push(item);
            leftHeight += item.pictureHeight;
          }else{
            rightList.push(item)
            rightHeigt += item.pictureHeight;
          }
        })
      }

      _this.setData({
        leftList: leftList,
        rightList: rightList,
        leftHeight: leftHeight,
        rightHeigt: rightHeigt
      })

    })

  }

})