import { LogicEvent, LogicEventData } from "./LogicEvent";


export class BaseLogic {

    public init() {
    }

    public data?: any;
    public async onStartEnter(data: LogicEventData) {
        this.data = data;
    }

    /*
    子游戏返回大厅的回调通知
    */
    public onBackHall(data: LogicEventData) {
        //退出游戏的逻辑
    }

    //获取relist列表 加载对应游戏的资源
    public startLoadGame() {

    }

    //资源加载完成
    protected onLoadResourceComplete(err: any) {

    }

    //加载进度
    protected onLoadResourceProgress(process: number) {

    }
}