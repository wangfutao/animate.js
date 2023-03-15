import {AnimateRuleDirection, AnimateRuleType, EasingFunctionName} from "./Types";

/**
 * 动画规则参数
 */
export interface AnimateRuleParams {
    /**
     * 缓动函数名，参考EasingFunctions.ts
     */
    easingFunction: EasingFunctionName;

    /**
     * 自定义缓动函数，当easingFunction为'custom'时执行此函数
     */
    customEasingFunction?: Function;

    /**
     * 动画类型，目前支持 平移：translate，旋转：rotate，缩放：scale
     */
    type: AnimateRuleType;

    /**
     * 当类型为translate时，表示平移的方向，必选x、y、z，参考TransformMatrix3D.ts中的translate方法
     * 当类型为rotate时，表示旋转轴，可选x、y、z，不传默认为z，表示绕z轴旋转，参考TransformMatrix3D.ts中的rotate方法
     * 当类型为scale时，表示缩放的方向，可选x、y、z，不传默认为x+y+z，表示x、y、z三个方向同时缩放，参考TransformMatrix3D.ts中的scale方法
     */
    direction?: AnimateRuleDirection;

    /**
     * 起点，必传
     * 当类型为translate时，表示平移的起始位置，未开始动画前元素当前的位置为：0
     * 当类型为rotate时，表示旋转的起始角度，未开始动画前元素当前的角度为：0
     * 当类型为scale时，表示缩放的起始缩放比例，未开始动画前元素当前的缩放比例为：1
     */
    from: number;

    /**
     * 终点，必选，参考from
     */
    to: number;

    /**
     * 角度单位使用度(°)，仅type为rotate时有效
     */
    useDegree?: boolean;
}


/**
 * 动画规则
 */
export class AnimateRule {
    private readonly _easingFunction?: EasingFunctionName;
    private readonly _customEasingFunction?: Function;
    private readonly _type?: AnimateRuleType;
    private readonly _direction?: AnimateRuleDirection;
    private readonly _from?: number;
    private readonly _to?: number;
    private readonly _useDegree: boolean = false;

    constructor(params: AnimateRuleParams) {
        this._easingFunction = params.easingFunction;
        if (params.easingFunction == 'custom'){
            if (!params.customEasingFunction || typeof params.customEasingFunction != 'function'){
                throw new Error('当easingFunction为custom时，必须设置一个有效的customEasingFunction函数，函数接收一个0~1的一个数字作为参数，返回一个0~1的值，具体请参考文档');
            }else {
                this._customEasingFunction = params.customEasingFunction;
            }
        }
        this._type = params.type;
        this._direction = params.direction;
        this._from = params.from;
        this._to = params.to;
        this._useDegree = params.useDegree == true;
    }

    get easingFunctionName(): EasingFunctionName {
        if (!this._easingFunction) {
            throw new Error('未设置easingFunction');
        }
        console.log()
        return this._easingFunction;
    }

    get type(): AnimateRuleType {
        if (!this._type) {
            throw new Error('暂未设置type');
        }
        return this._type;
    }

    get direction(): AnimateRuleDirection | undefined {
        if (this.type == 'translate' && !this._direction) {
            throw new Error('translate类型的动画必须设置direction')
        }
        return this._direction;
    }

    get from(): number {
        if (this._from == undefined) {
            throw new Error('暂未设置from参数');
        }
        if (this.useDegree && this._type == 'rotate'){
            //使用角度时需要把弧度转为角度
            return this._from * Math.PI / 180;
        }
        return this._from;
    }

    get to(): number {
        if (this._to == undefined) {
            throw new Error('暂未设置to参数');
        }
        if (this.useDegree && this._type == 'rotate'){
            //使用角度时需要把弧度转为角度
            return this._to * Math.PI / 180;
        }
        return this._to;
    }

    get useDegree(): boolean {
        return this._useDegree;
    }

    get customEasingFunction(): Function{
        if (!this._customEasingFunction || typeof this._customEasingFunction != 'function'){
            throw new Error('当easingFunction为custom时，必须设置一个有效的customEasingFunction函数，函数接收一个0~1的一个数字作为参数，返回一个0~1的值，具体请参考文档');
        }
        return this._customEasingFunction;
    }

}
