/**
 * 用来生成一个随机的字符串
 */
export class RandomString {
    private readonly str: string;

    constructor() {
        const s1 = Math.random().toString(36).substring(2, 10);
        const s2 = Math.random().toString(36).substring(2, 10);
        this.str = `${s1}-${s2}`;
    }

    toString() {
        return this.str;
    }
}
