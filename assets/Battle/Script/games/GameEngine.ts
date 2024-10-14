
import Player from "./Player";
import SitDownDTO from "./dto/SitDownDTO";
import StartGameDTO from "./dto/StartGameDTO";
import OpenCardDTO from "./dto/OpenCardDTO";
import OperationNotifyDTO from "./dto/OperationNotifyDTO";
import MoveCardDTO from "./dto/MoveCardDTO";
import MoveResultDTO from "./dto/MoveResultDTO";
import OpenResultDTO from "./dto/OpenResultDTO";
import EndGameDTO from "./dto/EndGameDTO";
import ConfirmColorDTO from "./dto/ConfirmColorDTO";
import FireKit from "./fire/FireKit";
import Config from "./Config";
import AiEngine from "./AiEngine";

/**
 * 游戏引擎
 */
export default class GameEngine {

    /**
     * 最多牌数量
     */
    static MAX_CARD: number = 16;
    /**
     * 最大椅子个数
     */
    static MAX_CHAIR: number = 2;
    /**
     * 无效的牌
     */
    static NONE_CARD: number = 0xF0;
    /**
     * 未知的牌，未翻牌
     */
    static DARK_CARD: number = 0xE0;
    /**
     * 颜色
     */
    static BLUE: number = 0x00;
    /**
     * 红色
     */
    static RED: number = 0x01;
    /**
     * 未知牌颜色标识
     */
    static DARK: number = 0x0E;
    /**
     * 无效牌颜色标识
     */
    static NONE: number = 0x0F;
    /**
     * 无效的椅子
     */
    static INVALID_CHAIR: number = 0xFF;
    /**
     * 无效的位置
     */
    static INVALID_INDEX: number = 0xFF;
    /**
     * 当前游戏里玩家
     */
    private players: { [key: number]: Player } = {};
    /**
     * 椅子与颜色的对应关系
     */
    private chairColors: { [key: number]: number } = {};
    /**
     * 游戏动物棋牌
     */
    private cards: number[] = [
        // 鼠    猫    狗    狼    豹    虎    狮    象
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, // 蓝色
        0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17  // 红色
    ];
    /**
     * 当前桌面的牌
     */
    private currCards: number[] = [
        GameEngine.DARK_CARD, GameEngine.DARK_CARD, GameEngine.DARK_CARD, GameEngine.DARK_CARD, GameEngine.DARK_CARD, GameEngine.DARK_CARD, GameEngine.DARK_CARD, GameEngine.DARK_CARD,
        GameEngine.DARK_CARD, GameEngine.DARK_CARD, GameEngine.DARK_CARD, GameEngine.DARK_CARD, GameEngine.DARK_CARD, GameEngine.DARK_CARD, GameEngine.DARK_CARD, GameEngine.DARK_CARD];
    /**
     * 当前操作的玩家 0 / 1
     */
    private currChair: number;
    /**
     * AI 引擎
     */
    private _aiEngine: AiEngine;

    constructor() {
        FireKit.init(Config.HUMAN_FIRE);
        FireKit.init(Config.AI_FIRE);
        this._aiEngine = new AiEngine(this);    //初始化AI引擎
    }

    /**
     * 玩家进入游戏
     * @param player
     */
    enter(player: Player) {
        let chair = this.assignChair();             // 分配椅子
        if (chair != GameEngine.INVALID_CHAIR) {    // 分配成功并且通知玩家
            this.players[chair] = player;
            this.sendSitDown(chair, player);
            if (this.assignChair() != GameEngine.INVALID_CHAIR) {    //如果还有空闲的椅子
                this._aiEngine.createAiPlayer();
            } else { // 坐满开局
                this.startGame(); //游戏开始
            }
        }
    }

    /**
     * 开始游戏
     */
    startGame() {
        // this.cards = this.shuffle();
        this.currChair = Math.floor(Math.random() * GameEngine.MAX_CHAIR);//随机生成第一个椅子  
        console.log('第一个操作的currChair:', this.currChair)
        this.sendStartGame();
    }

