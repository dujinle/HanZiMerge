var ThirdInterface = require('ThirdInterface');
var WxVideoAd = require('WxVideoAd');
var EventUtils = require('EventUtils');
cc.Class({
    extends: cc.Component,

    properties: {
		processBar:cc.Node,
		numLabel:cc.Node,
		cancleLabel:cc.Node,
		openSprite:cc.Node,
		rate:10,
		action:0,
		loadUpdate:null,
		openType:null,
		cbFunc:null,
    },
    onLoad () {
		var self = this;
		this.numLabel.getComponent(cc.Label).string = 10;
		this.processBar.getComponent(cc.ProgressBar).progress = 1;
		this.cancleLabel.runAction(cc.fadeOut());
		this.node.scale = 0.5;
	},
	continueNow(event){
		if(event != null){
			this.unschedule(this.loadUpdate);
		}
		this.flagCBFunc = false;
		if(this.openType == "DJShare"){
			var param = {
				type:null,
				arg:null,
				successCallback:this.shareSuccessCb.bind(this),
				failCallback:this.shareFailedCb.bind(this),
				shareName:this.openType,
				isOpenCustomShare:true
			};
			if(GData.alyunGameCF.fenXiangCallFuncType == 0){
				param.isOpenCustomShare = false;
			}
			ThirdInterface.shareGame(param);
		}else if(this.openType == "DJAV"){
			this.DJAVTrueCallFunc = function(arg){
				EventUtils.emitLogic({type:EventUtils.eventName.RS,action:this.action});
			};
			this.DJAVFalseCallFunc = function(arg){
				if(arg == 'cancle'){
					this.showFailInfo();
				}else if(arg == 'error'){
					this.openType = "DJShare";
					this.continueNow(null);
				}
			};
			WxVideoAd.installVideo(this.DJAVTrueCallFunc.bind(this),this.DJAVFalseCallFunc.bind(this),null);
		}
	},
	quXiaoBtnCB(){
		this.cbFunc();
	},
	shareSuccessCb(type, fenXiangZhen, arg){
		if(this.flagCBFunc == false){
			EventUtils.emitLogic({type:EventUtils.eventName.RS,action:this.action});
		}
		this.flagCBFunc = true;
	},
	shareFailedCb(type,arg){
		if(this.flagCBFunc == false && this.node.active == true){
			this.showFailInfo();
		}
		this.flagCBFunc = true;
	},
	showFailInfo(){
		try{
			var self = this;
			var content = GData.msgBox.DJShareContent;
			if(this.openType == 'DJAV'){
				content = GData.msgBox.DJAVContent;
			}
			wx.showModal({
				title:'提示',
				content:content,
				cancelText:'取消',
				confirmText:'确定',
				confirmColor:'#53679c',
				success(res){
					if (res.confirm) {
						self.continueNow(null);
					}else if(res.cancel){
						self.schedule(self.loadUpdate,1);
					}
				}
			});
		}catch(err){}
	},
	waitCallBack(action,prop,cb){
		var self = this;
		this.cbFunc = cb;
		this.node.runAction(cc.scaleTo(0.2,1));
		this.openType = prop;
		this.action = action;
		if(this.openType == 'DJShare'){
			this.openSprite.getComponent(cc.Sprite).spriteFrame = GData.assets['share'];
		}else if(this.openType == 'DJAV'){
			this.openSprite.getComponent(cc.Sprite).spriteFrame = GData.assets['share_videw'];
		}
		this.loadUpdate = function(){
			self.rate = self.rate - 1;
			self.numLabel.getComponent(cc.Label).string = self.rate;
			var scale = self.rate/10;
			self.processBar.getComponent(cc.ProgressBar).progress = scale;
			if(self.rate <= 0){
				self.unschedule(self.loadUpdate);
				cb();
			}
		};
		this.schedule(this.loadUpdate,1);
		this.cancleLabel.runAction(cc.sequence(cc.delayTime(1),cc.fadeIn()));
	}
});
