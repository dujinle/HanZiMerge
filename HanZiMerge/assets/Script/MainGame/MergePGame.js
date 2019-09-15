var EventUtils = require('EventUtils');
cc.Class({
    extends: cc.Component,

    properties: {
			pauseBg:cc.Node,
			gotoHomeButton:cc.Node,
			returnGame:cc.Node,
			innerChainNode:cc.Node,
			soundOnNode:cc.Node,
			soundOffNode:cc.Node,
    },

    onLoad () {
	},
	//继续游戏按钮回调
	onContinueCb(event){
		EventUtils.emitLogic({type:EventUtils.eventName.LPCG});
	},
	//重新开始按钮回调
	onGoHomeCb(event){
		EventUtils.emitLogic({type:EventUtils.eventName.LPGH});
	},
	initInnerChain(time){
		var self = this;
		this.innerChainNode.active = false;
		var enabled = (GData.curDataInfo.gameAllNum % GData.alyunDJConfig.PropUnLock['PropInnerRate'] == 0);
		if(GData.alyunDJConfig.PropUnLock.PropLocker <= GData.curDataInfo.gameAllNum && enabled){
			this.innerChainNode.getComponent('ScrollLinkGame').createAllLinkGame(GData.alyunGameBox.locker);
			this.node.runAction(cc.sequence(cc.delayTime(time),cc.callFunc(function(){
				self.innerChainNode.active = true;
			})));
		}
	},
	show(){
		if(GData.VoiceEnabled == false){
			this.soundOnNode.active = false;
			this.soundOffNode.active = true;
		}else{
			this.soundOnNode.active = true;
			this.soundOffNode.active = false;
		}
		this.node.active = true;
		this.pauseBg.scale = 0;
		var pauseBgScale = cc.scaleTo(GData.actionTimeBuilds.zanTingMv,1);
		this.pauseBg.runAction(pauseBgScale);
		this.initInnerChain(GData.actionTimeBuilds.zanTingMv);
	},
	hidePause(callBack = null){
		var self = this;
		var pauseBgScale = cc.scaleTo(GData.actionTimeBuilds.zanTingMv,0.2);
		this.pauseBg.runAction(pauseBgScale);
		var hideAction = cc.callFunc(function(){
			if(callBack != null){
				callBack();
			}
		},this);
		
		this.node.runAction(cc.sequence(
			cc.delayTime(GData.actionTimeBuilds.zanTingMv),
			hideAction
		));
	},
	pauseRestart(){
		EventUtils.emitLogic({type:EventUtils.eventName.LPRG});
	},
	pauseSound(){
		if(GData.VoiceEnabled == false){
			this.soundOnNode.active = true;
			this.soundOffNode.active = false;
			GData.VoiceEnabled = true;
		}else{
			GData.VoiceEnabled = false;
			this.soundOnNode.active = false;
			this.soundOffNode.active = true;
		}
	}
    // update (dt) {},
});
