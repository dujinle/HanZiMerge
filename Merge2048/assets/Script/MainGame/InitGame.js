var util = require('util');
var WxBannerAd = require('WxBannerAd');
var WxVideoAd = require('WxVideoAd');
var ThirdInterface = require('ThirdInterface');
var DJUtils = require('DJUtils');
var EventUtils = require('EventUtils');
cc.Class({
    extends: cc.Component,

    properties: {
		mainGame:cc.Node,
		startGame:cc.Node,
		voiceManager:null,
    },
    onLoad () {
		//自动适配屏幕
		util.customScreenAdapt(this);
		//异步加载动态数据
		this.rate = 0;
		this.resLength = 6;
		GData.assets = {};
		var self = this;
		this.loadUpdate = function(){
			if(self.rate >= self.resLength){
				self.startGame.getComponent("MergeSGame").finishLoad(self.voiceManager);
				self.mainGame.getComponent("MergeMGame").finishLoad(self.voiceManager);
				self.unschedule(self.loadUpdate);
			}
		};
		cc.loader.loadRes("MergedPlist", cc.SpriteAtlas, function (err, atlas) {
			for(var key in atlas._spriteFrames){
				GData.assets[key] = atlas._spriteFrames[key];
			}
			self.rate = self.rate + 1;
		});
		cc.loader.loadResDir("prefabsInit",function (err, assets) {
			for(var i = 0;i < assets.length;i++){
				GData.assets[assets[i].name] = assets[i];
				self.rate = self.rate + 1;
				if(assets[i].name == 'VoiceSources'){
					self.voiceManager = cc.instantiate(assets[i]);
				}
			}
		});
		this.schedule(this.loadUpdate,0.1);
		GData.curDataInfo.gameAllNum = 1;
		ThirdInterface.loadLocalData();
		
	},
    start () {
		//加载游戏开始界面
		this.mainGame.getComponent("MergeMGame").initLoad();
		this.startGame.getComponent("MergeSGame").showStart();

		var self = this;
		ThirdInterface.loadCDNData(function(){
			self.startGame.getComponent("MergeSGame").refreshGame();
		});
		
		EventUtils.on(this.gameUIControll,this);
		EventUtils.onPress(this.djTouchCB,this);
		EventUtils.onLogic(this.gameLogicControll,this);
    },
	showGameScene(pnode,type){
		var scene = GData.liveViewBox[type];
		if(scene != null){
			if(GData.assets[type] != null){
				var sceneNode = cc.instantiate(GData.assets[type]);
				pnode.addChild(sceneNode);
				sceneNode.setPosition(cc.v2(0,0));
				sceneNode.getComponent(scene[1]).show();
				GData.currentViewDict[type] = sceneNode;
			}else{
				cc.loader.loadRes(scene[0], function (err, prefab) {
					GData.assets[type] = prefab;
					var sceneNode = cc.instantiate(prefab);
					pnode.addChild(sceneNode);
					sceneNode.setPosition(cc.v2(0,0));
					sceneNode.getComponent(scene[1]).show();
					GData.currentViewDict[type] = sceneNode;
				});
			}
		}
	},
	
	instGameScene(pnode,type,cb){
		var scene = GData.liveViewBox[type];
		if(scene != null){
			if(GData.assets[type] != null){
				var sceneNode = cc.instantiate(GData.assets[type]);
				pnode.addChild(sceneNode);
				sceneNode.setPosition(cc.v2(0,0));
				GData.currentViewDict[type] = sceneNode;
				cb(sceneNode);
			}else{
				cc.loader.loadRes(scene[0], function (err, prefab) {
					GData.assets[type] = prefab;
					var sceneNode = cc.instantiate(prefab);
					pnode.addChild(sceneNode);
					sceneNode.setPosition(cc.v2(0,0));
					GData.currentViewDict[type] = sceneNode;
					cb(sceneNode);
				});
			}
		}
	},
	
	destroyGameBoard(type){
		var board = GData.currentViewDict[type];
		if(board != null){
			board.stopAllActions();
			board.removeFromParent();
			board.destroy();
			GData.currentViewDict[type] = null;
		}
		return null;
	},
	djTouchCB(data){
		//取消按钮的传递
		if(data.type == 'DJHCancle'){
			this.destroyGameBoard('HammerGuideScene');
			WxBannerAd.showBannerAd();
			return;
		}else if(data.type == 'DJBCancle'){
			this.destroyGameBoard('BombGuideScene');
			this.mainGame.getComponent('MergeMGame').propBombAction(GData.curDataInfo.prevFSZ);
			GData.GDJBoxs.expDic['DJBomb'] -= 1;
			GData.GDJBoxs.boxDic['DJBomb'] += 1;
			this.mainGame.getComponent('MergeMGame').propFreshNum('DJBomb');
			WxBannerAd.showBannerAd();
			return;
		}
		else if(data.type == 'DJHTouch'){
			this.mainGame.getComponent('MergeMGame').useHammer(data);
		}
	},
	gameUIControll(data){
		var self = this;
		this.voiceManager.getComponent("VoiceManager").play(GData.VoiceConfig.VoiceBtn);
		if(data.type == EventUtils.eventName.RV){
			WxBannerAd.hideBannerAd();
			var finishGameBoard = GData.currentViewDict['FinishGameScene'];
			if(finishGameBoard != null){
				finishGameBoard.getComponent("MergeFGame").isDraw = false;
			}
			this.showGameScene(this.node,'RankGameScene');
		}
		if(data.type == EventUtils.eventName.OPDJ){
			this.instGameScene(this.node,'PropGameScene',function(node){
				node.getComponent("MergePpGame").initLoad(data.pos,data.openType,data.propKey);
			});
		}
		if(data.type == EventUtils.eventName.ORGS){
			this.instGameScene(this.node,'ReliveGameScene',function(node){
				node.getComponent('MergeRGame').waitCallBack(1,data.propRelive,function(){
					self.destroyGameBoard('ReliveGameScene');
					self.mainGame.getComponent('MergeMGame').finishGame();
				});
			});
		}
		if(data.type == EventUtils.eventName.OPGS){
			this.showGameScene(this.node,'PauseGameScene');
		}
		if(data.type == EventUtils.eventName.OHG){
			this.showGameScene(this.node,'HammerGuideScene');
		}
		if(data.type == EventUtils.eventName.OBG){
			this.showGameScene(this.node,'BombGuideScene');
		}
		if(data.type == EventUtils.eventName.OFGS){
			this.showGameScene(this.node,'FinishGameScene');
		}
	},
    gameLogicControll(data){
		var self = this;
		if(data.type != EventUtils.eventName.RS){
			this.voiceManager.getComponent("VoiceManager").play(GData.VoiceConfig.VoiceBtn);
		}
		if(data.type == EventUtils.eventName.LSG){
			/*开始游戏*/
			if(GData.curDataInfo.runGameType == 1 && GData.alyunDJConfig.PropUnLock.SaveGame == 1){
				this.showGameScene(this.node,'ContinueGameScene');
			}else{
				var propRelive = DJUtils.getPropStart();
				if(propRelive != null){
					this.startGame.getComponent("MergeSGame").hideStaticStart(function(){
						self.instGameScene(self.node,'ReliveGameScene',function(node){
							node.getComponent('MergeRGame').waitCallBack(0,propRelive,function(){
								self.destroyGameBoard('ReliveGameScene');
								self.mainGame.getComponent('MergeMGame').startGame();
							});
						});
					});
				}else{
					this.startGame.getComponent("MergeSGame").hideStart(function(){
						self.mainGame.getComponent('MergeMGame').startGame();
					});
				}
			}
		}
		//继续游戏按钮
		if(data.type == EventUtils.eventName.LCG){
			this.destroyGameBoard('ContinueGameScene');
			this.startGame.getComponent("MergeSGame").hideStaticStart(function(){
				self.mainGame.getComponent('MergeMGame').resumeGame();
			});
		}
		//重新开始按钮
		if(data.type == EventUtils.eventName.LRG){
			this.destroyGameBoard('ContinueGameScene');
			this.startGame.getComponent("MergeSGame").hideStaticStart(function(){
				self.mainGame.getComponent('MergeMGame').startGame();
			});
		}
		//暂停继续游戏按钮
		if(data.type == EventUtils.eventName.LPCG){
			var pauseGameBoard = GData.currentViewDict['PauseGameScene'];
			if(pauseGameBoard == null){
				return;
			}
			pauseGameBoard.getComponent("MergePGame").hidePause(function(){
				self.destroyGameBoard('PauseGameScene');
			});
		}
		//结束界面返回按钮
		if(data.type == EventUtils.eventName.LFGH){
			WxBannerAd.hideBannerAd();
			this.destroyGameBoard('FinishGameScene');
			this.mainGame.getComponent('MergeMGame').exitGame(true);
			this.startGame.getComponent("MergeSGame").showStart();
			//以上操作会改变游戏状态所以更新信息
			ThirdInterface.updataGameInfo();
		}
		//暂停界面返回开始按钮
		if(data.type == EventUtils.eventName.LPGH){
			WxBannerAd.hideBannerAd();
			var pauseGameBoard = GData.currentViewDict['PauseGameScene'];
			if(pauseGameBoard == null){
				return;
			}
			pauseGameBoard.getComponent("MergePGame").hidePause(function(){
				self.destroyGameBoard('PauseGameScene');
				self.mainGame.getComponent('MergeMGame').exitGame(false);
				self.startGame.getComponent("MergeSGame").showStart();
				//以上操作会改变游戏状态所以更新信息
				ThirdInterface.updataGameInfo();
			});
		}
		//暂停界面重新开始按钮
		if(data.type == EventUtils.eventName.LPRG){
			WxBannerAd.hideBannerAd();
			var pauseGameBoard = GData.currentViewDict['PauseGameScene'];
			if(pauseGameBoard == null){
				return;
			}
			pauseGameBoard.getComponent("MergePGame").hidePause(function(){
				self.destroyGameBoard('PauseGameScene');
				self.mainGame.getComponent('MergeMGame').reStartGame();
			});
		}
		//结束界面重新开始按钮
		if(data.type == EventUtils.eventName.LFRG){
			this.destroyGameBoard('FinishGameScene');
			this.mainGame.getComponent('MergeMGame').reStartGame();
			GData.curDataInfo.gameAllNum += 1;
			ThirdInterface.updataGameInfo();
		}
		//道具成功返回按钮
		if(data.type == EventUtils.eventName.LPSS){
			this.destroyGameBoard('PropGameScene');
			self.mainGame.getComponent('MergeMGame').getPropGameProp(data);
		}
		//复活界面道具成功返回按钮
		if(data.type == EventUtils.eventName.RS){
			GData.GDJBoxs.boxDic.DJRelive -= 1;
			GData.GDJBoxs.expDic.DJRelive += 1;
			this.destroyGameBoard('ReliveGameScene');
			if(data.action == 1){
				this.mainGame.getComponent('MergeMGame').ReliveBack(data.action);
			}else{
				this.startGame.getComponent("MergeSGame").hideStaticStart(function(){
					self.mainGame.getComponent('MergeMGame').ReliveBack(data.action);
				});
			}
		}
		//开始界面挑战返回
		if(data.type == EventUtils.eventName.LSBG){
			this.startGame.getComponent("MergeSGame").hideStaticStart(function(){
				self.mainGame.getComponent('MergeMGame').startGame();
				self.mainGame.getComponent('MergeMGame').getPropGameProp(data);
			});
		}
	}
	// update (dt) {},
});
