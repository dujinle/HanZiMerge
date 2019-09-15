var util = require("util");
let WXInterface = {
	
    initOnEnter: function () {
        let options = this.fetchParamSync();
        if (options) {
            this.fenXiangZhen = options.shareTicket;
            this.changJing = options.scene;
            this.chaXunStr = options.query;
            this.buZhiDao = options.referrerInfo;
        }
        this.query = '';

        this.setFenXiangZhen(true);
        this.showFenXiangOrder();
        this.zhuCeFenXiang();
        this.zhuCeXianShi();
        this.zhuCeFail();
        this.sheZhiYHXinXi();
        this.chongZhiFenXiangCf();
    },

    // 返回小程序启动参数
    fetchParamSync: function () {
        return wx.getLaunchOptionsSync();
    },
	//设置分享开启
    setFenXiangZhen: function (isEnabled) {
        wx.updateShareMenu({
            withShareTicket: isEnabled,
            success: () => {
                WXInterface.fenXiangZhenAbled = isEnabled;
            }
        })
    },
	
	//注册右上角的微信分享
    zhuCeFenXiang: function () {
        this.onShareAppMessage(() => {
            var shareInfo = this.fetchFenXiangData();
            return {
                title: shareInfo.text,
                imageUrl: shareInfo.imageUrl,
                chaXunStr: WXInterface.query
            };
        })
    },
    //设置默认的微信用户数据
    sheZhiYHXinXi: function () {
        WXInterface.userInfo = {
            nick_name: 'wxname_001',
            maxscore: 0,
            gold: 0,
            iv: '',
            signature: '',
            xingbie: 1,
            touxiang_url: null
        };
    },

    zhuCeXianShi: function () {
        wx.onShow((res) => {
            if (res.fenXiangZhen) {
                WXInterface.fenXiangZhen = res.fenXiangZhen;
            }

            // 判断是否在等待分享返回
            if (this.fenXiangZhenCf.wait) {
                // 判断是否大于最小分享时间
                let d = new Date();
                if (Date.parse(d) - Date.parse(this.fenXiangZhenCf.fenXiangPoint) > GData.alyunGameCF.minShareTime * 1000) {
                    // 大于最小分享时间

                    let successWeightIndex = GData.curDataInfo.fenXiangCiShu % GData.alyunGameCF.shareSuccessWeight.length;
                    let successWeight = GData.alyunGameCF.shareSuccessWeight[successWeightIndex];
                    let isSuccess = Math.random() < successWeight;
              
                    // 判断是否随机到成功
                    if (isSuccess) {
                        if (this.fenXiangZhenCf.trueCBFunc) {
                            this.fenXiangZhenCf.trueCBFunc(null, WXInterface.fenXiangZhen, this.fenXiangZhenCf.arg);
                        }
                    } else {
                        // 不在最小分享时间内，直接失败
                        if (this.fenXiangZhenCf.falseCBFunc) {
                            this.fenXiangZhenCf.falseCBFunc("cancel", this.fenXiangZhenCf.arg);
                        }
                    }
                    GData.curDataInfo.fenXiangCiShu++;
                } else {
                    // 小于最小分享时间
                    if (this.fenXiangZhenCf.falseCBFunc) {
                        this.fenXiangZhenCf.falseCBFunc("cancel", this.fenXiangZhenCf.arg);
                    }
                }
                // 重置分享配置
                this.chongZhiFenXiangCf();
            }
        });
    },
    //重置分享配置
    chongZhiFenXiangCf: function () {
        this.fenXiangZhenCf = {
            name: "",
			arg:null,
            wait: false,
            trueCBFunc: null,
            falseCBFunc: null,
            fenXiangPoint: (new Date())
        };
    },
    zhuCeFail: function () {
        wx.onError((res) => {
        })
    },
    //显示右上菜单的转发按钮
    showFenXiangOrder: function () {
        wx.showShareMenu();
    },

    onShareAppMessage: function (cbFunc) {
        wx.onShareAppMessage(cbFunc);
    },
	shareAppMessage: function (params) {
        wx.shareAppMessage(params);
    },
    //获取微信分享数据（分享图和分享文案）
    fetchFenXiangData: function () {
        var imageUrl;
        var text;
        var shareIndex = util.getRandomIndexForArray(GData.alyunFenXiangImgs);
        if (shareIndex > -1) {
            imageUrl = GData.alyunFenXiangImgs[shareIndex];
            text = GData.alyunFenXiangMsg[shareIndex];
        }
        return {
            imageUrl: imageUrl,
            text: text
        };
    },

    //保存云端数据
    pushYunInfo: function () {
        if (typeof wx === 'undefined') return;
        var sysInfo = wx.getSystemInfoSync();
        if (sysInfo && sysInfo.SDKVersion < "1.9.92") {
            return;
        }
        if (!GData) return;
        //存储key-value格式数据到微信云端
        var maxscore = parseInt(GData.curDataInfo.maxScore);
        var gold = parseInt(GData.curDataInfo.gold);

        let obj = {
            KVDataList: [{
                key: 'maxScore',
                value: maxscore + ''
            }, {
                key: 'gold',
                value: gold + ''
            }]
        }
        this.setUserCloudStorage(obj);
        this.setMaxScore(maxscore, gold);
    },

    //保存数据到云端
    setUserCloudStorage: function (params) {
        try {
            wx.setUserCloudStorage(params);
        } catch (error) {
        }
    },

    //设置查询字符串
    setMaxScore: function (maxscore, gold) {
        WXInterface.query =
            'myName=' + WXInterface.userInfo.nick_name + '&' +
            'bestScore=' + maxscore + '&' +
            'xingbie=' + WXInterface.userInfo.xingbie + '&' +
            'touxiang_url=' + WXInterface.userInfo.touxiang_url;
    },
	
    //拉起微信分享(参数：successCallback,failCallback)
    shareGame: function (params) {
        var shareInfo = this.fetchFenXiangData();
        var successCallback = params.successCallback;
        var failCallback = params.failCallback;

        // 分享点和回调配置
        this.fenXiangZhenCf = {
            name: params.shareName,
			arg:params.arg,
            wait: params.isOpenCustomShare,
            trueCBFunc: successCallback,
            falseCBFunc: failCallback,
            fenXiangPoint: (new Date())
        };
		//判断是否打开自定义分享
		if(params.isOpenCustomShare == true){
			successCallback = null;
			failCallback = null;
		}
        WXInterface.shareAppMessage({
			title: shareInfo.text,
			imageUrl: shareInfo.imageUrl,
            query: WXInterface.query,
            success: (res) => {
				if (res.shareTickets) {
					WXInterface.fenXiangZhenAbled = true;
					WXInterface.fenXiangZhen = res.shareTickets[0];

					wx.getShareInfo({
						shareTicket: res.shareTickets[0],
						success: function (result) {
							if (result) {
								if(successCallback != null){
									successCallback(null, WXInterface.fenXiangZhen, params.arg);
								}
                            }
                        },
                        fail: () => {
                            if (failCallback) {
                                failCallback("", params.arg);
                            }
                        },
                        complete: () => {},
                    });
                }
				else {
                    if (failCallback) {
						failCallback("fail", params.arg);
					}
				}
			},
            fail: () => {
				if (failCallback) {
					failCallback("cancel", params.arg);
				}
			},
			complete: () => {
			},
        });
    },


    //获取好友排行
    fetchHaoYouPaiHang: function (params) {
        try {
            let openDataContext = wx.getOpenDataContext()
            let msg = {
                type: params.type
            }
            if (WXInterface.fenXiangZhenAbled) {
                msg.fenXiangZhen = WXInterface.fenXiangZhen;
            }
            openDataContext.postMessage(msg);
            if (params.cbFunc) {
                params.cbFunc('wx');
            }
        } catch (error) {}
    },

    //获取群排行
    fetchQunPaiHang: function (params) {
        var cbFunc = {
            type: params.type,
            arg: params,
            successCallback: this.onShareGroupSuccess.bind(this),
            failCallback: this.onShareGroupFail.bind(this)
        };
        this.shareGame(cbFunc);
    },

    //群排行分享成功
    onShareGroupSuccess: function (openGId, fenXiangZhen, arg) {
        //分享给群
        try {
            let openDataContext = wx.getOpenDataContext()
            let msg = {
                type: arg.type,
                fenXiangZhen: fenXiangZhen
            }
            openDataContext.postMessage(msg);
        } catch (error) {}

        if (arg.cbFunc) {
            arg.cbFunc(fenXiangZhen);
            this.fenXiangZhen = undefined;
        }
    },

    //群分享到群失败
    onShareGroupFail: function (msg, params) {
        if (params && params.cbFunc) {
            params.cbFunc('failed');
        }
    },
	//排行榜列表刷新
	getRankPageUpDown:function(params){
		try {
            let openDataContext = wx.getOpenDataContext()
            let msg = {
                type: params.type,
				arg:params.arg
            }
            if (WXInterface.fenXiangZhenAbled) {
                msg.fenXiangZhen = WXInterface.fenXiangZhen;
            }
            openDataContext.postMessage(msg);
        } catch (error) {}
	},
    //获取游戏结束界面的排行榜
    fetchFinishPaiHang: function (params) {
        try {
            let openDataContext = wx.getOpenDataContext()
            let msg = {
                type: GData.OpenData.GOR
            }
            if (WXInterface.fenXiangZhenAbled) {
                msg.fenXiangZhen = WXInterface.fenXiangZhen;
            }
            openDataContext.postMessage(msg);
        } catch (error) {}
    },

    //初始化好友信息
    fetchLoadHaoYouPaiHang: function (params) {
        try {
            let openDataContext = wx.getOpenDataContext();
            let msg = {
                type: params.type
            }
            if (WXInterface.fenXiangZhenAbled) {
                msg.fenXiangZhen = WXInterface.fenXiangZhen;
            }
            openDataContext.postMessage(msg);
        } catch (error) {}
    },

    //获取战斗界面下一个好友信息
    fetchXiaHaoYouPaiHang: function (params) {
        try {
            let openDataContext = wx.getOpenDataContext();
            let msg = {
                type: params.type,
                score: params.score
            }
            if (WXInterface.fenXiangZhenAbled) {
                msg.fenXiangZhen = WXInterface.fenXiangZhen;
            }
            openDataContext.postMessage(msg);
            if (params.cbFunc) {
                params.cbFunc('wx');
            }
        } catch (error) {}
    },

};
module.exports = WXInterface;