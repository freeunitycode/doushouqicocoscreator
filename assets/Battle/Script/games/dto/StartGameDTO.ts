/**
 * 开始游戏
 */
export default class StartGameDTO {
    /**
     * 当前操作的椅子
     */
    chair: number;
    /**
     * 牌
     */
    cards: number[];

    constructor(chair: number, cards: number[]) {
        this.chair = chair;
        this.cards = cards;
    }
}
