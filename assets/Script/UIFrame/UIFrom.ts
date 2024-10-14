
import { tween, Tween, Vec3 } from "cc";
import { FormType } from "../Config/SysDefine";
import { ModalType } from "./Struct";
import { UIBase } from "./UIBase";
//Email puhalskijsemen@gmail.com
//Open VPN global mode on the source code website http://web3incubators.com/
//Telegram https://t.me/gamecode999
//Web Customer Service http://web3incubators.com/kefu.html


export class UILoading extends UIBase {
    formType = FormType.FormType_Loading;

    public async showEffect(): Promise<boolean> {
        return true;
    }

    public async hideEffect(): Promise<boolean> {
        return true;
    }

    public onShow(...params: any): void {
        super.onShow(...params);
    }

    public onHide(): void {
        super.onHide();
    }
}

export class UIScreen extends UIBase {
    formType = FormType.FormType_Screen;
    willDestory = true;
    //是否独占。如果UIScreen设置该属性，则打开该窗体，其他screen都会被关闭，否则不关闭
    public isEngross: boolean = false;
    public params: any;

    public isOnleyEngross: boolean = false;


    //覆盖父类方法全屏不展示出现效果
    public async showEffect(): Promise<boolean> {
        return true;
    }

    public async hideEffect(): Promise<boolean> {
        return true;
    }

    public onShow(...params: any): void {
        super.onShow(...params);
    }

    public reShow() {
        super.reShow();
    }

    public onHide(): void {
        super.onHide();
    }
}

export class UIWindow extends UIBase {
    formType = FormType.FormType_Win;
    modalType = new ModalType();
    priority = 0;


    public onShow(...params: any): void {
        super.onShow(...params);
    }

    public onHide(): void {
        super.onHide();
    }

    //打开界面的效果。这里做默认效果。如果个别页面有特殊需求，则各自实现
    public async showEffect(): Promise<boolean> {
        Tween.stopAllByTarget(this.node);
        this.node.setScale(new Vec3(0, 0, 1));
        return new Promise<boolean>((resolve, reject) => {
            tween(this.node)
                .to(0.5, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
                .call(() => {
                    resolve(true);
                })
                .start()
        });
    }

    public async hideEffect(): Promise<boolean> {
        Tween.stopAllByTarget(this.node);
        return new Promise<boolean>((resolve, reject) => {
            tween(this.node)
                .to(0.3, { scale: new Vec3(0, 0, 0) }, { easing: 'backIn' })
                .call(() => {
                    resolve(true);
                })
                .start()
        });
    }

}


