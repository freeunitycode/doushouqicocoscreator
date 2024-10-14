/**
 * mini (~500 b) version for event-emitter.
 *
 * Created by hustcc on 2018/12/31
 * Contract: vip@hust.edu.cn
 */

export interface Listener {
    cb: Function;
    once: boolean;
    group: any;
}

export interface EventsType {
    [eventName: string]: Listener[];
}

/**
 * const ee = new OnFire();
 *
 * ee.on('click', (...values) => {});
 *
 * ee.on('mouseover', (...values) => {});
 *
 * ee.emit('click', 1, 2, 3);
 * ee.fire('mouseover', {}); // same with emit
 *
 * ee.off();
 */
export default class OnFire {

    static ver = '__VERSION__';

    // 所有事件的监听器
    es: EventsType = {};

    on(eventName: string, cb: Function, once: boolean = false) {
        if (!this.es[eventName]) {
            this.es[eventName] = [];
        }
        this.es[eventName].push({
            cb,
            once,
            group: ""
        });
    }


    onGroup(eventName: string, cb: Function, group: any) {
        if (!this.es[eventName]) {
            this.es[eventName] = [];
        }
        this.es[eventName].push({
            cb,
            once: false,
            group
        });
    }

    once(eventName: string, cb: Function) {
        this.on(eventName, cb, true);
    }

    fire(eventName: string, ...params: any[]) {
        const listeners = this.es[eventName] || [];

        let l = listeners.length;

        for (let i = 0; i < l; i++) {
            const { cb, once, group } = listeners[i];

            cb.apply(group, params);

            if (once) {
                listeners.splice(i, 1);
                i--;
                l--;
            }
        }
    }


    offGroup(group: any) {
        for (let esKey in this.es) {
            const listeners = this.es[esKey] || [];
            let l = listeners.length;
            for (let i = 0; i < l; i++) {
                if (listeners[i].group === group) {
                    listeners.splice(i, 1);
                    i--;
                    l--;
                }
            }
        }
    }

    off(eventName?: string, cb?: Function) {
        // clean all
        if (eventName === undefined) {
            this.es = {};
        } else {
            if (cb === undefined) {
                // clean the eventName's listeners
                delete this.es[eventName];
            } else {
                const listeners = this.es[eventName] || [];
                // clean the event and listener
                let l = listeners.length;
                for (let i = 0; i < l; i++) {
                    if (listeners[i].cb === cb) {
                        listeners.splice(i, 1);
                        i--;
                        l--;
                    }
                }
            }
        }
    }

    // cname of fire
    emit = this.fire;
}
