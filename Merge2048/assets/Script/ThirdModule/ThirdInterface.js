var WXInterface = require('WXInterface');
var util = require('util');
if (typeof wx !== 'undefined') {
    //启动微信初始化
    WXInterface.initOnEnter();
}

let ThirdInterface = {
    "MergeName": 'merge2048-local', //分数和金币相关

	//加载本地分数等数据并填充到全局变量
    loadLocalData: function () {
        //存储在云端的数据结构
        try {
            let storage = cc.sys.localStorage.getItem(ThirdInterface.MergeName);
			if(storage != null && storage != ""){
				let localData = JSON.parse(storage);
                //兼容新添加的数据
				util.clipStc(GData,localData,GData.clipAllStc);
            }
        } catch (error) {
		}
    },
    loadCDNData:function(cbFunc){
		try{
			wx.cloud.init({ env:'merge2048-8c2e5d'});
			const db = wx.cloud.database()
			db.collection('2048').where({
				FileName:GData.alyunCFVersion
			}).get({
				success(res) {
					// res.data 包含该记录的数据
					if(res.data.length > 0){
						var data = res.data[0];
						util.clipStc(GData,data,GData.clipAllStc);
						if(cbFunc){
							cbFunc();
						}
					}
				},
				fail(err){
				}
			});
		}catch(err){
		}
	},
	//更新游戏云端数据
    updataGameInfo: function () {
		if (typeof wx !== 'undefined') {
			WXInterface.pushYunInfo();
		}
        //云端数据再存储一份在本地
        try {
			var dataDic = {
				"curDataInfo":GData.curDataInfo,
				"numMap":GData.numMap,
				"GDJBoxs":GData.GDJBoxs
			};
            let data = JSON.stringify(dataDic);
            cc.sys.localStorage.setItem(ThirdInterface.MergeName, data);	
        } catch (error) {
            console.error(error);
        }
    },
    //分享游戏
    shareGame: function (parmas) {
        if (typeof wx !== 'undefined') {
            WXInterface.shareGame(parmas);
        }
    },

    //根据类型来获取不同排行榜
    getRank: function (parmas) {
        if (typeof wx !== 'undefined') {
            switch (parmas.type) {
                case GData.OpenData.GOR:
                    WXInterface.fetchFinishPaiHang(parmas);
                    break;
                case GData.OpenData.FUR:
                    WXInterface.fetchHaoYouPaiHang(parmas);
                    break;
                case GData.OpenData.GUR:
                    WXInterface.fetchQunPaiHang(parmas);
                    break;
                case GData.OpenData.SPR:
                    WXInterface.fetchXiaHaoYouPaiHang(parmas);
                    break;
                case GData.OpenData.IFR:
                    WXInterface.fetchLoadHaoYouPaiHang(parmas);
                    break;
                default:
                    break;
            }
        }
    }
};
module.exports = ThirdInterface;