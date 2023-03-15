import {MatrixKeyframe} from "./MatrixKeyframe";

/**
 * 动画的一组关键帧
 */
export class MatrixKeyframes {

    /**
     * 关键帧数组
     * @private
     */
    private readonly _matrixKeyframes: MatrixKeyframe[] = [];

    constructor(matrixKeyframes: MatrixKeyframe[] = []) {
        this._matrixKeyframes = matrixKeyframes || [];
    }

    /**
     * 添加一个关键帧
     * @param matrixKeyframe
     */
    add(matrixKeyframe: MatrixKeyframe) {
        if (this.has(matrixKeyframe)) {
            return;
        }
        this._matrixKeyframes.push(matrixKeyframe);
    }

    /**
     * 判断给定关键帧的progress是否已存在
     * @param matrixKeyframe
     */
    has(matrixKeyframe: MatrixKeyframe) {
        if (this.isNone) {
            return false;
        }
        for (let m of this._matrixKeyframes) {
            if (m.progress == matrixKeyframe.progress) {
                return true;
            }
        }
        return false;
    }

    /**
     * 按照progress从小到大排序
     */
    sort() {
        this._matrixKeyframes.sort((a, b) => {
            return a.progress - b.progress;
        })
    }

    /**
     * get一个关键帧
     * @param index 下标
     */
    get(index: number): MatrixKeyframe {
        if (!this._matrixKeyframes || index < 0) {
            throw new Error('matrixKeyframes为空');
        }
        return this._matrixKeyframes[index];
    }

    /**
     * 获取给定进度最近的关键帧
     * @param progress  指定的进度，在css的@keyrams里范围为 0 ~ 1，表示 0% ~ 100%，在js中执行动画时表示时间进度，单位ms
     * @param method 查找方式，round：四舍五入，floor：向下查找，ceil：向上查找
     */
    getNearestOne(progress: number, method: 'round' | 'floor' | 'ceil' = 'round'): MatrixKeyframe | null {
        if (this.isNone) {
            return null;
        }
        let left: MatrixKeyframe | null = null;
        let right: MatrixKeyframe | null = null;

        if (progress < this.firstOne.progress) {
            right = this.firstOne;
        } else if (progress >= this.lastOne.progress) {
            left = this.lastOne;
        } else {
            for (let i = 0; i < this.length - 1; i++) {
                let m1 = this.get(i);
                let m2 = this.get(i + 1);
                if (m1.progress <= progress && progress < m2.progress) {
                    left = m1;
                    right = m2;
                    break;
                }
            }
        }


        let progress1 = -Number.MAX_VALUE;
        let progress2 = Number.MAX_VALUE;
        if (left) progress1 = left.progress;
        if (right) progress2 = right.progress;


        if (method == 'floor') {
            if (progress2 == progress) {
                return right;
            }
            return left;
        }
        if (method == 'ceil') {
            if (progress1 == progress) {
                return left;
            }
            return right;
        }

        let dif1 = progress - progress1;
        let dif2 = progress2 - progress;
        if (dif1 < dif2) {
            return left;
        } else {
            return right;
        }

    }

    /**
     * 是否为空
     */
    get isNone() {
        return this.length == 0;
    }

    /**
     * 关键帧的数量
     */
    get length() {
        if (!this._matrixKeyframes) {
            return 0;
        }
        return this._matrixKeyframes.length;
    }

    /**
     * 获取第一个关键帧
     */
    get firstOne() {
        return this.get(0);
    }

    /**
     * 获取最后一个关键帧
     */
    get lastOne() {
        return this.get(this.length - 1);
    }
}
