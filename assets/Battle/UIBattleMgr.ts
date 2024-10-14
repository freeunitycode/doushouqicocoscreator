import Singleton from "../Script/Base/Sigleton";
import { UIManager } from "../Script/UIFrame/UIMgr";

export class UIBattleMgr extends Singleton {

    public static Instance() {
        return super.getInstance<UIBattleMgr>()
    }

    //进入战斗场景
    public async showFBGame() {
        return await UIManager.getInstance().openScreen("Battle/Prefabs/UIBattle");
    }

    //打开loading界面
    public async showLoading() {
        return await UIManager.getInstance().openWin("Battle/Prefabs/UIBattleLoading");
    }
}