    /**
     * 发送开始游戏
     */
    private sendStartGame() {
        for (let key in this.players) {
            this.players[key].startGame(new StartGameDTO(this.currChair, this.currCards));
        }
    }

    /**
     * 给所有玩家发送玩家坐下的信息
     * @param chair
     * @param player
     */
    private sendSitDown(chair: number, player: Player) {
        for (let key in this.players) {
            this.players[key].sitDown(new SitDownDTO(player.userId, chair, player.name));
        }
    }

    /**
     * 发送显示牌
     * @param chair
     * @param index
     * @param card
     */
    private sendOpenResult(chair: number, index: number, card: number) {
        for (let key in this.players) {
            // console.log('给每个注册玩家 发送开牌命令 chair:', chair, ' ,index:', index, ' ,card:', card)
            this.players[key].openResult(new OpenResultDTO(chair, index, card));
        }
    }

    /**
     * 发送移动结果
     * @param chair
     * @param fromIndex
     * @param fromCard
     * @param toIndex
     * @param toCard
     * @param result
     */
    private sendMoveResult(chair: number, fromIndex: number, fromCard: number, toIndex: number, toCard: number, result: number) {
        for (let key in this.players) {
            this.players[key].moveResult(new MoveResultDTO(chair, fromIndex, fromCard, toIndex, toCard, result));
        }
    }

    /**
     * 发送玩家操作通知
     */
    private sendOperationNotify() {
        this.currChair = this.nextChair();  // 获取下一个操作的椅子
        console.log('下一个操作的chair:', this.currChair)
        for (let key in this.players) {
            this.players[key].operationNotify(new OperationNotifyDTO(this.currChair));
        }
    }

    /**
     * 发送游戏结束信息
     */
    private sendEndGame() {
        let c = this.checkWin();    // 胜利的颜色
        let chair: number;
        for (let k in this.chairColors) {
            if (this.chairColors[k] == c) {
                chair = parseInt(k);
            }
        }
        for (let key in this.players) {
            this.players[key].endGame(new EndGameDTO(chair, c));
        }
    }

    /**
     * 分配颜色
     */
    private sendConfirmColor(chair: number, color: number) {
        for (let key in this.players) {
            this.players[key].confirmColor(new ConfirmColorDTO(chair, color));
        }
    }

    /**
     * 开牌
     * @param openCardDTO
     */
    open(openCardDTO: OpenCardDTO) {
        console.log("OpenCard:" + JSON.stringify(openCardDTO));
        let chair = openCardDTO.chair;
        let index = openCardDTO.index;
        if (chair != this.currChair) {
            console.log("无效操作.");
            return;
        }
        if (this.currCards[index] == GameEngine.DARK_CARD) {
            let card = this.cards[index];
            let length = Object.keys(this.chairColors).length
            if (length == 0) {    //分配颜色
                for (let i = 0; i < GameEngine.MAX_CHAIR; i++) {
                    if (i == chair) {
                        this.chairColors[chair] = (card >> 4);
                        this.sendConfirmColor(chair, (card >> 4));
                    } else {
                        this.chairColors[i] = GameEngine.RED ? GameEngine.BLUE : GameEngine.RED;
                        this.sendConfirmColor(i, (card >> 4) == GameEngine.RED ? GameEngine.BLUE : GameEngine.RED);
                    }
                }
            }
            this.currCards[index] = card;
            this.sendOpenResult(chair, index, this.currCards[index]);
            if (this.checkWin() != -1) {
                this.sendEndGame();
            } else {
                setTimeout(() => {
                    this.sendOperationNotify();
                }, 1000)
            }
        }
    }

