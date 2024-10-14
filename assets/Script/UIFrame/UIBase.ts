import { Component, _decorator } from 'cc';
import { FormType } from '../Config/SysDefine';
import { UIManager } from './UIMgr';
const { ccclass, property } = _decorator;


export class UIBase extends Component {
    //窗体id 该窗体的唯一标识，请不要对这个值复制
    public fid!: string;

    public formType: FormType = FormType.FormType_Screen;

    public willDestory = false;

    private inited: boolean = false;

    public static prefabPath = "";


    public view!: Component;

    //保存参数
    public params: any;

    public async load(): Promise<string> {
        return new Promise<string>((resolve, reject) => {

        });
    }

    public onInit() {

    }
    //界面参数从这里获取
    public onShow(...params: any) {
        this.params = params;
    }

    //界面重新被激活 也就是重新active
    public reShow() {

    }

    //隐藏的时候执行一些清理操作 并没有真正关闭界面
    public onHide() {

    }

    public async closeSelf(): Promise<boolean> {
        return await UIManager.getInstance().closeForm(this.fid);
    }

    public async showEffect(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            resolve(true);
        });
    }

    public async hideEffect(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            resolve(true);
        });
    }

    public getShowEffectTime(): number {
        return 0.5;
    }

    public getHideEffectTime(): number {
        return 0.3;
    }

}
