import OnFire from "./OnFire";


export default class FireKit {


    static fireDict: { [key: string]: OnFire; } = {};

    /**
     * 初始化 FireKit
     * @param name
     */
    static init(name: string): void {
        if (FireKit.fireDict[name] == null) {
            FireKit.fireDict[name] = new OnFire();
        }
    }

    /**
     * 获取 FireKit
     * @param name
     */
    static use(name: string): OnFire {
        return FireKit.fireDict[name];
    }

}