    /**
     * 移动牌
     * @param moveCardDTO
     */
    move(moveCardDTO: MoveCardDTO) {
        console.log("MoveCard:" + JSON.stringify(moveCardDTO));
        let fromIndex = moveCardDTO.fromIndex;
        let toIndex = moveCardDTO.toIndex;
        let fromCard = this.currCards[fromIndex];   // 当前位置的牌
        let toCard = this.currCards[toIndex];   // 下一个位置的牌
        let fromV = (fromCard & 0x0F);
        let nextV = (toCard & 0x0F);
        let fromC = fromCard >> 4;
        let toC = toCard >> 4;
        if (fromC > 1 || toC == (GameEngine.DARK_CARD >> 4)) {  // 当前位置不是正常的牌，或者下一个位置是未翻开的牌
            console.log("异常操作");
            return;
        }
        this.currCards[fromIndex] = GameEngine.NONE_CARD;           // 当前位置变成空
        if (toC == (GameEngine.NONE_CARD >> 4)) {                   // 下个位置是空位
            this.currCards[toIndex] = fromCard;
        } else { // 非空未知
            if (fromV > nextV) {
                if (fromV == 7 && nextV == 0) { // 大象 和 老鼠
                    this.currCards[toIndex] = toCard;
                } else {
                    this.currCards[toIndex] = fromCard;
                }
            }
            if (fromV == nextV) {
                this.currCards[toIndex] = GameEngine.NONE_CARD;
            }
            if (fromV < nextV) {
                if (fromV == 0 && nextV == 7) { // 老鼠 和 大象
                    this.currCards[toIndex] = fromCard;
                } else {
                    this.currCards[toIndex] = toCard;
                }
            }
        }
        let result: number;
        if (this.currCards[toIndex] == GameEngine.NONE_CARD) {
            result = 0;
        } else if (this.currCards[toIndex] == fromCard) {
            result = 1;
        } else {
            result = -1;
        }
        this.sendMoveResult(moveCardDTO.chair, fromIndex, this.currCards[fromIndex], toIndex, this.currCards[toIndex], result);
        if (this.checkWin() != -1) {
            this.sendEndGame();
        } else {
            this.sendOperationNotify();
        }
    }

    /**
     * 校验游戏是否结束
     */
    private checkWin(): number {
        if (this.currCards.indexOf(GameEngine.DARK_CARD) == -1) {
            let blueC = 0;
            let redC = 0;
            this.currCards.forEach((v) => {
                if (v != GameEngine.NONE_CARD) {
                    if ((v >> 4) == 0) {
                        blueC++;
                    } else {
                        redC++;
                    }
                }
            });
            if (blueC == 0) {
                return GameEngine.RED; // 红赢
            }
            if (redC == 0) {
                return GameEngine.BLUE; // 蓝赢
            }
        }
        return -1;
    }

    /**
     *  洗牌，随机数组
     */
    private shuffle(): number[] {
        this.cards.sort(function () {
            return Math.random() - 0.5
        })
        return this.cards;
    }

    /**
     * 分配椅子
     */
    private assignChair(): number {
        for (let i = 0; i < GameEngine.MAX_CHAIR; i++) {
            if (this.players[i] == null) {
                return i;
            }
        }
        return GameEngine.INVALID_CHAIR;
    }

    /**
     * 获取下一个操作的玩家
     */
    private nextChair(): number {
        return (this.currChair + 1) % GameEngine.MAX_CHAIR;
    }


    /**
     * 是否可以移动
     * @param from  当前
     * @param to    目标
     * @param cards 牌
     */
    public canMove(from: number, to: number, cards: number[]): boolean {
        let iRow = Math.floor(from / 4);
        let iCol = from % 4;
        let jRow = Math.floor(to / 4);
        let jCol = to % 4;
        if (cards[from] == GameEngine.DARK_CARD
            || cards[to] == GameEngine.DARK_CARD
            || (cards[from] >> 4) == (cards[to] >> 4)) {
            return false;
        }
        return (iRow == jRow && Math.abs(iCol - jCol) == 1) || (iCol == jCol && Math.abs(iRow - jRow) == 1);
    }

}
