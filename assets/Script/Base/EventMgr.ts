import { Component, resources, SpriteAtlas } from "cc";
import Singleton from "./Sigleton";
//Email puhalskijsemen@gmail.com
//Open VPN global mode on the source code website http://web3incubators.com/
//Telegram https://t.me/gamecode999
//Web Customer Service http://web3incubators.com/kefu.html


interface IItem {
    fun: Function
    cxt: unknown
}

export default class EventMgr extends Singleton {
    static get Instance() {
        // super()
        return super.getInstance<EventMgr>()
    }

    private eventDir: Map<string, [IItem]> = new Map()

    addEventListen(evt: string, fun: Function, cxt?: unknown) {
        if (this.eventDir.has(evt)) {
            const arr = this.eventDir.get(evt)
            arr.push({ fun, cxt })
        } else {
            this.eventDir.set(evt, [{ fun, cxt }])
        }
    }

    unEventListen(evt: string, fun: Function) {
        if (this.eventDir.has(evt)) {
            const index = this.eventDir.get(evt).findIndex(i => i.fun == fun)
            index > -1 && this.eventDir.get(evt).splice(index, 1)
        }
    }

    emit(evt: string, ...param: unknown[]) {
        if (this.eventDir.has(evt)) {
            this.eventDir.get(evt).forEach(({ fun, cxt }) => {
                cxt ? fun.apply(cxt, param) : fun(...param)
            })
        }
    }

    clearDir() {
        this.eventDir.clear()
    }
}