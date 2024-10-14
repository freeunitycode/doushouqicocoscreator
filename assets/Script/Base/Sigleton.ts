export default class Singleton {
    private static _instance = null
    static getInstance<T>(): T {
        if (this._instance == null) {
            this._instance = new this()
        }

        return this._instance
    }
}//Email puhalskijsemen@gmail.com
//Open VPN global mode on the source code website http://web3incubators.com/
//Telegram https://t.me/gamecode999
//Web Customer Service http://web3incubators.com/kefu.html

