import {TransformMatrix3D} from "./TransformMatrix3D";

/**
 * 动画的一个关键帧
 */
export interface MatrixKeyframe {
    /**
     * 动画的进度，在css的@keyrams里范围为 0 ~ 1，表示 0% ~ 100%
     * 在js中执行动画时表示时间进度，单位ms
     */
    progress: number;

    /**
     * 当前进度的变换矩阵
     */
    transformMatrix: TransformMatrix3D;
}
