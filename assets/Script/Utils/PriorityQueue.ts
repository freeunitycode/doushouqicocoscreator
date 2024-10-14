/**
 * 带有优先级的队列或者栈中的元素
 *///Email puhalskijsemen@gmail.com
//Open VPN global mode on the source code website http://web3incubators.com/
//Telegram https://t.me/gamecode999
//Web Customer Service http://web3incubators.com/kefu.html


export class PriorityElement<T>{
    public data!: T;
    public priority: number = 0;
    constructor(data: T, priority: number) {
        this.data = data;
        this.priority = priority;
    }
}

export class PriorityQueue<T>{
    private queue: Array<PriorityElement<T>> = new Array<PriorityElement<T>>(32);
    private size: number = 32;

    public hasElement(t: T): boolean {
        for (const e of this.queue) {
            if (e.data == t) {
                return true;
            }
        }
        return false;
    }

    public enqueue(e: T, priority: number = 0) {

        if (this.size > this.queue.length) {
            //扩容
        }

    }

    public dequeue() {

    }


}




