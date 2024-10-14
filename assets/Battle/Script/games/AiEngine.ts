import GameEngine from "./GameEngine";
import AiPlayer from "./AiPlayer";
import FireKit from "./fire/FireKit";
import Config from "./Config";
import GameEvent from "./GameEvent";
import StartGameVO from "./vo/StartGameVO";
import OpenCardDTO from "./dto/OpenCardDTO";
import SitDownVO from "./vo/SitDownVO";
import PlayerManager from "./PlayerManager";
import OpenResultVO from "./vo/OpenResultVO";
import OperationNotifyVO from "./vo/OperationNotifyVO";
import MoveResultVO from "./vo/MoveResultVO";
import EndGameVO from "./vo/EndGameVO";
import ConfirmColorVO from "./vo/ConfirmColorVO";
import MoveCardDTO from "./dto/MoveCardDTO";

/**
 * AI 引擎
 */
export default class AiEngine {
    /**
     * 游戏引擎
     */
    private _engine: GameEngine;
    /**
     * AI的起始ID
     */
    private id: number = 2001;
    /**
     * AI玩家列表
     */
    private ais: { [id: number]: AiPlayer } = {};
    /**
     * Chair -> ID
     */
    private chairIds: { [chair: number]: number } = {};

    /**
     * Chair -> Color
     */
    private chairColors: { [chair: number]: number } = {};

    /**
     * 当前的牌
     */
    private cards: number[];

    constructor(engine: GameEngine) {
        this._engine = engine;
        this.initFire();
    }

    /**
     * 初始化事件订阅
     */
    private initFire() {
        FireKit.use(Config.AI_FIRE).onGroup(GameEvent.SIT_DOWN, this.sitDownAiLogic, this);
        FireKit.use(Config.AI_FIRE).onGroup(GameEvent.START_GAME, this.startGameAiLogic, this);
        FireKit.use(Config.AI_FIRE).onGroup(GameEvent.OPEN_RESULT, this.openResultAiLogic, this);
        FireKit.use(Config.AI_FIRE).onGroup(GameEvent.CONFIRM_COLOR, this.confirmColorAiLogic, this);
        FireKit.use(Config.AI_FIRE).onGroup(GameEvent.OPERATION_NOTIFY, this.operationNotifyAiLogic, this);
        FireKit.use(Config.AI_FIRE).onGroup(GameEvent.MOVE_RESULT, this.moveResultAiLogic, this);
        FireKit.use(Config.AI_FIRE).onGroup(GameEvent.END_GAME, this.endGameAiLogic, this);
    }

    /**
     * 坐下
     * @param sitDownVO
     */
    sitDownAiLogic = (sitDownVO: SitDownVO) => {
        this.chairIds[sitDownVO.chair] = sitDownVO.userId;

    };

    /**
     * 开始游戏的Ai处理逻辑
     * @param startGameVO
     */
    startGameAiLogic = (startGameVO: StartGameVO) => {
        this.cards = startGameVO.cards; //初始化牌
        let aiPlayer = this.ais[this.chairIds[startGameVO.chair]];
        if (aiPlayer != null) {  //如果当前操作玩家是机器人
            this.openAction(startGameVO.chair);
        }
    };

    /**
     * 翻开牌结果通知的AI逻辑
     * @param openResultVO
     */
    openResultAiLogic = (openResultVO: OpenResultVO) => {
        this.cards[openResultVO.index] = openResultVO.card;
    };

    /**
     * 确认颜色逻辑
     * @param confirmColorVO
     */
    confirmColorAiLogic = (confirmColorVO: ConfirmColorVO) => {
        this.chairColors[confirmColorVO.chair] = confirmColorVO.color;
    };

