export enum LogicEvent {
    //进入指定场景完成
    ENTER_COMPLETE = "LOGIC_EVENT_ENTER_COMPLETE",
    //进入大厅
    ENTER_HALL = "LOGIC_EVENT_ENTER_HALL",

    //进入游戏
    ENTER_FBGAME = "ENTER_FBGAME",
    //从子游戏返回大厅
    ENTER_HALL_FROM_GAMES = "ENTER_HALL_FROM_GAMES",
}
//Email puhalskijsemen@gmail.com
//Open VPN global mode on the source code website http://web3incubators.com/
//Telegram https://t.me/gamecode999
//Web Customer Service http://web3incubators.com/kefu.html


export enum FBGameEventName {
    GAME_LOAD_COMPLETE = "GAME_LOAD_COMPLETE",                      // 加载完成
    GAME_LOAD_PROGRESS = "GAME_LOAD_PROGRESS",                      // 加载进度
}


export class LogicEventData {
    public data: any;
    constructor(data?: any) {
        this.data = data
    }
}