var EventUtils = require('EventUtils');
cc.Class({
    extends: cc.Component,

    properties: {
		tipLabel:cc.Node,
    },

    onLoad () {
		 this.node.scale = 0.5;
	},
	//继续游戏按钮回调
	onContinueCb(event){
		EventUtils.emitLogic({type:EventUtils.eventName.LCG});
	},
	//重新开始按钮回调
	onResetCb(event){
		EventUtils.emitLogic({type:EventUtils.eventName.LRG});
	},
	show(){
		this.node.runAction(cc.scaleTo(0.2,1));
	},
	onClose(){
		this.node.removeFromParent();
		this.node.destroy();
	}
});
