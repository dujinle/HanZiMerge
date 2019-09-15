cc.Class({
    extends: cc.Component,

    properties: {
		numLabel:cc.Node,
		bombSprite:cc.Node,
		freshSprite:cc.Node,
		hammerSprite:cc.Node,
    },
	onLoad(){
		this.node.scale = 0;
	},
	startFly(delayTime,name,numNum,endPos,cb){
		if(name == 'DJFresh'){
			this.freshSprite.active = true;
		}else if(name == 'DJHammer'){
			this.hammerSprite.active = true;
		}else if(name == 'DJBomb'){
			this.bombSprite.active = true;
		}
		
		this.numLabel.getComponent(cc.Label).string = "x " + numNum;

		var scaleTo = cc.scaleTo(GData.actionTimeBuilds.scoreFlyT,1);
		var moveEnd = cc.moveTo(GData.actionTimeBuilds.scoreFlyT,endPos);
		var scaleToS = cc.scaleTo(GData.actionTimeBuilds.scoreFlyT,0);
		var scaleToEnd = cc.spawn(scaleToS,moveEnd);
		var self = this;
		var destroyAction = cc.callFunc(function(){
			self.node.removeFromParent();
			self.node.destroy();
			if(cb != null){
				cb();
			}
		},this);
		this.node.runAction(cc.sequence(cc.delayTime(delayTime),scaleTo,cc.delayTime(GData.actionTimeBuilds.scoreFlyT/2),scaleToEnd,destroyAction));
	},
});
