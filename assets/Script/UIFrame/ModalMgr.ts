//Email puhalskijsemen@gmail.com
//Open VPN global mode on the source code website http://web3incubators.com/
//Telegram https://t.me/gamecode999
//Web Customer Service http://web3incubators.com/kefu.html


import { BlockInputEvents, Component, Tween, Node, tween, UIOpacity, UITransform, _decorator } from "cc";
import { FormType, ModalOpacity } from "../Config/SysDefine";
import { UIBase } from "./UIBase";
import { UIWindow } from "./UIFrom";
import { UIManager } from "./UIMgr";
// import { UIManager } from "./UIManager";

const { ccclass, property } = _decorator;

@ccclass("ModalMgr")
export class ModalMgr {

    //private uiModal!:UIModalScript;
    private maskNode!: Node;
    private nPopUp!: Node
    //public static popUpRoot = SysDefine.SYS_UIROOT_NAME + '/' + SysDefine.SYS_POPUP_NODE;
    public static instance: ModalMgr;
    public static getInstance() {
        if (this.instance == null) {
            this.instance = new ModalMgr();
        }
        return this.instance;
    }




    public initMaskNode(maskNode: Node) {
        this.maskNode = maskNode;
        this.nPopUp = maskNode.parent!;
        this.maskNode.active = false;
        this.maskNode.getComponent(UIOpacity)!.opacity = 0;
    }

    /** 为mask添加颜色 */
    // private async showModal(maskType: ModalType) {
    //     await this.uiModal.showModal(maskType.opacity, maskType.easingTime, maskType.isEasing);
    // }

    /**
     * coms 是窗体
     * maskArr 是屏蔽层的数据
     * @param coms 
     * @param maskArr 
     * @param isOpen 
     */
    public checkModalWinAndPopUp(coms: UIBase[], maskArr: { [key: string]: Node }, isOpen: boolean = true) {
        //保证永远只显示一个遮罩 显示
        let hasShow: boolean = false;
        console.log("检查屏蔽层的这招显示");
        console.log(coms);

        console.log(maskArr);
        for (const key in maskArr) {
            if (Object.prototype.hasOwnProperty.call(maskArr, key)) {
                const element = maskArr[key]
            }
        }
        console.log("检查屏蔽层的这招显示");
        for (let idx = coms.length - 1; idx >= 0; idx--) {
            let com = coms[idx];

            let tcom: UIWindow | null = null;
            if (com.formType == FormType.FormType_Win) {
                tcom = com as UIWindow;
            }
            if (tcom != null) {
                let maskKey = tcom.fid;
                if (maskArr[maskKey]) {
                    if (tcom.modalType.opacity >= ModalOpacity.OpacityZero && !hasShow) {
                        maskArr[maskKey].active = true;

                        if (isOpen) {
                            maskArr[maskKey].getComponent(UIOpacity)!.opacity = 0;
                            let opac = this.getOpacityByMask(tcom.modalType.opacity);
                            Tween.stopAllByTarget(maskArr[maskKey]);
                            let t = tcom.getShowEffectTime();

                            tween<UIOpacity>(maskArr[maskKey].getComponent(UIOpacity))
                                .to(t, { opacity: opac }, { easing: 'linear' })
                                // 当前面的动作都执行完毕后才会调用这个回调函数
                                .call(() => {
                                    if (tcom!.modalType?.clickMaskClose) {
                                        maskArr[maskKey].off(Node.EventType.TOUCH_START);
                                        maskArr[maskKey].on(Node.EventType.TOUCH_START, () => {
                                            UIManager.getInstance().closeForm(tcom!.fid);
                                        });

                                        if (tcom.getComponent(BlockInputEvents) == null) {
                                            tcom.addComponent(BlockInputEvents);
                                        }
                                    }
                                })
                                .start()
                        } else {
                            let opac = this.getOpacityByMask(tcom.modalType.opacity);
                            maskArr[maskKey].getComponent(UIOpacity).opacity = opac;
                        }
                        hasShow = true;
                    } else {
                        let t = com.getHideEffectTime();
                        tween<UIOpacity>(maskArr[maskKey].getComponent(UIOpacity)!).to(t, { opacity: 0 }, { easing: 'linear' }).call(() => {
                        }).start();
                    }
                }
            }
        }
    }



    //判断有多少个wins 是否需要屏蔽层
    public checkModalWindow(coms: UIWindow[]) {
        for (let i = coms.length - 1; i >= 0; i--) {
            if (coms[i].modalType.opacity > 0) {
                let uimask = coms[i].node.getChildByName("UIMask")!
                uimask.active = true;
                let opac = uimask.getComponent(UIOpacity)!.opacity;
                uimask.getComponent(UIOpacity)!.opacity = 0;
                tween(uimask.getComponent(UIOpacity)).to(0.5, { opacity: opac }, { easing: "linear" }).start();
            } else {
                let uimask = coms[i].node.getChildByName("UIMask")!
                if (uimask.active) {
                    tween(uimask.getComponent(UIOpacity)).to(0.5, { opacity: 0 }, { easing: "linear" }).call(() => {
                        uimask.active = false;
                    }).start();
                }
            }
        }
    }


    private getOpacityByMask(maskOpacity: ModalOpacity) {
        let tOp = 0;
        if (maskOpacity == ModalOpacity.OpacityZero) {
            tOp = 1;
        } else if (maskOpacity == ModalOpacity.OpacityLow) {
            tOp = 60;
        } else if (maskOpacity == ModalOpacity.OpacityHalf) {
            tOp = 125;
        } else if (maskOpacity == ModalOpacity.OpacityHigh) {
            tOp = 200;
        } else if (maskOpacity == ModalOpacity.OpacityFull) {
            tOp = 255;
        }
        return tOp;
    }


}