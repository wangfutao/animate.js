import {EasingFunctions} from "./EasingFunctions";

/**
 * 动画类型，分别表示平移、旋转、缩放
 */
export type AnimateRuleType = 'translate' | 'rotate' | 'scale'

/**
 * 当类型为translate时，表示平移的方向
 * 当类型为rotate时，表示旋转轴
 * 当类型为scale时，表示缩放的方向
 */
export type AnimateRuleDirection = 'x' | 'y' | 'z'

type MethodNames<T> = {
    [K in keyof T]: T[K] extends Function ? K : never
}[keyof T]

/**
 * 缓动函数的名称
 */
export type EasingFunctionName = MethodNames<typeof EasingFunctions> | 'custom'
