var ThirdInterface = require('ThirdInterface');
var EventUtils = require('EventUtils');
cc.Class({
    extends: cc.Component,

    properties: {
		rankSprite:cc.Node,
		isDraw:false,
		scoreLabel:cc.Node,
		maxScoreLabel:cc.Node,
		upLabel:cc.Node,
		openSprite:cc.Node,
		//innerChainNode:cc.Node,
    },
    onLoad () {
	},
	start(){
		/*
		try{
			this.texture = new cc.Texture2D();
			var openDataContext = wx.getOpenDataContext();
			this.sharedCanvas = openDataContext.canvas;
		}catch(error){}
		*/
	},
	initInnerChain(time){
		var self = this;
		this.innerChainNode.active = false;
		if(GData.alyunDJConfig.PropUnLock.PropLocker <= GData.curDataInfo.gameAllNum){
			this.innerChainNode.getComponent('ScrollLinkGame').createAllLinkGame(GData.alyunGameBox.locker);
			this.node.runAction(cc.sequence(cc.delayTime(time),cc.callFunc(function(){
				self.innerChainNode.active = true;
			})));
		}
	},
	showInnerChain(){
		this.innerChainNode.getComponent('ScrollLinkGame').playScrollLinkGame(true);
	},
	show(){
		this.scoreLabel.getComponent(cc.Label).string = GData.curDataInfo.allGameFenShu;
		this.maxScoreLabel.getComponent(cc.Label).string = GData.curDataInfo.maxScore;
		//this.isDraw = true;
		//this.initInnerChain(0);
		//this.node.active = true;
		/*
		var param = {
			type:GData.OpenData.GOR
		};
		ThirdInterface.getRank(param);
		*/
	},
	hide(){
		this.isDraw = false;
		this.node.active = false;
	},
	rankButtonCb(){
		EventUtils.emit({type:EventUtils.eventName.RV});
	},
	restartButtonCb(){
		EventUtils.emitLogic({type:EventUtils.eventName.LFRG});
	},
	goHomeButtonCb(){
		EventUtils.emitLogic({type:EventUtils.eventName.LFGH});
	},
	shareToFriends(){
		var param = {
			type:null,
			arg:null,
			successCallback:this.shareSuccessCb.bind(this),
			failCallback:this.shareFailedCb.bind(this),
			shareName:'shareGame',
			isOpenCustomShare:false
		};
		ThirdInterface.shareGame(param);
	},
	shareSuccessCb(type, fenXiangZhen, arg){
	},
	shareFailedCb(type,arg){
	},
	rankSuccessCb(){
		if(!this.texture){
			return;
		}
		this.texture.initWithElement(this.sharedCanvas);
		this.texture.handleLoadedTexture();
		this.rankSprite.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.texture);
	},
	update(){
		if(this.isDraw == true){
			this.rankSuccessCb();
		}
	}
});
