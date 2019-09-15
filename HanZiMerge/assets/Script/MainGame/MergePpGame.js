var WxVideoAd = require('WxVideoAd');
var ThirdInterface = require('ThirdInterface');
var EventUtils = require('EventUtils');
cc.Class({
    extends: cc.Component,

    properties: {
		propKey:null,
		openType:null,
		cancelNode:cc.Node,
		bgContext:cc.Node,
		light:cc.Node,
		typeSprite:cc.Node,
		flagCBFunc:false,
    },
    onLoad () {
		 this.cancelNode.active = false;
		 this.flagCBFunc = false;
		 this.bgContext.scale = 0.2;
	},
	initLoad(startPos,openType,prop){
		var self = this;
		this.startPos = startPos;
		this.openType = openType;
		this.propKey = prop;
		if(this.openType == 'DJShare'){
			this.typeSprite.getComponent(cc.Sprite).spriteFrame = GData.assets['share'];
		}else if(this.openType == 'DJAV'){
			this.typeSprite.getComponent(cc.Sprite).spriteFrame = GData.assets['share_videw'];
		}
		this.light.runAction(cc.repeatForever(cc.rotateBy(2, 360)));
		this.bgContext.runAction(cc.scaleTo(GData.actionTimeBuilds.scaleSbaT,1));
		setTimeout(function(){
			self.cancelNode.active = true;
		},1000);
	},
	buttonCb(){
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
				EventUtils.emitLogic({
					type:EventUtils.eventName.LPSS,
					propKey:'DJBomb',
					startPos:cc.v2(0,0)
				});
			}.bind(this);
			this.DJAVFalseCallFunc = function(arg){
				if(arg == 'cancle'){
					this.showFailInfo();
				}else if(arg == 'error'){
					this.openType = "DJShare";
					this.buttonCb();
				}
			}.bind(this);
			WxVideoAd.installVideo(this.DJAVTrueCallFunc,this.DJAVFalseCallFunc,this);
		}
	},
	shareSuccessCb(type, fenXiangZhen, arg){
		if(this.flagCBFunc == false){
			EventUtils.emitLogic({
				type:EventUtils.eventName.LPSS,
				propKey:this.propKey,
				startPos:this.startPos
			});
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
						self.buttonCb();
					}else if(res.cancel){}
				}
			});
		}catch(err){}
	},
	//道具个数发生变化
	propFreshNum(prop,propNode){
		if(prop == 'DJFresh'){
			propNode.getChildByName("boxLabel").getComponent(cc.Label).string = "x" + GData.GDJBoxs.boxDic['DJFresh'];
		}else if(prop == 'DJHammer'){
			if(GData.GDJBoxs.boxDic['DJHammer'] > 0){
				propNode.getChildByName("openType").active = false;
				propNode.getChildByName("boxLabel").active = true;
				propNode.getChildByName("boxLabel").getComponent(cc.Label).string = "x" + GData.GDJBoxs.boxDic['DJHammer'];
			}else{
				propNode.getChildByName("openType").active = true;
				propNode.getChildByName("boxLabel").active = false;
			}
		}else if(prop == 'DJBomb'){
			if(GData.GDJBoxs.boxDic['DJBomb'] > 0){
				propNode.getChildByName("openType").active = false;
				propNode.getChildByName("boxLabel").active = true;
				propNode.getChildByName("boxLabel").getComponent(cc.Label).string = "x" + GData.GDJBoxs.boxDic['DJBomb'];
			}else{
				propNode.getChildByName("openType").active = true;
				propNode.getChildByName("boxLabel").active = false;
			}
		}
	},
	cancel(){
		this.node.removeFromParent();
		this.node.destroy();
	}
});
