
cc.Class({
    extends: cc.Component,

    properties: {
		rankGmameView:cc.Node,
		aboveGameView:cc.Node,
    },
	onLoad(){
		this.setViewVisiable(null);
	},
    start () {
        wx.onMessage(data => {
			//this.setViewVisiable(null);
            switch (data.type) {
                case 'GameOverRank':
					wx.getFriendCloudStorage({
						keyList: ['maxScore','gold'], // 你要获取的、托管在微信后台都key
						success: res => {
							//console.log(res.data);
							//排序
							this.setViewVisiable(data.type);
							var rankList = this.sortRank(res.data);
							this.drawRankOverList(rankList,data);
						}
					});
					
                    break;
                case 'UIFriendRank':
					wx.getFriendCloudStorage({
						keyList: ['maxScore','gold'], // 你要获取的、托管在微信后台都key
						success: res => {
							//console.log(res.data);
							//排序
							this.setViewVisiable(data.type);
							var rankList = this.sortRank(res.data);
							this.drawRankFrientList(rankList,data);
						}
					});
                    break;
				case 'GroupRank':
					wx.getGroupCloudStorage({
						shareTicket: data.shareTicket,
						keyList: ['maxScore','gold'], // 你要获取的、托管在微信后台都key
						success: res => {
							//console.log(res.data);
							//排序
							this.setViewVisiable(data.type);
							var rankList = this.sortRank(res.data);
							this.drawRankFrientList(rankList,data);
						}
					});
                    break;
				case 'InitFriendRank':
					this.setViewVisiable(data.type);
					this.initRankFriendCloudStorage(data);
					break;
				case 'SurPassRank':
					this.setViewVisiable(data.type);
					this.drawRankList(this.rankList,data);
                    break;
            }
        });
    },
	initRankFriendCloudStorage(data){
		this.rankList = null;
		this.battleInit = false;
		this.myRankData = null;
		wx.getFriendCloudStorage({
			keyList: ['maxScore','gold'], // 你要获取的、托管在微信后台都key
			success: res => {
				//console.log(res.data);
				var dataList = res.data;
				wx.getUserInfo({
					openIdList: ['selfOpenId'],
					lang: 'zh_CN',
					success: (res) => {
						console.log('getUserInfo success', res.data);
						for(var i = 0;i < dataList.length;i++){
							var item = dataList[i];
							item.rank = i + 1;
							item.my = false;
							if(item.nickname == res.data[0].nickName){
								item.my = true;
								this.myRankData = item;
							}
						}
						this.rankList = this.sortRank(dataList);
						this.battleInit = true;
						var data = {type:'SurPassRank',score:0};
						this.setViewVisiable(data.type);
						this.drawRankList(this.rankList,data);
					},
					fail: (res) => {
						//console.log('getUserInfo reject', res.data)
						reject(res)
						//data.name = '我';
						//data.avatarUrl = 'res/raw-assets/resources/textures/fireSprite.png';
						//this.drawSelfRank(data.KVDataList);
					}
				})
			}
		});
	},
	setViewVisiable(type){
		this.rankGmameView.active = false;
		this.aboveGameView.active = false;
		if(type == 'SurPassRank'){
			this.aboveGameView.active = true;
		}else if(type == 'GroupRank'){
			this.rankGmameView.active = true;
		}else if(type == 'UIFriendRank'){
			this.rankGmameView.active = true;
		}
	},
	drawRankOverList(dataList,data){
		wx.getUserInfo({
			openIdList: ['selfOpenId'],
			lang: 'zh_CN',
			success: (res) => {
				console.log('getUserInfo success', res.data);
				var preData = null;
				var drawList = [];
				var findSelf = false;
				for(var i = 0;i < dataList.length;i++){
					var item = dataList[i];
					item.rank = i + 1;
					item.my = false;
					if(item.nickname == res.data[0].nickName){
						item.my = true;
						if(preData != null){
							drawList.push(preData);
						}
						drawList.push(item);
						findSelf = true;
						continue;
					}
					if(findSelf == true){
						if(drawList.length <= 2){
							drawList.push(item);
						}
					}
					//找到三个 如果有了就结束循环
					if(drawList.length >= 3){
						break;
					}
					preData = item;
				}
				this.drawRankList(drawList,data);
			},
			fail: (res) => {
				//console.log('getUserInfo reject', res.data)
				reject(res)
				//data.name = '我';
				//data.avatarUrl = 'res/raw-assets/resources/textures/fireSprite.png';
				//this.drawSelfRank(data.KVDataList);
			}
		})
		
	},
	drawRankFrientList(rankList,data){
		wx.getUserInfo({
			openIdList: ['selfOpenId'],
			lang: 'zh_CN',
			success: (res) => {
				console.log('getUserInfo success', res.data);
				for(var i = 0;i < rankList.length;i++){
					var item = rankList[i];
					item.rank = i + 1;
					item.my = false;
					if(item.nickname == res.data[0].nickName){
						item.my = true;
					}
				}
				this.drawRankList(rankList,data);
			},
			fail: (res) => {
				//console.log('getUserInfo reject', res.data)
				reject(res)
				//data.name = '我';
				//data.avatarUrl = 'res/raw-assets/resources/textures/fireSprite.png';
				//this.drawSelfRank(data.KVDataList);
			}
		})
	},
	drawRankList(drawList,data){
		console.log('drawRankList',drawList,data);
		if(data.type == "UIFriendRank" || data.type == "GroupRank"){
			this.rankGmameView.getComponent("RankGameView").loadRank(drawList);
		}else if(data.type == 'SurPassRank'){
			if(this.battleInit == true){
				this.aboveGameView.getComponent("AboveGameView").loadRank(drawList,this.myRankData,data.score);
			}
		}
	},
	sortRank(data){
		return data.sort(this.sortFunction);
	},
	sortFunction(a,b){
		var amaxScore = 0;
		var bmaxScore = 0;
		for(var i = 0;i < a.KVDataList.length;i++){
			var aitem = a.KVDataList[i];
			//console.log(aitem);
			if(aitem.key == "maxScore"){
				amaxScore = parseInt(aitem.value);
			}
		}
		for(var i = 0;i < b.KVDataList.length;i++){
			var bitem = b.KVDataList[i];
			//console.log(bitem);
			if(bitem.key == "maxScore"){
				bmaxScore = parseInt(bitem.value);
			}
		}
		return  bmaxScore - amaxScore;
	}
});
