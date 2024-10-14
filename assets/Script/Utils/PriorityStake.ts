import { PriorityElement } from "./PriorityQueue"
//Email puhalskijsemen@gmail.com
//Open VPN global mode on the source code website http://web3incubators.com/
//Telegram https://t.me/gamecode999
//Web Customer Service http://web3incubators.com/kefu.html


export class PriorityStake<T>{
    private stack: Array<PriorityElement<T>> = new Array<PriorityElement<T>>();
    private size: number = 0;

    public getSize(): number {
        return this.size;
    }

    public clear(): void {
        this.stack.length = 0;
        this.size = 0;
    }

    public getTopElement(): T | null {
        if (this.stack.length <= 0) {
            return null;
        }
        return this.stack[this.stack.length - 1].data;
    }

    public getElements(): T[] {
        //let elements:T[] = [];
        let elements: Array<T> = new Array<T>();
        for (const e of this.stack) {
            elements.push(e.data);
        }
        return elements;
    }

    public push(e: T, priority: number = 0) {
        this.stack.push(new PriorityElement(e, priority));
        this.size++;
        this.ajust();
    }

    public pop(): T | null {
        if (this.stack.length <= 0) {
            return null;
        }
        this.size--;
        let ele = this.stack.pop();
        if (ele !== undefined) {
            return ele.data;
        } else {
            return null;
        }
    }

    //根据优先级调整顺序
    private ajust() {
        for (let i = this.stack.length - 1; i > 0; i--) {
            if (this.stack[i].priority < this.stack[i - 1].priority) {
                this.swap(i, i - 1);
            }
        }
    }

    private swap(a: number, b: number) {
        let tmp = this.stack[a];
        this.stack[a] = this.stack[b];
        this.stack[b] = tmp;
    }

    public hasElement(t: T): boolean {
        for (const e of this.stack) {
            if (e.data === t) {
                return true;
            }
        }
        return false;
    }
}