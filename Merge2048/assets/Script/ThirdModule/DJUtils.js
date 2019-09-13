let DJUtils = {
	//获取道具
	getProp(mergeNum){
		//获取 刷新/宝箱的概率
		var mergeParam = this.fetchDataByGTS(GData.alyunDJConfig.heBingLogics);
		var propsRate = mergeParam[mergeNum];
		//随机获取一个道具 刷新或者宝箱
		var prop = this.fetchKeyByRandom(propsRate);
		if(prop == null){
			return null;
		}
		//随机的刷新道具
		if(prop == "DJFresh"){
			//并且道具已经开锁
			if(GData.alyunDJConfig.PropUnLock[prop] <= GData.curDataInfo.gameAllNum){
				return prop;
			}
		}else if(prop == "DJSAB"){
			//确定宝箱是否解锁
			if(GData.alyunDJConfig.PropUnLock['DJSAB'] > GData.curDataInfo.gameAllNum){
				//没有解锁 直接获取 刷新道具
				return "DJFresh";
			}
			prop = this.getShareOrADKey(prop);
			//如果是分享则判断是否解锁
			if(GData.alyunDJConfig.PropUnLock[prop] > GData.curDataInfo.gameAllNum){
				return null;
			}
			propsRate = GData.alyunDJConfig.SABOpenRate;
			var secondProp = this.fetchKeyByRandom(propsRate);;
			if(GData.alyunDJConfig.PropUnLock[secondProp] <= GData.curDataInfo.gameAllNum){
				return prop + "_" + secondProp;;
			}
		}
		return null;
	},
	getPropRelive(){
		//如果没有解锁 不可用
		//GData.GDJBoxs.boxDic.DJRelive += 1;
		//return 'DJShare';
		if(GData.alyunDJConfig.PropUnLock.DJRelive > GData.curDataInfo.gameAllNum){
			return null;
		}
		//判断是否到达使用上限
		var propBag = this.fetchDJBox('DJRelive');
		if(GData.GDJBoxs.expDic['DJRelive'] >= propBag.expDic){
			return null;
		}
		//如果有道具了 就不获取了
		if(GData.GDJBoxs.boxDic.DJRelive > 0){
			var prop = this.getShareOrADKey('DJRelive');
			return prop;
		}
		if(GData.GDJBoxs.boxDic.DJRelive == 0){
			var random = Math.random();
			var reliveRate = this.fetchDataByGTS(GData.alyunDJConfig.DJReliveRate);
			if(random <= reliveRate){
				GData.GDJBoxs.boxDic.DJRelive += 1;
				return this.getShareOrADKey('DJRelive');
			}else{
				return null;
			}
		}
	},
	getPropStart(){
		//如果没有解锁 不可用
		if(GData.alyunDJConfig.PropUnLock.DJRelive > GData.curDataInfo.gameAllNum){
			return null;
		}
		//如果有道具了 就不获取了
		var propBag = this.fetchDJBox('DJRelive');
		if(GData.GDJBoxs.expDic['DJRelive'] >= propBag.expDic){
			return null;
		}
		if(GData.GDJBoxs.boxDic.DJRelive > 0){
			var prop = this.getShareOrADKey('DJRelive');
			return prop;
		}
		return null;
	},
	getShareOrADKey(prop){
		var trate = GData.alyunDJConfig.DJSAVConfig[GData.alyunGameCF.gameModel];
		var propRate = this.fetchDataByGTS(trate);
		var propsRate = propRate[prop];
		var netProp = this.fetchKeyByRandom(propsRate);
		return netProp;
	},
	fetchKeyByRandom(propsRate){
		var prop = null;
		var random = Math.random();
		var randomTmp = 0;
		for(var key in propsRate){
			if(random > randomTmp && random <= propsRate[key] + randomTmp){
				prop = key;
			}
			randomTmp = randomTmp + propsRate[key];
		}
		return prop;
	},
	fetchDJBox(prop){
		if(prop == 'DJFresh'){
			return GData.alyunDJConfig.DJConfig[prop];
		}else{
			var bag = GData.alyunDJConfig.DJConfig[prop];
			for(var key in bag){
				if(GData.curDataInfo.gameAllNum <= key){
					return bag[key];
				}
			}
			return bag['default'];
		}
	},
	/*根据局数获取对应的参数 包括标记局*/
	fetchDataByGTS(data){
		for(var key in data){
			if(GData.curDataInfo.gameAllNum <= key){
				return data[key];
			}
		}
		return data['default'];
	}
};
module.exports = DJUtils;