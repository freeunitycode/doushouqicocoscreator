/**
 * 游戏结束
 */
export default class EndGameDTO {

    /**
     * 胜利方
     */
    chair: number;
    /**
     * 颜色
     */
    color: number;


    constructor(chair: number, color: number) {
        this.chair = chair;
        this.color = color;
    }
}
