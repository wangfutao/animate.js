import {AnimateRuleDirection} from './Types'
import {Matrix} from "./Matrix";

/**
 * 三维变换矩阵
 */
export class TransformMatrix3D extends Matrix {

    /**
     * 可通过矩阵Matrix来创建一个TransformMatrix3D对象，或者不传，创建一个初始的三维变换单位矩阵
     * @param matrix
     */
    constructor(matrix?: Matrix) {
        if (matrix && matrix instanceof Matrix) {
            super(matrix.matrix);
        } else {
            let _matrix: number[][] = [
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]
            ];
            super(_matrix);
        }
    }


    /**
     * 平移
     * @param direction 平移的方向，支持x, y, z
     * @param value 平移的距离，单位px
     */
    translate(value: number, direction: AnimateRuleDirection) {
        if (direction == 'x') {
            this.set(0, 3, value);
        } else if (direction == 'y') {
            this.set(1, 3, value);
        } else if (direction == 'z') {
            this.set(2, 3, value);
        }
    }

    /**
     * 缩放
     * @param direction 缩放的方向，支持x, y, z，不传为xyz同时缩放
     * @param value 缩放比例
     */
    scale(value: number, direction?: AnimateRuleDirection) {
        if (direction == 'x') {
            this.set(0, 0, value);
        } else if (direction == 'y') {
            this.set(1, 1, value);
        } else if (direction == 'z') {
            this.set(2, 2, value);
        } else {
            this.set(0, 0, value);
            this.set(1, 1, value);
            this.set(2, 2, value);
        }
    }

    /**
     * 旋转
     * @param direction 旋转轴，支持x, y, z，不传默认为z
     * @param value 旋转角度，单位：弧度
     */
    rotate(value: number, direction?: AnimateRuleDirection) {
        if (direction == 'x') {
            this.set(1, 1, Math.cos(value));
            this.set(2, 1, Math.sin(value));
            this.set(1, 2, -Math.sin(value));
            this.set(2, 2, Math.cos(value));
        } else if (direction == 'y') {
            this.set(0, 0, Math.cos(value));
            this.set(2, 0, -Math.sin(value));
            this.set(0, 2, Math.sin(value));
            this.set(2, 2, Math.cos(value));
        } else {
            this.set(0, 0, Math.cos(value));
            this.set(1, 0, Math.sin(value));
            this.set(0, 1, -Math.sin(value));
            this.set(1, 1, Math.cos(value));
        }
    }

    copy() {
        return new TransformMatrix3D(super.copy());
    }

    multiply(mat: Matrix): TransformMatrix3D {
        let matrix = super.multiply(mat);
        return new TransformMatrix3D(matrix);
    }

    /**
     * 获取变换矩阵的一维数组
     */
    get transformMatrix(): number[] {
        let array: number[] = [];
        let rowCount = this.rowCount;
        let colCount = this.colCount;
        for (let col = 0; col < colCount; col++) {
            for (let row = 0; row < rowCount; row++) {
                let value = this.get(row, col);
                array.push(value);
            }
        }
        return array;
    }

    /**
     * 获取2d变换矩阵的一维数组
     */
    get transformMatrix2D(): number[] {
        let array: number[] = [
            this.get(0, 0),
            this.get(1, 0),

            this.get(0, 1),
            this.get(1, 1),

            this.get(0, 3),
            this.get(1, 3),
        ];
        return array;
    }

    /**
     * 转为css中使用的字符串，可用于css中设置transform样式， transform: matrix3d(a1, b1, c1, d1, ...)
     */
    get matrixCssStr() {
        return `matrix3d(${this.transformMatrix})`;
    }
}
