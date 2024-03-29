
cc.Class({
    extends: cc.Component,

    properties: {
		value:0,
		bgSprite:cc.Node,
		pressedScale:1.2,
		flyNode:null
    },
    onInit(num) {
		this.value = num;
		this.node.scale = 1;
		var spriteFrameName = GData.skin + '_' + num;
		this.bgSprite.getComponent(cc.Sprite).spriteFrame = GData.assets[spriteFrameName];
		this.bgSprite.runAction(cc.fadeIn(0));
	},
	merge2048Action(audioManager,sq,cbFunc){
		var self = this;
		var ESAction = cc.callFunc(function(){
			var E1Sprite = new cc.Node("E1");
			var sprite = E1Sprite.addComponent(cc.Sprite);
			sprite.spriteFrame = GData.assets["eliminate_1"];
			self.node.addChild(E1Sprite);
			
			var E2Sprite = new cc.Node("E2");
			sprite = E2Sprite.addComponent(cc.Sprite);
			sprite.spriteFrame = GData.assets["eliminate_2"];
			self.node.addChild(E2Sprite);
			
			var E3Sprite = new cc.Node("E3");
			sprite = E3Sprite.addComponent(cc.Sprite);
			sprite.spriteFrame = GData.assets["eliminate_3"];
			self.node.addChild(E3Sprite);
			E1Sprite.scale = 1;
			E2Sprite.scale = 1;
			E3Sprite.scale = 1;
			self.bgSprite.runAction(cc.fadeOut(0.1));
			var scaleBig1 = cc.scaleTo(0.3,2);
			E1Sprite.runAction(cc.sequence(scaleBig1.clone(),cc.fadeOut(0.1)));
			E2Sprite.runAction(cc.sequence(cc.delayTime(0.3),scaleBig1.clone(),cc.fadeOut(0.1)));
			E3Sprite.runAction(cc.sequence(cc.delayTime(0.6),scaleBig1.clone(),cc.fadeOut(0.1)));
			audioManager.getComponent('VoiceManager').play(GData.VoiceConfig.VoiceCLight);
		});
		
		var numAction = cc.callFunc(function(){
			var x = GData.FILE_X(sq);
			var y = GData.RANK_Y(sq);
			for(var j = 0;j < GData.moveStep.length;j++){
				var step = GData.moveStep[j];
				var tsq = GData.COORD_XY(x + step[0],y + step[1]);
				if(GData.numMap[tsq] != 0){
					GData.numNodeMap[tsq].removeFromParent();
					GData.numNodeMap[tsq].destroy();
				}
				GData.numNodeMap[tsq] = 0;
				GData.numMap[tsq] = 0;
			}
			cbFunc();
		},this);
		this.node.runAction(ESAction);
		this.node.runAction(cc.sequence(cc.delayTime(1.2),numAction));
	},
	//动画增大一次这里加入延迟参数 多次执行的时候延迟一下
	scaleBigOnce(audioManager){
		this.initScale = this.node.scale;
		var scaleUpAction = cc.scaleTo(GData.actionTimeBuilds.heBingSBMv, this.pressedScale);
        var scaleDownAction = cc.scaleTo(GData.actionTimeBuilds.heBingSBMv, this.initScale);
		audioManager.getComponent('VoiceManager').play(GData.VoiceConfig.VoiceFollow);
		this.node.runAction(cc.sequence(scaleUpAction,scaleDownAction));
	},
	flyMergeScore(key,length,idx,addScore){
		if(this.flyNode == null){
			this.flyNode = cc.instantiate(GData.assets["ScoreFlyScene"]);
			this.node.addChild(this.flyNode);
		}
		this.flyNode.stopAllActions();
		var pos = this.node.getPosition();
		var size = this.node.getContentSize();
		var flyNodeSize = this.flyNode.getContentSize();
		this.flyNode.setPosition(cc.v2(0,size.height/2 + flyNodeSize.height/4));
		this.flyNode.getComponent("ScoreFlyScene").startFlyOnce(idx,key,addScore);
	},
	scaleShow(num,audioManager){
		this.initScale = this.node.scale;
		this.node.scale = 0;
		this.onInit(num);
		var scaleUpAction = cc.scaleTo(GData.actionTimeBuilds.freshShuZiT, this.pressedScale);
        var scaleDownAction = cc.scaleTo(GData.actionTimeBuilds.freshShuZiT, this.initScale);
		var playAudioAction = cc.callFunc(function(){
			audioManager.getComponent('VoiceManager').play(GData.VoiceConfig.VoiceBtn);
		},this);
		this.node.runAction(cc.sequence(scaleUpAction,scaleDownAction));
		this.node.runAction(cc.sequence(cc.delayTime(GData.actionTimeBuilds.freshShuZiT),playAudioAction));
	},
	MergeFinishNum(num,cb){
		this.onInit(num);
		this.initScale = this.node.scale;
		var scaleUpAction = cc.scaleTo(GData.actionTimeBuilds.heBingSBMv, this.pressedScale);
        var scaleDownAction = cc.scaleTo(GData.actionTimeBuilds.heBingSBMv, this.initScale);
		var finish = cc.callFunc(function(){
			if(cb != null){
				cb();
			}
		},this);
		this.node.runAction(cc.sequence(scaleUpAction,scaleDownAction,finish));
	}
});
