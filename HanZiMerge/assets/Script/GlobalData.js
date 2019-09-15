GData = {
	//皮肤设置
	skin:'color1',
	phoneModel:'',
	alyunCFVersion:"cdnParam1.0.2",
	liveViewBox:{
		BombGuideScene:['prefabs/BombGuideScene','PropBombEffect'],
		ContinueGameScene:['prefabs/ContinueGameScene','ContinueGame'],
		FinishGameScene:['prefabs/FinishGameScene','MergeFGame'],
		StartGuideScene:['prefabs/StartGuideScene','StartGuideScene'],
		HammerGuideScene:['prefabs/HammerGuideScene','HammerGuideScene'],
		PBInnerItem:['prefabs/PBInnerItem','LockerItem'],
		ScoreFlyScene:['prefabs/ScoreFlyScene','ScoreFlyScene'],
		NumBlockScene:['prefabs/NumBlockScene','NumBlockScene'],
		PauseGameScene:['prefabs/PauseGameScene','MergePGame'],
		PropFlyScene:['prefabs/PropFlyScene','PropFlyScene'],
		PropGameScene:['prefabs/PropGameScene','MergePpGame'],
		RankGameScene:['prefabs/RankGameScene','RankGame'],
		ReliveGameScene:['prefabs/ReliveGameScene','MergeRGame']
	},
	msgBox:{
		DJAVContent:'看完视频才能获得奖励，请再看一次!',
		DJShareContent:'请分享到不同的群获得更多的好友帮助!'
	},
	OpenData:{
		GOR:'GameOverRank',
		FUR:'UIFriendRank',
		GUR:'GroupRank',
		SPR:'SurPassRank',
		IFR:'InitFriendRank'
	},
	currentViewDict:{
		
	},
	//历史游戏的最高得分
	curDataInfo:{
		runGameTrack:false,
		runGameType:0,
		allGameFenShu:0,
		maxScore:0,
		prevSq:0,		//最后一次棋子的位置
		prevFSZ:0,
		fenXiangCiShu:0,
		huiHeShu:0,
		gold:0,
		gameAllNum:0		//当前第几局
	},
	clipAllStc:[
		'alyunGameBox',
		'alyunFreshLv',
		'DJSAVConfig',
		'alyunFreshLvStep',
		'heBingLogics'
	],
	alyunGameBox:{
		locker:[],
		InnerChain:null
	},
	alyunGameCF:{
		refreshBanner:0,		//0 关闭	1打开
		minShareTime:2.8,
		gameModel:'crazy',
		shareSuccessWeight:[1,1,1,1,1],
		shareADLevel:2000,
		DJShare:0.5,
		DJAV:0.5,
		NoDeadTotal:0,//防死持续步数
		NoDeadRate:0.5,
		DJFreshEnableRate:0,//刷出有用数值的概率
		NumRateJuNum:15,
		fenXiangCallFuncType:1		//0 关闭 自定义分享 1打开自定义分享
	},
	//设置数字概率生成方式
	alyunFreshLv:{
		 "40": {
            "2": 0.20224719101123595,
            "4": 0.21348314606741572,
            "8": 0.2247191011235955,
            "16": 0.24719101123595505,
            "32": 0.11235955056179775,
            "64": 0,
            "128": 0
        },
        "50": {
            "2": 0.1925133689839572,
            "4": 0.20320855614973263,
            "8": 0.21390374331550802,
            "16": 0.23529411764705882,
            "32": 0.10695187165775401,
            "64": 0.0481283422459893,
            "128": 0
        },
        "60": {
            "2": 0.18556701030927836,
            "4": 0.1958762886597938,
            "8": 0.20618556701030927,
            "16": 0.2268041237113402,
            "32": 0.10309278350515463,
            "64": 0.04639175257731959,
            "128": 0.030927835051546393,
            "256": 0.005154639175257732
        },
        "default": {
            "2": 0.18274111675126903,
            "4": 0.19289340101522842,
            "8": 0.20304568527918782,
            "16": 0.2233502538071066,
            "32": 0.10152284263959391,
            "64": 0.04568527918781726,
            "128": 0.030456852791878174,
            "256": 0.01015228426395939,
            "512": 0.005076142131979695,
            "1024": 0.005076142131979695
        }
    },
	alyunFreshLvStep:{
         "40": {
            "2": 0.20224719101123595,
            "4": 0.21348314606741572,
            "8": 0.2247191011235955,
            "16": 0.24719101123595505,
            "32": 0.11235955056179775,
            "64": 0,
            "128": 0
        },
        "50": {
            "2": 0.1925133689839572,
            "4": 0.20320855614973263,
            "8": 0.21390374331550802,
            "16": 0.23529411764705882,
            "32": 0.10695187165775401,
            "64": 0.0481283422459893,
            "128": 0
        },
        "60": {
            "2": 0.18556701030927836,
            "4": 0.1958762886597938,
            "8": 0.20618556701030927,
            "16": 0.2268041237113402,
            "32": 0.10309278350515463,
            "64": 0.04639175257731959,
            "128": 0.030927835051546393,
            "256": 0.005154639175257732
        },
        "default": {
            "2": 0.18274111675126903,
            "4": 0.19289340101522842,
            "8": 0.20304568527918782,
            "16": 0.2233502538071066,
            "32": 0.10152284263959391,
            "64": 0.04568527918781726,
            "128": 0.030456852791878174,
            "256": 0.01015228426395939,
            "512": 0.005076142131979695,
            "1024": 0.005076142131979695
        }
    },
	//数字更新时间
	actionTimeBuilds:{
		trackMv:2,			//引导动画时间
		heBingMv:0.2,		//被吃掉的子移动时间
		heBingSameMv:0,		//同类子移动延迟单元
		heBingOtherMv:0.05,	//不同类子被吃间隔时间
		heBingSBMv:0.1,			//数字变大的时间这个值需要x2
		freshShuZiT:0.3,		//刷新数字的时间
		scaleSbaT:0.3,		//宝箱弹出效果时间
		swarpJiShu:2,				//数字roll的单元
		swarpShuZiT:0.2,			//数字刷新时长
		scoreFlyT:0.5,			//数字飞的时间总时长 scoreFlyT * 2.5
		kaiShiMv:0.3,		//开始界面的效果
		zanTingMv:0.3		//暂停游戏界面的时间
	},
	//数字颜色设置
	scoreFlyColors: {
        2: '#f6f2e8',
        4: '#30c900',
        8: '#eb6f00',
        16: '#ee5351',
        32: '#eeca07',
        64: '#079fcb',
        128: '#005cad',
        256: '#a64efb',
        512: '#c021ff',
        1024: '#05deac',
		2048: '#f3eee4'
    },
	//声音下标参数
	//游戏中音效参数不可改变
	VoiceEnabled:true,
	VoiceConfig:{
		VoiceBackGround:0,
		VoiceBtn:1,
		VoiceFollow:2,
		VoiceMerge1:3,
		VoiceMerge2:4,
		VoiceMerge3:5,
		VoiceMerge4:6,
		VoiceMerge5:7,
		VoiceMerge6:8,
		VoiceCLight:9
	},
	//道具概率参数
	GDJBoxs:{
		boxDic:{
			DJFresh:0,
			DJHammer:0,
			DJBomb:0,
			DJRelive:0
		},
		expDic:{
			DJFresh:0,
			DJHammer:0,
			DJBomb:0,
			DJRelive:0
		}
	},
	alyunDJConfig:{	//道具自定义参数
		heBingLogics:{	//合并数字出现刷新或者其他概率
			3:{
				2:{
					DJFresh:0,
					DJSAB:0
				},
				3:{
					DJFresh:0,
					DJSAB:0
				},
				4:{
					DJFresh:0.5,
					DJSAB:0
				},
				5:{
					DJFresh:1,
					DJSAB:0
				}
			},
			default:{
				2:{
					DJFresh:0,
					DJSAB:0
				},
				3:{
					DJSAB:0.1,
					DJFresh:0
				},
				4:{
					DJFresh:0.4,
					DJSAB:0.3
				},
				5:{
					DJFresh:0,
					DJSAB:1
				}
			}
		},
		PropUnLock:{	//道具解锁盘数
			DJFresh:1,
			DJHammer:20,
			DJSAB:1,
			DJBomb:1,
			PropAD:1,		//分享广告解锁盘数
			DJAV:1,
			DJShare:1,
			DJRelive:1000,
			DJBattle:1000,
			PropInner:2,
			PropInnerRate:4,
			PropLocker:2,
			SaveGame:0,
			StartMenu:1
		},
		DJReliveRate:{
			3:1,
			default:1
		},
		SABOpenRate:{		//打开宝箱获取道具的概率
			DJFresh:1,
			DJHammer:0,
			DJBomb:0
		},
		DJConfig:{
			//刷新概率参数设置
			DJFresh:{
				boxDic:20,
				expDic:-1,
			},
			//锤子概率参数设置
			DJHammer:{
				30:{
					boxDic:1,
					expDic:1
				},
				default:{
					boxDic:3,
					expDic:3
				}
			},
			//炸弹概率参数设置
			DJBomb:{
				30:{
					boxDic:1,
					expDic:1
				},
				default:{
					boxDic:3,
					expDic:3
				}
			},
			//复活概率参数设置
			DJRelive:{
				30:{
					boxDic:1,
					expDic:1
				},
				default:{
					boxDic:2,
					expDic:2
				}
			}
		},
		//不同的模式对应的概率不同 可以动态配置
		DJSAVConfig:{
			crazy:{
				3:{
					DJHammer:{
						DJShare:1,
						DJAV:0
					},
					DJBomb:{
						DJShare:1,
						DJAV:0
					},
					DJSAB:{
						DJShare:1,
						DJAV:0
					},
					DJRelive:{
						DJShare:1,
						DJAV:0
					},
					DJBattle:{
						DJShare:1,
						DJAV:0
					}
				},
				30:{
					DJHammer:{
						DJShare:1,
						DJAV:0
					},
					DJBomb:{
						DJShare:1,
						DJAV:0
					},
					DJSAB:{
						DJShare:1,
						DJAV:0
					},
					DJRelive:{
						DJShare:1,
						DJAV:0
					},
					DJBattle:{
						DJShare:1,
						DJAV:0
					}
				},
				'default':{
					DJHammer:{
						DJShare:1,
						DJAV:0
					},
					DJBomb:{
						DJShare:1,
						DJAV:0
					},
					DJSAB:{
						DJShare:1,
						DJAV:0
					},
					DJRelive:{
						DJShare:1,
						DJAV:0
					},
					DJBattle:{
						DJShare:1,
						DJAV:0
					}
				}
			},
			normal:{
				4:{
					DJHammer:{
						DJShare:0,
						DJAV:1
					},
					DJBomb:{
						DJShare:0,
						DJAV:1
					},
					DJSAB:{
						DJShare:0,
						DJAV:1
					},
					DJRelive:{
						DJShare:0,
						DJAV:1
					},
					DJBattle:{
						DJShare:0,
						DJAV:1
					}
				},
				31:{
					DJHammer:{
						DJShare:0,
						DJAV:1
					},
					DJBomb:{
						DJShare:0,
						DJAV:1
					},
					DJSAB:{
						DJShare:0,
						DJAV:1
					},
					DJRelive:{
						DJShare:0,
						DJAV:1
					},
					DJBattle:{
						DJShare:0,
						DJAV:1
					}
				},
				'default':{
					DJHammer:{
						DJShare:0.7,
						DJAV:0.3
					},
					DJBomb:{
						DJShare:0.7,
						DJAV:0.3
					},
					DJSAB:{
						DJShare:0.7,
						DJAV:0.3
					},
					DJRelive:{
						DJShare:1,
						DJAV:0
					},
					DJBattle:{
						DJShare:0.7,
						DJAV:0.3
					}
				}
			}
		}
	},
	alyunFenXiangImgs:["res/raw-assets/ec/ec930766-ae2c-4069-86c1-c8c67ce4aa96.png"],
	alyunFenXiangMsg:["你介意男生玩这个游戏吗?"],
	//游戏数字存储矩阵
	numMap:[
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0
	],
	numNodeMap:[
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0,
		0,	0,	0,	0,	0,	0,	0,	0
	],
	//移动的轨迹
	moveStep:[[0,-1],[1,0],[0,1],[-1,0]],
	RANK_TOP:2,
	FILE_LEFT:2,
	// 获得格子的横坐标
	RANK_Y:function(sq) {
		return sq >> 3;
	},
	// 获得格子的纵坐标
	FILE_X:function(sq) {
		return sq & 7;
	},
	//根据x,y坐标获取真实的地址下标
	COORD_XY:function(x,y) {
		return x + (y << 3);
	},
	ConvertToMapSpace:function(id){
		var x = (id & 3) + 2;
		var y = (id >> 2) + 2;
		var sq = x + (y << 3);
		return sq;
	},
	ConvertToMapId:function(sq){
		var x = (sq & 7) - 2;
		var y = (sq >> 3) - 2;
		var id = x + (y << 2);
		return id;
	},
};