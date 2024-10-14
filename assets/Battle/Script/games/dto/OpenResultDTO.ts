/**
 * 显示牌
 */
export default class OpenResultDTO {
    /**
     * 操作的人
     */
    chair: number;
    /**
     * 牌的位置
     */
    index: number;
    /**
     * 牌
     */
    card: number;


    constructor(chair: number, index: number, card: number) {
        this.chair = chair;
        this.index = index;
        this.card = card;
    }
}
