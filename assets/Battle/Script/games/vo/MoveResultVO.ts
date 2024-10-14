export default class MoveResultVO {

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

}
