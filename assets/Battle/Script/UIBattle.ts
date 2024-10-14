import { _decorator, Node, Button, Component, TiledUserNodeData, Sprite, SpriteFrame, Label } from "cc";
import EventMgr from "../../Script/Base/EventMgr";
import { ResMgr } from "../../Script/Base/ResMgr";
import { LogicEvent } from "../../Script/Games/LogicEvent";
import { UIScreen } from "../../Script/UIFrame/UIFrom";
import Config from "./games/Config";
import MoveCardDTO from "./games/dto/MoveCardDTO";
import OpenCardDTO from "./games/dto/OpenCardDTO";
import FireKit from "./games/fire/FireKit";
import GameEngine from "./games/GameEngine";
import GameEvent from "./games/GameEvent";
import HumanPlayer from "./games/HumanPlayer";
import PlayerManager from "./games/PlayerManager";
import UICard from "./games/UI/UICard";
import TweenUtil from "./games/utils/TweenUtils";
import ConfirmColorVO from "./games/vo/ConfirmColorVO";
import MoveResultVO from "./games/vo/MoveResultVO";
import OpenResultVO from "./games/vo/OpenResultVO";
import OperationNotifyVO from "./games/vo/OperationNotifyVO";
import SitDownVO from "./games/vo/SitDownVO";
import StartGameVO from "./games/vo/StartGameVO";

const { ccclass, property } = _decorator;

@ccclass('UIBattle')
export class UIBattle extends UIScreen {

    /**
     * 引擎
     */
    private _engine: GameEngine;
    /**
     * 当前牌面的牌
     */
    private cards: number[];
    /**
     * Chair -> ID
     */
    private chairIds: { [chair: number]: number } = {};
    /**
     * 自己的编号
     */
    private _meChair: number;
    /**
     * 自己的游戏ID
     */
    private _meId: number = 1001;
    /**
     * 颜色
     */
    private _meColor: number;
    /**
     * 锁定状态
     */
    private _locked: boolean = true;
    /**
     * 开始的位置
     */
    private fromIndex: number = GameEngine.INVALID_INDEX;

    @property(Node)
    UIGames: Node = null
    @property(Label)
    LabelColor: Label = null

    private _iconMapping: { [key: number]: string; } = {
        0x00: "蓝鼠",
        0x01: "蓝猫",
        0x02: "蓝狗",
        0x03: "蓝狼",
        0x04: "蓝豹",
        0x05: "蓝虎",
        0x06: "蓝狮",
        0x07: "蓝象",
        0x10: "红鼠",
        0x11: "红猫",
        0x12: "红狗",
        0x13: "红狼",
        0x14: "红豹",
        0x15: "红虎",
        0x16: "红狮",
        0x17: "红象"
    };
    isEngross = false;

    @property({ type: [Node] })
    btnCards: Node[] = [];

    async onShow(...params: any) {
        this.init();
        this.eventRegister();

        this._engine.enter(PlayerManager.inst().create(new HumanPlayer(this._meId, "鸡哥")));// 进入游戏
    }

    init() {
        this._engine = new GameEngine();
    }

    eventRegister() {
        FireKit.use(Config.HUMAN_FIRE).onGroup(GameEvent.SIT_DOWN, this.sitDownLogic, this);
        FireKit.use(Config.HUMAN_FIRE).onGroup(GameEvent.START_GAME, this.startGameLogic, this);
        FireKit.use(Config.HUMAN_FIRE).onGroup(GameEvent.OPEN_RESULT, this.openResultLogic, this);
        FireKit.use(Config.HUMAN_FIRE).onGroup(GameEvent.CONFIRM_COLOR, this.confirmColorLogic, this);
        FireKit.use(Config.HUMAN_FIRE).onGroup(GameEvent.OPERATION_NOTIFY, this.operationNotifyLogic, this);
        FireKit.use(Config.HUMAN_FIRE).onGroup(GameEvent.MOVE_RESULT, this.moveResultLogic, this);
        // FireKit.use(Config.HUMAN_FIRE).onGroup(GameEvent.END_GAME, this.endGameLogic, this);
    }

    startGameLogic(startGameVo: StartGameVO) {
        console.log('startGameVo.chair:', startGameVo.chair)
        this.cards = startGameVo.cards;
        this._locked = startGameVo.chair != this._meChair;
        for (let index = 0; index < this.btnCards.length; index++) {
            let clickEventHandler = new Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = 'UIBattle';
            clickEventHandler.handler = 'callback';
            clickEventHandler.customEventData = String(index);
            let button = this.btnCards[index].addComponent(Button)
            this.btnCards[index].getChildByName('Sprite').addComponent(UICard)
            button.clickEvents.push(clickEventHandler);
        }
    }

