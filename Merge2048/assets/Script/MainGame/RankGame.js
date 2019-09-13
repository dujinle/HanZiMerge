var ThirdInterface = require('ThirdInterface');
cc.Class({
    extends: cc.Component,

    properties: {
		rankSprite:cc.Node,
		isDraw:false,
    },
    onLoad () {
		cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞没
            onTouchBegan: function (touch, event) {
                return true;
            },
            onTouchMoved: function (touch, event) {            // 触摸移动时触发
            },
            onTouchEnded: function (touch, event) {            // 点击事件结束处理
			}
        }, this.node);
	},
	start(){
		try{
			this.texture = new cc.Texture2D();
			var openDataContext = wx.getOpenDataContext();
			this.sharedCanvas = openDataContext.canvas;
		}catch(error){}
		//this.sharedCanvas.width = 640;
		//this.sharedCanvas.height = 1136;
	},
	onClose(){
		GData.currentViewDict['RankGameScene'] = null;
		this.node.removeFromParent();
		this.node.destroy();
	},
	show(){
		this.isDraw = true;
		this.node.active = true;
		var param = {
			type:GData.OpenData.FUR
		};
		ThirdInterface.getRank(param);
	},
	hide(){
		this.isDraw = false;
		this.node.active = false;
	},
	friendRankCb(){
		this.isDraw = true;
		 var param = {
			type:GData.OpenData.FUR
		};
		ThirdInterface.getRank(param);
	},
	groupRankCb(){
		this.isDraw = true;
		 var param = {
			type:GData.OpenData.GUR
		};
		ThirdInterface.getRank(param);
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
