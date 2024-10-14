import { director, instantiate, js, NodePool, Node, Size, Tween, tween, view, warn, Widget, UITransform, UIOpacity } from "cc";
import { ResMgr } from "../Base/ResMgr";
import { FormType, ModalOpacity } from "../Config/SysDefine";
import { PriorityStake } from "../Utils/PriorityStake";
import { ModalMgr } from "./ModalMgr";

// import { ModalMgr } from "./ModalMgr";
import { UIBase } from "./UIBase";
import { UILoading, UIScreen, UIWindow } from "./UIFrom";

export class UIManager {
    //全屏显示的ui挂载节点
    private ndScreen: Node | null = null;
    //能够拦截float的win
    private ndWin: Node | null = null;

    //所有显示的窗体
    private allForms: { [key: string]: UIBase } = js.createMap();
    //存储screen
    private screensStack: PriorityStake<UIScreen> = new PriorityStake<UIScreen>();
    private loadingForms: { [key: string]: boolean } = js.createMap();
    private winArr: UIWindow[] = [];

    //win类型的masks
    private winMasks: { [key: string]: Node } = js.createMap();
    //screen类型的masks
    private screenMasks: { [key: string]: Node } = js.createMap();


    private static instance: UIManager;
    public static getInstance(): UIManager {
        if (this.instance == null) {
            this.instance = new UIManager();
            director.on("winsizechanged", this.instance.onWinSizeChged, this.instance);
        }
        return this.instance;
    }

    onWinSizeChged() {

        let uiscreens = this.screensStack.getElements();
        for (let k = 0; k < uiscreens.length; k++) {
            console.log("窗口变化，要重新刷新一下======");
            uiscreens[k].node.getComponent(Widget)!.updateAlignment();
        }
    }

    //初始化
    public init(ndScreen: Node,
        ndWin: Node): void {
        this.ndScreen = ndScreen;
        this.ndWin = ndWin;
    }

    //判断一个界面是否正在显示
    public checkFormShowing(prefabPath: string): boolean {
        let com = this.allForms[prefabPath];
        if (!com) {
            return false;
        }
        return com.node.active;
    }
    public checkFormLoading(prefabPath: string) {
        let com = this.loadingForms[prefabPath];
        return !!com;
    }

    private waitNodePool: NodePool = new NodePool();
    private maskNodePool: NodePool = new NodePool();
    private getMaskNode() {
        if (this.maskNodePool.size() > 0) {
            return this.maskNodePool.get();
        }
        return null
    }

    //打开一个screen
    public async openScreen(prefabPath: string, ...params: any): Promise<UIScreen | null> {
        console.log(`打开openScene--${prefabPath}`);
        if (prefabPath == null || prefabPath == undefined || prefabPath.length <= 0) {
            warn(`${prefabPath}，参数错误`);
            return null;
        }
        //当前窗体正在显示
        if (this.checkFormShowing(prefabPath)) {
            warn(`${prefabPath}窗体正在显示中`);
            return null;
        }
        if (this.checkFormLoading(prefabPath)) {
            warn(`${prefabPath}正在加载中`);
            return null;
        }
        this.loadingForms[prefabPath] = true;
        let pb = ResMgr.getInstance().getPrefabByPath(prefabPath);

        if (pb == null) {
            console.error("兼容模式 需要 去健在窗体")
            // pb = await ResMgr.getInstance().loadForm(prefabPath)!;
        }

        if (pb == null) {
            warn(`${prefabPath}窗体加载错误!`);
            delete this.loadingForms[prefabPath];
            return null;
        }
        let node = instantiate(pb!);
        let com = node.getComponent(UIScreen);
        if (com == null) {
            warn(`${prefabPath}没有绑定UIScreen组件`);
            delete this.loadingForms[prefabPath];
            return null;
        }

        if (com.isOnleyEngross) {
            //关闭掉所有的screen
            console.log("关闭所有的screeen", this.screensStack.getSize(), "==========");
            while (this.screensStack.getSize() > 0) {
                await this.screensStack.getTopElement()!.closeSelf();
            }
        } else if (com.isEngross) {
            while (this.screensStack.getSize() > 0) {
                await this.screensStack.getTopElement()!.closeSelf();
            }
        }

        //给screen增加屏蔽层
        console.log("需要加屏蔽层========");
        let maskNode = this.getMaskNode();
        if (maskNode == null) {
            let mask = ResMgr.getInstance().getPrefabByPath("Lobby/Prefabs/UIMask");
            if (mask != null) {
                maskNode = instantiate(mask!);
            }
        }
        if (maskNode != null) {
            //在首次加载的时候会有问题。这个地方需要优化一下
            this.ndScreen!.addChild(maskNode!);
            maskNode.getComponent(UITransform).setContentSize(new Size(screen.width, screen.height))
            this.screenMasks[prefabPath] = maskNode!;
        }

        this.allForms[prefabPath] = com;
        com.fid = prefabPath;
        this.ndScreen!.addChild(node);

        com.onShow(...params);
        await com.showEffect();
        if (!com.isEngross) {
            //不独占 将其他screen active 设置为false
            let all = this.screensStack.getElements();
            for (let k = 0; k < all.length; k++) {
                all[k].node.active = false;
            }
        }
        //将对象保存到stack中
        this.screensStack.push(com);
        console.log('保存场景的堆栈数量 : !!!!!!' + this.screensStack.getSize());
        delete this.loadingForms[prefabPath]
        return com
    }

