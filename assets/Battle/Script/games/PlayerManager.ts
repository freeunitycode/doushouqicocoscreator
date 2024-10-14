import Player from "./Player";

/**
 * 玩家管理
 */
export default class PlayerManager {

    private static _inst: PlayerManager;

    private players: { [id: number]: Player } = {};

    public static inst(): PlayerManager {
        if (this._inst == null) {
            this._inst = new PlayerManager();
        }
        return this._inst;
    }

    /**
     * 根据玩家ID获取玩家信息
     * @param id
     */
    public get(id: number): Player {
        return this.players[id];
    }

    /**
     * 添加玩家
     * @param player
     */
    public add(player: Player) {
        this.players[player.userId] = player;
    }

    /**
     * 创建玩家对象
     * @param player
     */
    public create(player: Player): Player {
        this.add(player);
        return player;
    }
}