    callback(event, customEventData) {
        let node = event.target;
        let button = node.getComponent(Button);
        let index = customEventData;
        let row = Math.floor(index / 4);
        let col = index % 4;
        console.log('row:' + row + ',col:' + col);
        console.log(this._locked)
        if (!this._locked) {
            let card = this.cards[index];
            let color = card >> 4;//判断花色

            if (color === GameEngine.DARK) {
                this._engine.open(new OpenCardDTO(this._meChair, index));
            } else {
                if (this.fromIndex == GameEngine.INVALID_INDEX) {
                    if (color == this._meColor) {
                        // 选中了自己添加选中状态
                        this.updateAndSelectStyle(index);
                        this.fromIndex = index;
                    }
                } else {
                    if (this._engine.canMove(this.fromIndex, index, this.cards)) {
                        this._engine.move(new MoveCardDTO(this._meChair, this.fromIndex, index));
                        this.fromIndex = GameEngine.INVALID_INDEX;
                        this.clearSelectStyle();    // 清除选中状态
                    } else {
                        //选中后 再切换到别的牌
                        if (color == this._meColor) {
                            this.updateAndSelectStyle(index);
                            this.fromIndex = index;
                        }
                    }
                }
            }
        }
    }

    /**
     *
     * @param openResultVO
     */
    openResultLogic = (openResultVO: OpenResultVO) => {
        this.cards[openResultVO.index] = openResultVO.card;
        this.clearSelectStyle();
        this.updateOpenCard(openResultVO);
        this.updateAndSelectStyle(openResultVO.index);
        this.fromIndex = GameEngine.INVALID_INDEX;
    };
    async updateOpenCard(openResultVO) {
        console.log('openResultVO:', openResultVO)
        let card = openResultVO.card;
        let index = openResultVO.index;
        let cardTemp = this.getCardItemTemp(index);

        await TweenUtil.flip(cardTemp.getChildByName('Sprite'), 0.8, () => {
            this.updateStyle(index, card);
        });
    }
    getCardItemTemp(index: any) {
        for (let i = 0; i < this.btnCards.length; i++) {
            const element = this.btnCards[i];
            if (i == Number(index))
                return element;
        }
    }

    /**
     * 更新牌的样式
     * @param index
     */
    async updateStyle(index, card) {
        let cardTemp = this.getCardItemTemp(index);
        let UICardCom = cardTemp.getChildByName('Sprite').getComponent(UICard)
        UICardCom.refreshSprite(card)
    }

    /**
     * 增加选择状态
     * @param index
     */
    private updateAndSelectStyle(index: number) {
        this.clearSelectStyle();            // 先清除选中
        for (let i = 0; i < this.btnCards.length; i++) {
            const card = this.btnCards[i]
            if (i == index) {
                card.getChildByName('ChoosedMask').active = true
            }
        }
    }

    /**
     * 清除选中状态
     */
    private clearSelectStyle() {
        for (let i = 0; i < this.btnCards.length; i++) {
            const card = this.btnCards[i]
            card.getChildByName('ChoosedMask').active = false
        }
    }

    /**
     *
     * @param sitDownVO
     */
    sitDownLogic = (sitDownVO: SitDownVO) => {
        this.chairIds[sitDownVO.chair] = sitDownVO.userId;
        if (sitDownVO.userId == this._meId) {   //如果是自己
            this._meChair = sitDownVO.chair;
        }
    };

    /**
     *
     * @param confirmColorVO
     */
    confirmColorLogic = (confirmColorVO: ConfirmColorVO) => {
        if (confirmColorVO.chair == this._meChair) {
            this._meColor = confirmColorVO.color;
            this.LabelColor.string = this._meColor == 0 ? '您是圆的' : '您是方的'

        }
    };

    /**
     *
     * @param operationNotifyVO
     */
    operationNotifyLogic = (operationNotifyVO: OperationNotifyVO) => {
        this._locked = operationNotifyVO.chair != this._meChair;
    };

    /**
     *
     * @param moveResultVO
     */
    moveResultLogic = (moveResultVO: MoveResultVO) => {
        this.cards[moveResultVO.fromIndex] = moveResultVO.fromCard;
        this.cards[moveResultVO.toIndex] = moveResultVO.toCard;
        this.updateStyle(moveResultVO.fromIndex, moveResultVO.fromCard);
        this.updateStyle(moveResultVO.toIndex, moveResultVO.toCard);
        if (this.cards[moveResultVO.toIndex] != GameEngine.NONE_CARD) {
            this.updateAndSelectStyle(moveResultVO.toIndex);
        }
        this.fromIndex = GameEngine.INVALID_INDEX;
    };

    async onBtnBackLobby() {
        await this.closeSelf();
        EventMgr.Instance.emit(LogicEvent.ENTER_HALL_FROM_GAMES);
    }
}