/**
 * 确定颜色
 */
export default class ConfirmColorDTO {

    /**
     * 椅子编号
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
