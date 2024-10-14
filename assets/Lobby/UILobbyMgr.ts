import Singleton from "../Script/Base/Sigleton";
import { UIManager } from "../Script/UIFrame/UIMgr";

export class UILobbyMgr extends Singleton {

    public static Instance() {
        return super.getInstance<UILobbyMgr>()
    }

    /**
     * 打开大厅界面
     */
    public async showScreenLobby() {
        return await UIManager.getInstance().openScreen("Lobby/Prefabs/UILobby");
    }

    /**
     * 显示waiting
     */
    public async showWaiting() {
        return await UIManager.getInstance().openWin("Lobby/Prefabs/UIWaiting");
    }

    public async clearWaiting() {
        return await UIManager.getInstance().closeForm("Lobby/Prefabs/UIWaiting");
    }
}