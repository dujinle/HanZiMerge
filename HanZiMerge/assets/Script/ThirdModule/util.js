let util = {
	getRandomIndexForArray(array){
		if(array == null || array.length == 0){
			return -1;
		}
		var random = Math.floor(Math.random()*array.length);
		return random;
	},
	//节点距离计算欧式公式
	euclDist:function(pos1,pos2){
		var a = pos1.x - pos2.x;
		var b = pos1.y - pos2.y;
		var dist = Math.sqrt(a * a + b * b);
		return dist;
	},
	reSetPropShareOrADRate(){
		for(var key in GData.alyunDJConfig.DJSAVConfig){
			var item = GData.alyunDJConfig.DJSAVConfig[key];
			//cary or normal
			for(var key2 in item){
				//4,31,default
				var item2 = item[key2];
				for(var key3 in item2){
					if(key3 == 'DJSAB'){
						item2[key3].DJShare = GData.alyunGameCF.DJShare;
						item2[key3].DJAV = GData.alyunGameCF.DJAV;
					}
				}
			}
		}
	},
	//获取随机数
	getRandomNum:function(rateType){
		var randomNumber = Math.random();
		var startRate = 0.0;
		for(var num in rateType){
			var rateTmp = rateType[num];
			if(randomNumber > startRate && randomNumber <= startRate + rateTmp){
				return num;
			}
			startRate += rateTmp;
		}
		
		//这里返回2 避免rateType设置错误导致无效
		return -1;
	},
	getRandomArray:function(length){
		var res = new Array();
		var dst = new Array();
		for(var i = 0;i < length;i++){
			res.push(i);
		}
		for(var i = length;i > 0;i--){
			var idx = Math.floor(Math.random() * i);
			dst.push(res[idx]);
			res.splice(idx,1);
		}
		return dst;
	},
	refreshOneNum(scaleFlag = 0){
		var enabled = false;
		if(scaleFlag == 1){
			enabled = Math.random() <= GData.alyunGameCF.DJFreshEnableRate;
		}else if(scaleFlag == 2){
			enabled = Math.random() <= GData.alyunGameCF.NoDeadRate;
		}
		if(enabled == true){
			var selectNum = new Array();
			for(var i = GData.RANK_TOP;i < 6;i++){
				for(var j = GData.FILE_LEFT;j < 6;j++){
					var fsq = GData.COORD_XY(i,j);
					if(GData.numMap[fsq] == 0){
						for(var m = 0;m < GData.moveStep.length;m++){
							var step = GData.moveStep[m];
							var tsq = GData.COORD_XY(i + step[0],j + step[1]);
							if(GData.numMap[tsq] != 0){
								selectNum.push(GData.numMap[tsq]);
							}
						}
					}
				}
			}
			var length = selectNum.length;
			while(length > 0){
				var num = selectNum[Math.floor(length * Math.random())];
				if(num == GData.curDataInfo.prevFSZ){
					continue;
				}
				return num;
			}
		}
		var num = -1;//test[GData.curDataInfo.huiHeShu % test.length];
		var numRateMap = GData.alyunFreshLv;
		if(GData.curDataInfo.gameAllNum > GData.alyunGameCF.NumRateJuNum){
			numRateMap = GData.alyunFreshLvStep;
		}
		while(num == -1){
			var lastKey = 'default';
			for(var key in numRateMap){
				if(GData.curDataInfo.huiHeShu <= key){
					lastKey = key;
					break;
				}
			}
			num = this.getRandomNum(numRateMap[lastKey]);
			if(num == GData.curDataInfo.prevFSZ){
				num = -1;
			}
		}
		return num;
	},
	isArrayFn:function(value){
		if (typeof Array.isArray === "function") {
			return Array.isArray(value);
		}else{
			return Object.prototype.toString.call(value) === "[object Array]";
		}
	},
	//复制对象，如果存在属性则更新
	clipStc:function (newObj,obj,copyKeys) {
		if(typeof obj !== 'object'){
			return;
		}
		//如果是一个数组对象则直接复制
		for(var key in obj){
			if(copyKeys.includes(key)){
				newObj[key] = obj[key];
			}else if(newObj[key] == null){
				newObj[key] = obj[key];
			}else if(typeof obj[key] !== 'object'){
				newObj[key] = obj[key];
			}else if(this.isArrayFn(obj[key])){
				newObj[key] = obj[key];
			}else if(typeof obj[key] == 'object'){
				this.clipStc(newObj[key],obj[key],copyKeys);
			}
		}
	},
	getPhoneModel:function(){
		var size = cc.view.getFrameSize();
		console.log('getFrameSize:',size);
		var biLi = cc.winSize.width / cc.winSize.height;
		if (typeof wx !== 'undefined') {
            try {
                var sysInfo = wx.getSystemInfoSync();
                if (sysInfo && sysInfo.model) {
                    // 适配iphoneX
                    var isFitIphoneX = (sysInfo.model.toLowerCase().replace(/\s+/g, "").indexOf("iphonex", 0) != -1);
                    if (isFitIphoneX) {
                        return 'IphoneX';
                    }
					if(biLi < 0.5){
						return 'IphoneX';
					}else{
						return 'Normal';
					}
                }
            } catch (error) {
				if(biLi < 0.5){
					return 'IphoneX';
				}else{
					return 'Normal';
				}
            }
        }
		if(biLi < 0.5){
			return 'IphoneX';
		}else{
			return 'Normal';
		}
	},
	customScreenAdapt(pthis){
		var DesignWidth = 640;
		var DesignHeight = 1136;
		let size = cc.view.getFrameSize();
		GData.phoneModel = this.getPhoneModel();
		if (GData.phoneModel == 'IphoneX'){ //判断是不是iphonex
			cc.view.setDesignResolutionSize(1125, 2436, cc.ResolutionPolicy.FIXED_WIDTH);
			pthis.node.scaleX = 1125 / 640;
			pthis.node.scaleY = 2436 / 1136;
			let openDataContext = wx.getOpenDataContext();
			let sharedCanvas = openDataContext.canvas;
			sharedCanvas.width = 640;
			sharedCanvas.height = 1136;
			pthis.mainGame.setPosition(cc.v2(0,-40));
			GData.phoneModel = 'IphoneX';
		}else if(GData.phoneModel == 'IphoneXR'){
			cc.view.setDesignResolutionSize(828, 1792, cc.ResolutionPolicy.FIXED_WIDTH);
			pthis.node.scaleX = 828 / 640;
			pthis.node.scaleY = 1792 / 1136;
			let openDataContext = wx.getOpenDataContext();
			let sharedCanvas = openDataContext.canvas;
			sharedCanvas.width = 640;
			sharedCanvas.height = 1136;
			pthis.mainGame.setPosition(cc.v2(0,-40));
			GData.phoneModel = 'IphoneXR';
		}else{
			GData.phoneModel = 'Normal';
		}
	},
	compareVersion:function(v1, v2) {
		v1 = v1.split('.')
		v2 = v2.split('.')
		const len = Math.max(v1.length, v2.length)
		while (v1.length < len) {
			v1.push('0')
		}
		while (v2.length < len) {
			v2.push('0')
		}
		for (let i = 0; i < len; i++) {
			const num1 = parseInt(v1[i])
			const num2 = parseInt(v2[i])
			if (num1 > num2) {
				return 1
			} else if (num1 < num2) {
				return -1
			}
		}
		return 0
	}
};
module.exports = util;