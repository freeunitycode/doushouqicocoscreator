/**
 * 玩家基类
 */
import SitDownDTO from "./dto/SitDownDTO";
import StartGameDTO from "./dto/StartGameDTO";
import OperationNotifyDTO from "./dto/OperationNotifyDTO";
import MoveResultDTO from "./dto/MoveResultDTO";
import OpenResultDTO from "./dto/OpenResultDTO";
import EndGameDTO from "./dto/EndGameDTO";
import ConfirmColorDTO from "./dto/ConfirmColorDTO";

export default abstract class Player {

    /**
     * 玩家ID
     */
    userId: number;
    /**
     * 是否为AI
     */
    ai: boolean;

    /**
     * 名称
     */
    name: string;

    protected constructor(userId: number, name: string) {
        this.userId = userId;
        this.name = name;
    }

    /**
     * 坐席
     * @param sitDownDTO
     */
    sitDown(sitDownDTO: SitDownDTO) {
        console.log("SitDown:" + JSON.stringify(sitDownDTO));
        this.onSitDown(sitDownDTO);
    }

    /**
     * 开始游戏
     * @param startGameDTO
     */
    startGame(startGameDTO: StartGameDTO) {
        console.log("StartGame:" + JSON.stringify(startGameDTO));
        this.onStartGame(startGameDTO);
    }

    /**
     * 显示牌
     * @param openResultDTO
     */
    openResult(openResultDTO: OpenResultDTO) {
        console.log("OpenResult:" + JSON.stringify(openResultDTO));
        this.onOpenResult(openResultDTO);
    }

    /**
     * 确认颜色
     * @param confirmColorDTO
     */
    confirmColor(confirmColorDTO: ConfirmColorDTO) {
        console.log("ConfirmColor:" + JSON.stringify(confirmColorDTO));
        this.onConfirmColor(confirmColorDTO)
    }

    /**
     * 操作通知
     * @param operationNotifyDTO
     */
    operationNotify(operationNotifyDTO: OperationNotifyDTO) {
        console.log("OperationNotify:" + JSON.stringify(operationNotifyDTO));
        this.onOperationNotify(operationNotifyDTO);
    }

    /**
     * 移动结果
     * @param moveResultDTO
     */
    moveResult(moveResultDTO: MoveResultDTO) {
        console.log("MoveResult:" + JSON.stringify(moveResultDTO));
        this.onMoveResult(moveResultDTO);
    }

    /**
     * 游戏结束
     * @param endGameDTO
     */
    endGame(endGameDTO: EndGameDTO) {
        console.log("EndGame:" + JSON.stringify(endGameDTO));
        this.onEndGame(endGameDTO);
    }

    protected abstract onSitDown(sitDownDTO: SitDownDTO);

    protected abstract onStartGame(startGameDTO: StartGameDTO);

    protected abstract onOpenResult(openResultDTO: OpenResultDTO);

    protected abstract onConfirmColor(confirmColorDTO: ConfirmColorDTO);

    protected abstract onOperationNotify(operationNotifyDTO: OperationNotifyDTO);

    protected abstract onMoveResult(moveResultDTO: MoveResultDTO);

    protected abstract onEndGame(endGameDTO: EndGameDTO);

}
