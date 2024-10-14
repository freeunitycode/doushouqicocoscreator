import { ModalOpacity } from "../Config/SysDefine";

export class ModalType {
    public opacity: ModalOpacity = ModalOpacity.OpacityHalf;
    //是否点击遮罩部分关闭
    public clickMaskClose = false;
    //缓动实现
    public isEasing = true;
    //缓动时间
    public easingTime = 0.5;

    constructor(opacity = ModalOpacity.OpacityHigh, clickMaskClose = false, isEasing = true, easingTime = 0.2) {
        this.opacity = opacity;
        this.clickMaskClose = clickMaskClose;
        this.isEasing = isEasing;
        this.easingTime = easingTime;
    }
}