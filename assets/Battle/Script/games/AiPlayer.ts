import Player from "./Player";
import SitDownDTO from "./dto/SitDownDTO";
import FireKit from "./fire/FireKit";
import Config from "./Config";
import GameEvent from "./GameEvent";
import StartGameDTO from "./dto/StartGameDTO";
import SitDownVO from "./vo/SitDownVO";
import StartGameVO from "./vo/StartGameVO";
import OperationNotifyDTO from "./dto/OperationNotifyDTO";
import OperationNotifyVO from "./vo/OperationNotifyVO";
import OpenResultDTO from "./dto/OpenResultDTO";
import MoveResultDTO from "./dto/MoveResultDTO";
import OpenResultVO from "./vo/OpenResultVO";
import MoveResultVO from "./vo/MoveResultVO";
import EndGameDTO from "./dto/EndGameDTO";
import EndGameVO from "./vo/EndGameVO";
import ConfirmColorDTO from "./dto/ConfirmColorDTO";
import ConfirmColorVO from "./vo/ConfirmColorVO";

/**
 * AI 玩家
 */
export default class AiPlayer extends Player {

    constructor(userId: number, name: string) {
        super(userId, name);
        this.ai = true;
    }

    protected onSitDown(sitDownDTO: SitDownDTO) {
        FireKit.use(Config.AI_FIRE).emit(GameEvent.SIT_DOWN, <SitDownVO>sitDownDTO);
    }

    protected onStartGame(startGameDTO: StartGameDTO) {
        FireKit.use(Config.AI_FIRE).emit(GameEvent.START_GAME, <StartGameVO>startGameDTO);
    }

    protected onOpenResult(openResultDTO: OpenResultDTO) {
        FireKit.use(Config.AI_FIRE).emit(GameEvent.OPEN_RESULT, <OpenResultVO>openResultDTO);
    }

    protected onConfirmColor(confirmColorDTO: ConfirmColorDTO) {
        FireKit.use(Config.AI_FIRE).emit(GameEvent.CONFIRM_COLOR, <ConfirmColorVO>confirmColorDTO);
    }

    protected onOperationNotify(operationNotifyDTO: OperationNotifyDTO) {
        FireKit.use(Config.AI_FIRE).emit(GameEvent.OPERATION_NOTIFY, <OperationNotifyVO>operationNotifyDTO);
    }

    protected onMoveResult(moveResultDTO: MoveResultDTO) {
        FireKit.use(Config.AI_FIRE).emit(GameEvent.MOVE_RESULT, <MoveResultVO>moveResultDTO);
    }

    protected onEndGame(endGameDTO: EndGameDTO) {
        FireKit.use(Config.AI_FIRE).emit(GameEvent.END_GAME, <EndGameVO>endGameDTO);
    }

}
