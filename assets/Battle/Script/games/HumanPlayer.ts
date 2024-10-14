import Player from "./Player";
import SitDownDTO from "./dto/SitDownDTO";
import FireKit from "./fire/FireKit";
import Config from "./Config";
import GameEvent from "./GameEvent";
import StartGameDTO from "./dto/StartGameDTO";
import StartGameVO from "./vo/StartGameVO";
import SitDownVO from "./vo/SitDownVO";
import OperationNotifyDTO from "./dto/OperationNotifyDTO";
import OpenResultDTO from "./dto/OpenResultDTO";
import OpenResultVO from "./vo/OpenResultVO";
import OperationNotifyVO from "./vo/OperationNotifyVO";
import MoveResultDTO from "./dto/MoveResultDTO";
import MoveResultVO from "./vo/MoveResultVO";
import EndGameDTO from "./dto/EndGameDTO";
import EndGameVO from "./vo/EndGameVO";
import ConfirmColorDTO from "./dto/ConfirmColorDTO";
import ConfirmColorVO from "./vo/ConfirmColorVO";

/**
 * 人类玩家
 */
export default class HumanPlayer extends Player {

    constructor(userId: number, name: string) {
        super(userId, name);
        this.ai = false;
    }

    /**
     * 发送坐下事件
     * @param sitDownDTO
     */
    protected onSitDown(sitDownDTO: SitDownDTO) {
        FireKit.use(Config.HUMAN_FIRE).emit(GameEvent.SIT_DOWN, <SitDownVO>sitDownDTO);
    }

    /**
     * 发送开始游戏事件
     * @param startGameDTO
     */
    protected onStartGame(startGameDTO: StartGameDTO) {
        FireKit.use(Config.HUMAN_FIRE).emit(GameEvent.START_GAME, <StartGameVO>startGameDTO);
    }

    /**
     * 显示牌
     * @param openResultDTO
     */
    protected onOpenResult(openResultDTO: OpenResultDTO) {
        FireKit.use(Config.HUMAN_FIRE).emit(GameEvent.OPEN_RESULT, <OpenResultVO>openResultDTO);
    }

    /**
     * 确认颜色
     * @param confirmColorDTO
     */
    protected onConfirmColor(confirmColorDTO: ConfirmColorDTO) {
        FireKit.use(Config.HUMAN_FIRE).emit(GameEvent.CONFIRM_COLOR, <ConfirmColorVO>confirmColorDTO);
    }

    /**
     * 操作通知
     * @param operationNotifyDTO
     */
    protected onOperationNotify(operationNotifyDTO: OperationNotifyDTO) {
        FireKit.use(Config.HUMAN_FIRE).emit(GameEvent.OPERATION_NOTIFY, <OperationNotifyVO>operationNotifyDTO);
    }

    /**
     * 移动结果
     * @param moveResultDTO
     */
    protected onMoveResult(moveResultDTO: MoveResultDTO) {
        FireKit.use(Config.HUMAN_FIRE).emit(GameEvent.MOVE_RESULT, <MoveResultVO>moveResultDTO);
    }

    /**
     * 结束游戏
     * @param endGameDTO
     */
    protected onEndGame(endGameDTO: EndGameDTO) {
        FireKit.use(Config.HUMAN_FIRE).emit(GameEvent.END_GAME, <EndGameVO>endGameDTO);
    }

}
