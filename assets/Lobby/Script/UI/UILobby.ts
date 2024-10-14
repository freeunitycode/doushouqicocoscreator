import { _decorator, Node } from "cc";
import EventMgr from "../../../Script/Base/EventMgr";
import { ResMgr } from "../../../Script/Base/ResMgr";
import { LogicEvent } from "../../../Script/Games/LogicEvent";
import { UIScreen } from "../../../Script/UIFrame/UIFrom";
const { ccclass, property } = _decorator;

@ccclass('UILobby')
export class UILobby extends UIScreen {
    isEngross = true;

    @property(Node)
    private btnFight: Node = null;

    start() { }

    onLoad(): void {

    }

    async onShow(...params: any) {
        this.init();
        this.eventRegister();
    }

    init() {

    }

    eventRegister() {
        this.btnFight.on(Node.EventType.TOUCH_END, this.clickBtnFight, this);
    }

    async clickBtnFight() {
        //先异步加载ab包
        await ResMgr.getInstance().preloadBundleOnly('Battle');
        EventMgr.Instance.emit(LogicEvent.ENTER_FBGAME);
    }
}