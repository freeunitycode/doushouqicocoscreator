export default class MoveResultDTO {
    /**
     * 操作的人
     */
    chair: number;
    /**
     *开始位置
     */
    fromIndex: number;
    /**
     * 开始位置的牌
     */
    fromCard: number;
    /**
     *目标位置
     */
    toIndex: number;
    /**
     * 目标位置的牌
     */
    toCard: number;
    /**
     * 结果（-1 失败，0 平局 ，1 胜利）
     */
    result: number;

    constructor(chair: number, fromIndex: number, fromCard: number, toIndex: number, toCard: number, result: number) {
        this.chair = chair;
        this.fromIndex = fromIndex;
        this.fromCard = fromCard;
        this.toIndex = toIndex;
        this.toCard = toCard;
        this.result = result;
    }
}
