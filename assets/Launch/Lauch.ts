import { Asset, Component, director, Label, macro, ProgressBar, sp, _decorator } from "cc";
import { reslist } from "../Lobby/reslist";
import { ResMgr, ResType } from "../Script/Base/ResMgr";


/*
 * @Description: 启动界面
 * @Author: Super_Javan
 * @Date: 2022-11-29 12:05:17
 * @LastEditTime: 2022-11-29 15:32:30
 * @LastEditors: Super_Javan
 */
const { ccclass, property } = _decorator;


@ccclass('Launch')
export class Launch extends Component {
    //加载进度条
    @property(ProgressBar)
    public progressBar: ProgressBar | null = null;

    //加载的资源描述
    @property(Label)
    public lblTxt: Label | null = null;

    @property(sp.Skeleton)
    public spinAni: sp.Skeleton = null;
    //热更新对应的节点引用

    @property(Asset)
    manifestUrl: Asset | null = null;

    //byte的进度
    @property(ProgressBar)
    byteProgress: ProgressBar = null!;

    @property(Label)
    info: Label = null;


    //更新提示的弹框内容
    private udpateTips: Node = null;
    start() {
        //禁止多点触摸
        macro.ENABLE_MULTI_TOUCH = false;
        this.progressBar!.progress = 0;
        this.lblTxt!.string = `加载中...0/100`;

        this.startLoad();
    }

    private async startLoad() {
        let list = reslist;
        await ResMgr.getInstance().preloadBundleOnly('Lobby');

        let map: Map<ResType, boolean> = new Map<ResType, boolean>(
            [
                [ResType.ResType_Prefab, true],
                [ResType.ResType_Material, true],
                [ResType.ResType_AudioClip, true],
                [ResType.ResType_SpriteAtlas, true],
                [ResType.ResType_SpriteFrame, true],
            ]
        );
        return await ResMgr.getInstance().preLoad(list, this.updateProgress.bind(this), this.onResLoadComplete.bind(this), map);
    }

    public updateProgress(progress: number) {
        this.progressBar!.progress = progress;
        let progressVal = Math.round(progress * 100);
        if (this.lblTxt != null) {
            this.lblTxt.string = `加载中...${progressVal}/100`;
        }
    }

    //加载完成回调
    public onResLoadComplete() {
        director.loadScene("Main", (err, scene) => {
            if (err != null) {
                console.log(err);
            }
        });
    }
}