    //打开一个窗口
    public async openWin(prefabPath: string, ...params: any): Promise<UIWindow | null> {
        console.log(`打开openWin--${prefabPath}`);
        if (prefabPath == null || prefabPath == undefined || prefabPath.length <= 0) {
            warn(`${prefabPath}Win节点不存在`);
            return null;
        }
        if (this.checkFormShowing(prefabPath)) {
            warn(`${prefabPath}win节点正在显示中`);
            return null;
        }
        if (this.checkFormLoading(prefabPath)) {
            warn(`${prefabPath}win节点正在打开...`)
            return null;
        }
        this.loadingForms[prefabPath] = true;
        let pb = ResMgr.getInstance().getPrefabByPath(prefabPath);
        //await this.waitFormsecond();
        //兼容一下，暂时这么写。捕鱼的结构需要调整一下  这里要干掉否则 隐藏bug
        if (pb == null) {
            console.error(`${prefabPath}不存在使用了兼容模式`);
            pb = await ResMgr.getInstance().loadForm(prefabPath);
        }
        if (pb == null) {
            console.error(`${prefabPath}win节点加载失败`);
            //如果加载失败了，则需要将节点从
            delete this.loadingForms[prefabPath];
            return null;
        }
        let node = instantiate(pb);
        let com = node.getComponent(UIWindow);
        if (com == null) {
            warn(`${prefabPath}win加载没有绑定到UIWindow组件上`);
            delete this.loadingForms[prefabPath];
            return null;
        }
        if (com.modalType.opacity >= ModalOpacity.OpacityZero) {
            console.log("开始获取屏蔽层的东西");
            let maskNode = this.getMaskNode();
            if (maskNode == null) {
                //有屏蔽层
                let mask = ResMgr.getInstance().getPrefabByPath("Lobby/Prefabs/UIMask");
                maskNode = instantiate(mask!);
            }
            this.ndWin!.addChild(maskNode);
            maskNode.getComponent(UITransform).setContentSize(new Size(view.getFrameSize().width, view.getFrameSize().height));
            this.winMasks[prefabPath] = maskNode;
        }
        com.fid = prefabPath;
        this.ndWin!.addChild(node);
        this.winArr.push(com);
        this.allForms[prefabPath] = com;
        com.onShow(...params);
        if (com.modalType.opacity >= ModalOpacity.OpacityZero) {
            let arr: UIBase[] = this.getModelTypeComs();
            ModalMgr.getInstance().checkModalWinAndPopUp(arr, this.winMasks, true);
        }
        delete this.loadingForms[prefabPath];
        com.showEffect();

        return com;
    }

    //动态计算需要遮罩的win和popups
    //对于popup来说，层级越高，越在上
    public getModelTypeComs(): UIBase[] {
        let arr: UIBase[] = [];
        for (let k = 0; k < this.winArr.length; k++) {
            arr.push(this.winArr[k]);
        }
        return arr;
    }

