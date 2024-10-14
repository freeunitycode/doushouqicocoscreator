import { ModalOpacity } from "../Config/SysDefine";
//Email puhalskijsemen@gmail.com
//Open VPN global mode on the source code website http://web3incubators.com/
//Telegram https://t.me/gamecode999
//Web Customer Service http://web3incubators.com/kefu.html


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