    /**
     * 操作通知的AI逻辑
     * @param operationNotifyVO
     */
    operationNotifyAiLogic = (operationNotifyVO: OperationNotifyVO) => {
        let chair = operationNotifyVO.chair;
        let aiPlayer = this.ais[this.chairIds[chair]];
        console.log('当前应该操作的chair:', chair)
        if (aiPlayer != null) {  //如果当前操作玩家是机器人
            // 获取自己的花色
            let color = this.chairColors[chair];
            let myCards: { [card: number]: number } = [];
            this.cards.forEach((v, i) => {
                if ((v >> 4) == color) {    // 自己的牌
                    myCards[v] = i;
                }
            });
            let actions: Array<ActionScore> = [];   // 所有运行的动作
            if (this.darkLength().length > 0) { // 操作列表
                actions.push(new ActionScore(100, this.openAction, chair));
            }
            for (let card in myCards) {
                let index = myCards[card];  //索引
                let row = Math.floor(index / 4);
                let col = index % 4;
                let neighbors = [];
                if (row < 3) { // 获取邻居的下标
                    neighbors.push(((row + 1) * 4) + col);  // 下
                }
                if (row > 0) {
                    neighbors.push(((row - 1) * 4) + col);  // 上
                }
                if (col < 3) {
                    neighbors.push((row * 4) + col + 1);   // 右
                }
                if (col > 0) {
                    neighbors.push((row * 4) + col - 1);   // 左
                }
                neighbors.forEach((v) => {
                    if (this._engine.canMove(index, v, this.cards)) {   //如果能够移动
                        let fromV = this.cards[index] & 0x0F;
                        let toV = this.cards[v] & 0x0F;
                        let fromC = this.cards[index] >> 4;
                        let toC = this.cards[v] >> 4;
                        if (toC == GameEngine.NONE) {
                            actions.push(new ActionScore(90, this.moveAction, chair, index, v));
                        } else {
                            if (fromV == 7 && toV == 0) {
                                actions.push(new ActionScore(0, this.moveAction, chair, index, v));
                            } else if (fromV == 0 && toV == 7) {
                                actions.push(new ActionScore(200, this.moveAction, chair, index, v));
                            } else {
                                if (fromV - toV > 0) {  // 能吃
                                    actions.push(new ActionScore(99 + toV + fromV - toV, this.moveAction, chair, index, v));
                                } else {               // 不能吃
                                    actions.push(new ActionScore(99 - fromV, this.moveAction, chair, index, v));
                                }
                            }
                        }
                    }
                });
            }
            console.log('机器人操作的actions', actions)
            let action = actions.sort((a, b) => {
                return a.score - b.score
            })[0]
            // let action = _.sortBy(actions, (a) => { // 按照分数排序
            //     return 0 - a.score;
            // })[0];
            action.func.apply(this, action.args);
        }
    };

    /**
     * 移动结果AI逻辑
     * @param moveResultVO
     */
    moveResultAiLogic = (moveResultVO: MoveResultVO) => {
        this.cards[moveResultVO.fromIndex] = moveResultVO.fromCard;
        this.cards[moveResultVO.toIndex] = moveResultVO.toCard;
    };

    /**
     * 结束游戏逻辑
     * @param endGameVO
     */
    endGameAiLogic = (endGameVO: EndGameVO) => {
        console.log("==========AI GAME END==========");
        FireKit.use(Config.AI_FIRE).offGroup(this);
    };

    /**
     * 随机打开牌操作
     * @param chair
     */
    openAction = (chair) => {
        let darkCards = this.darkLength();             // 获取未打开的牌下标
        if (darkCards.length > 0) {
            this.runAction(() => {
                const shuffleIndex = this.darkLength()[0]
                this._engine.open(new OpenCardDTO(chair, shuffleIndex))
            });
        }
    };
    private shuffle(darkCards): number[] {
        darkCards.sort(function () {
            return Math.random() - 0.5
        })
        return this.cards;
    }

    /**
     * 获取未打开的牌
     */
    darkLength(): number[] {
        let darkCards = [];             // 获取未打开的牌下标
        for (const key in this.cards) {
            if (Object.prototype.hasOwnProperty.call(this.cards, key)) {
                const element = this.cards[key];
                if (element == GameEngine.DARK_CARD)
                    darkCards.push(key);
            }
        }
        darkCards.sort(function () {
            return Math.random() - 0.5
        })
        return darkCards;
    }

    /**
     * 移动操作
     * @param chair
     * @param fromIndex
     * @param toIndex
     */
    moveAction = (chair, fromIndex, toIndex) => {
        console.log('机器人移动操作 fromIndex:', fromIndex, ',toIndex:', toIndex)
        this.runAction(() => {
            this._engine.move(new MoveCardDTO(chair, fromIndex, toIndex));  //移动操作
        });
    };

    /**
     * 执行动作
     * @param action
     */
    runAction = (action) => {
        setTimeout(() => {
            action()
        }, Math.floor(Math.random() * 200 + 300));
    };

    /**
     * 创建个AI玩家
     */
    createAiPlayer() {
        let aiPlayer = PlayerManager.inst().create(new AiPlayer(this.id++, "Ai-" + this.id));
        this.ais[aiPlayer.userId] = <AiPlayer>aiPlayer;
        this._engine.enter(aiPlayer);
    }

}

/**
 * 操作评分
 */
class ActionScore {
    /**
     * 分数
     */
    score: number;
    /**
     * 函数
     */
    func: Function;
    /**
     * 参数
     */
    args: any[] = [];


    constructor(score: number, func: Function, ...args: any[]) {
        this.score = score;
        this.func = func;
        this.args = args;
    }
}
