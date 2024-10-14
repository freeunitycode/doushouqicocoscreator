import { UILobbyMgr } from "../Lobby/UILobbyMgr";
import EventMgr from "../Script/Base/EventMgr";
import { LogicManager } from "../Script/Base/LogicManager";
import { ResMgr, ResType } from "../Script/Base/ResMgr";
import { BaseLogic } from "../Script/Games/BaseLogic";
import { FBGameEventName, LogicEvent, LogicEventData } from "../Script/Games/LogicEvent";
import { reslist } from "./reslist";
import { UIBattleMgr } from "./UIBattleMgr";

export class BattleLogic extends BaseLogic {
    public init(): void {
        EventMgr.Instance.addEventListen(LogicEvent.ENTER_FBGAME, this.onStartEnter.bind(this), this);
        EventMgr.Instance.addEventListen(LogicEvent.ENTER_HALL_FROM_GAMES, this.onBackHall.bind(this), this);
    }

    //从子游戏返回到大厅了
    public onBackHall(data: LogicEventData) {
        super.onBackHall(data);
        console.log("返回大厅，需要释放资源");
        setTimeout(() => {
            //清除消息注册
            // FBGameNet.destory();

            //释放对应bundle中的资源 如果是从
            ResMgr.getInstance().releaseAllResByList(reslist);
        });
    }

    async onStartEnter(data: LogicEventData): Promise<void> {
        await super.onStartEnter(data);
        // FBGameNet.getInstance().register();
        this.startLoadGame();
    }

    /**
     * @description: 开始加载游戏资源
     */
    async startLoadGame() {
        let list = reslist;
        await UILobbyMgr.Instance().clearWaiting();
        await UIBattleMgr.Instance().showLoading();
        let resType: Map<ResType, boolean> = new Map();
        resType.set(ResType.ResType_Prefab, true);
        resType.set(ResType.ResType_SpriteAtlas, true);
        resType.set(ResType.ResType_AudioClip, true);
        resType.set(ResType.ResType_SpriteFrame, true);

        ResMgr.getInstance().preLoad(list, this.onLoadResourceProgress.bind(this), this.onLoadResourceComplete.bind(this), resType);
    }

    //加载资源进度
    protected onLoadResourceProgress(process: number) {
        console.log("游戏资源进度", process, "=====");
        EventMgr.Instance.emit(FBGameEventName.GAME_LOAD_PROGRESS, process);
    }

    //加载资源完成
    protected onLoadResourceComplete(err: any) {
        EventMgr.Instance.emit(FBGameEventName.GAME_LOAD_COMPLETE);
        UILobbyMgr.Instance().clearWaiting();
        UIBattleMgr.Instance().showFBGame();
    }
}
LogicManager.Instance().registerLogicTypes(BattleLogic);