    /**
     * 关闭一个UIForm
     * @prefabPath
     */
    public async closeForm(prefabPath: string): Promise<boolean> {
        console.log("closeForm关闭", prefabPath);
        if (!prefabPath || prefabPath.length <= 0) {
            warn(`${prefabPath}`, "参数错误");
            return false;
        }
        let path = prefabPath.split("_")[0];
        let com = this.allForms[prefabPath];
        if (!com && path.length == prefabPath.length) {
            console.log("closeForm中的com不存在");
            return false;
        }
        // if(com == null && path.length != prefabPath.length){
        //     for(let i = 0;i<this.bubbleMap.get(path).length;i++){
        //         if(this.bubbleMap.get(path)[i].fid == prefabPath){
        //             com = this.bubbleMap.get(path)[i];
        //             break;
        //         }
        //     }
        // }
        if (!com) {
            console.log("closeForm中的com不存在");
            return false;
        }
        switch (com.formType) {
            case FormType.FormType_Screen:
                await this.exitToScreen(prefabPath);
                break;
            case FormType.FormType_Fixed:
                // await this.exitToFixed(prefabPath);
                break;
            case FormType.FormType_Popup:
                // await this.exitToPopup(prefabPath);
                break;
            case FormType.FormType_Float:
                // await this.exitToFloat(prefabPath);
                break;
            case FormType.FormType_Win:
                await this.exitToWin(prefabPath);
                break;
            case FormType.FormType_Loading:
                // await this.exitToLoading(prefabPath);
                break;
            case FormType.FormType_Bubble:
                // await this.exitToBubble(prefabPath);
                break;
        }
        return true;
    }

    /**
     * screen退出
     * @param prefabPath 
     * @returns 
     */
    private async exitToScreen(prefabPath: string) {
        console.log(`${prefabPath}exitToScreen`);
        let com = this.allForms[prefabPath];
        if (!com) {
            return false;
        }
        //screen的退出必须是按照栈退出
        let tcom = this.screensStack.pop();
        if (tcom != com) {
            warn(`${prefabPath}screen没有按顺序退出`);
            return;
        }
        let nextCom = this.screensStack.getTopElement();
        if (nextCom != null) {
            nextCom.node.active = true;
            //界面重新被激活
            nextCom.reShow();
        }
        com.onHide();
        //如果不是独占 （这里其实不用判断是否是独占，只要判定还有screen就显示出来就可以了）
        await com.hideEffect();
        //节点需要从父节点移除
        com.node.destroy();
        //com.node.removeFromParent();
        ResMgr.getInstance().destoryForm(prefabPath);
        delete this.allForms[prefabPath];
        console.log(prefabPath, "exittoscreen 成功");
        let maskNode = this.screenMasks[prefabPath];
        if (maskNode != null && maskNode != undefined) {
            if (!this.reBackMaskNode(maskNode)) {
                maskNode.destroy();
                ResMgr.getInstance().destoryForm("Lobby/Prefabs/UIMask");
            }
            delete this.screenMasks[prefabPath];
        }
    }

    /**
     * @description:退出窗口 
     * @param {string} prefabPath
     */
    private async exitToWin(prefabPath: string) {
        let com: UIWindow | null = null;
        let tIdx: number = -1;
        if (this.winArr.length > 0) {
            for (let k = 0; k < this.winArr.length; k++) {
                if (this.winArr[k].fid == prefabPath) {
                    tIdx = k;
                    com = this.winArr[k];
                    break;
                }
            }
        }
        if (tIdx >= 0 && tIdx < this.winArr.length) {
            this.winArr.splice(tIdx, 1);
            com!.onHide();
            let maskPath = com!.fid;
            let maskNode = this.winMasks[maskPath];
            if (maskNode) {
                let t = com!.getHideEffectTime();
                //消失要有消失动画
                Tween.stopAllByTarget(maskNode);
                let opacity = maskNode.getComponent(UIOpacity).opacity
                tween<UIOpacity>(maskNode.getComponent(UIOpacity))
                    .to(t, { opacity: 0 }, { easing: 'linear' })
                    // 当前面的动作都执行完毕后才会调用这个回调函数
                    .call(() => {
                        if (!this.reBackMaskNode(maskNode)) {
                            maskNode.destroy();
                            ResMgr.getInstance().destoryForm("Lobby/Prefabs/UIMask");
                        }
                    })
                    .start()
            }
            delete this.winMasks[maskPath];
            let arr: UIBase[] = this.getModelTypeComs();
            ModalMgr.getInstance().checkModalWinAndPopUp(arr, this.winMasks, false);
            await com!.hideEffect();
            com!.node.destroy();
            ResMgr.getInstance().destoryForm(prefabPath);
        }
        delete this.allForms[prefabPath];
    }
    private reBackMaskNode(node: Node): boolean {
        if (this.maskNodePool.size() >= 10) {
            return false;
        }
        this.maskNodePool.put(node);
        return true;
    }

    public static destory() {
        this.instance = null!;
        director.off("winsizechanged")
    }
}