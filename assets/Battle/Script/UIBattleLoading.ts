import { _decorator, Node, Label, ProgressBar } from "cc";
import EventMgr from "../../Script/Base/EventMgr";
import { FBGameEventName } from "../../Script/Games/LogicEvent";
import { UIWindow } from "../../Script/UIFrame/UIFrom";


const { ccclass, property } = _decorator;

@ccclass('UIBattleLoading')
export class UIBattleLoading extends UIWindow {
    @property(Node)
    public progress: Node | null = null;
    @property(Node)
    public lblProTxt: Node | null = null;

    //小车的动画
    @property(Node)
    private duduChe: Node = null;

    onShow(...params: any) {
        EventMgr.Instance.addEventListen(FBGameEventName.GAME_LOAD_COMPLETE, this.onLoadCompeted, this);
        EventMgr.Instance.addEventListen(FBGameEventName.GAME_LOAD_PROGRESS, this.onLoadProgress, this);
    }

    onHide() {
        EventMgr.Instance.unEventListen(FBGameEventName.GAME_LOAD_COMPLETE, this.onLoadCompeted);
        EventMgr.Instance.unEventListen(FBGameEventName.GAME_LOAD_PROGRESS, this.onLoadProgress);
    }

    onLoadProgress(val: number) {
        this.lblProTxt!.getComponent(Label)!.string = `${Math.round(val * 100)}/100`;
        this.progress!.getComponent(ProgressBar)!.progress = val;

        // this.calDuDuChePos();
    }

    calDuDuChePos() {
        let progress = this.progress!.getComponent(ProgressBar)!.progress;
        let len = 578;
        let x = len * progress - len / 2;
        this.duduChe.setPosition(x, -500);
    }

    onLoadCompeted() {
        this.closeSelf();
    }
}
