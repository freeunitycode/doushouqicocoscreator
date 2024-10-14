import { Component, Sprite, UITransform } from "cc";
import { ResMgr } from "../../../../Script/Base/ResMgr";
import GameEngine from "../GameEngine";

const _iconMapping: { [key: number]: string; } = {
    0x00: "bear",
    0x01: "crocodile",
    0x02: "tiger",
    0x03: "elephant",
    0x04: "gorilla",
    0x05: "lion",
    0x06: "pig",
    0x07: "walrus",

    0x10: "bear_square",
    0x11: "crocodile_square",
    0x12: "tiger_square",
    0x13: "elephant_square",
    0x14: "gorilla_square",
    0x15: "lion_square",
    0x16: "pig_square",
    0x17: "walrus_square"
};
export default class UICard extends Component {
    private spriteCard: Sprite

    start() {
        this.spriteCard = this.node.getComponent(Sprite)
    }

    async refreshSprite(card: number) {
        if (card == GameEngine.NONE_CARD) {
            this.spriteCard.spriteFrame = null
        } else {
            const icon = await ResMgr.getInstance().getSpriteFrameByPath(`Battle/Texture/animal/${_iconMapping[card]}`)
            this.spriteCard.spriteFrame = icon
        }

    }
}