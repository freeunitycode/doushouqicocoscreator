/**
 * 移动牌
 */
export default class MoveCardDTO {

    /**
     * 如果是联网游戏chair通过服务端获取
     */
    chair: number;
    /**
     * 起点
     */
    fromIndex: number;
    /**
     * 终点
     */
    toIndex: number;

    constructor(chair: number, fromIndex: number, toIndex: number) {
        this.chair = chair;
        this.fromIndex = fromIndex;
        this.toIndex = toIndex;
    }
}
