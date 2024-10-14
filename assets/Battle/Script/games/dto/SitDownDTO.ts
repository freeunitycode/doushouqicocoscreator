/**
 * 坐下
 */
export default class SitDownDTO {
    /**
     * 玩家ID
     */
    userId: number;
    /**
     * 椅子编号
     */
    chair: number;

    /**
     * 昵称
     */
    name: string;

    constructor(userId: number, chair: number, name: string) {
        this.userId = userId;
        this.chair = chair;
        this.name = name;
    }
}
