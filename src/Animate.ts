import {EasingFunctions} from "./EasingFunctions";
import {CSSKeyframesRuleUtil} from "./CSSKeyframesRuleUtil";
import {AnimateRule, AnimateRuleParams} from "./AnimateRule";
import {TransformMatrix3D} from "./TransformMatrix3D";
import {RandomString} from "./RandomString";
import {MatrixKeyframes} from "./MatrixKeyframes";

export class Animate {

    /**
     * 动画ID，用来生成css @keyframes时使用
     * @private
     */
    private _id: string = new RandomString().toString();

    /**
     * 动画规则
     * @private
     */
    private _animateRules: AnimateRule[] = [];

    /**
     * 是否开启css动画优化，问题很大，暂未使用
     * @private
     */
    private _enableOptimizeCSSKeyframes: boolean = false;

    /**
     * css @keyframes中百分比的步长，值越小越动画越流畅，但是性能开销会更大
     * @private
     */
    private _cssKeyframeProgressStep: number = 0.004;

    /**
     * 缓存
     * @private
     */
    private _cachedMatrixKeyframes: Record<string, MatrixKeyframes> = {};

    /**
     * 添加动画规则
     * @param animateRule
     */
    addRule(animateRule: AnimateRuleParams | AnimateRule) {
        if (animateRule instanceof AnimateRule) {
            if (animateRule.type == 'translate') {
                this._animateRules = [animateRule, ...this._animateRules];
            } else {
                this._animateRules.push(animateRule);
            }

        } else {
            if (animateRule.type == 'translate') {
                this._animateRules = [new AnimateRule(animateRule), ...this._animateRules];
            } else {
                this._animateRules.push(new AnimateRule(animateRule));
            }
        }
        return this;
    }

    /**
     * 执行动画
     * @param el 需要执行的元素
     * @param duration 持续时长，单位ms
     * @param animationIterationCount 执行次数，默认1次， 'infinite'表示一直执行下去
     * @param delay 延迟动画，单位ms，默认为0
     */
    run(el: HTMLElement, duration: number, animationIterationCount: number | 'infinite' = 1, delay: number = 0): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            const animateRules = this._animateRules;
            if (!animateRules || animateRules.length == 0) {
                resolve();
                return;
            }
            if (typeof animationIterationCount == 'string') {
                if (animationIterationCount != 'infinite') {
                    throw new Error('animationIterationCount必须是一个正整数或者\'infinite\'')
                }
            } else {
                if (animationIterationCount <= 0 || animationIterationCount != Math.floor(animationIterationCount)) {
                    throw new Error('animationIterationCount必须是一个正整数或者\'infinite\'')
                }
            }
            if (delay < 0) {
                throw new Error('delay不能为负数')
            }

            let count = 0;

            let animateLoop = () => {
                const t1 = new Date().getTime();
                let fn = () => {
                    const t2 = new Date().getTime();
                    let t = t2 - t1;

                    if (t > duration) {
                        let transformMatrix = this.executeAnimateRules(1);
                        el.style.transform = transformMatrix.matrixCssStr;

                        count = count + 1;
                        if (animationIterationCount == 'infinite' || count < animationIterationCount) {
                            animateLoop();
                            return;
                        }
                        resolve();
                        return;
                    }
                    t = t / duration;
                    let transformMatrix = this.executeAnimateRules(t);
                    el.style.transform = transformMatrix.matrixCssStr;
                    requestAnimationFrame(fn);

                }

                setTimeout(() => {
                    fn();
                }, delay)
            }
            animateLoop();
        })
    }

    /**
     * 执行动画，使用css的animation属性
     * @param el 需要执行的元素
     * @param duration 持续时长，单位ms
     * @param animationIterationCount 执行次数，默认1次， 'infinite'表示一直执行下去
     * @param delay 延迟动画，单位ms，默认为0
     */
    runWithCSS(el: HTMLElement, duration: number, animationIterationCount: number | 'infinite' = 1, delay: number = 0) {
        const animateRules = this._animateRules;
        if (!animateRules || animateRules.length == 0) {
            return;
        }
        if (typeof animationIterationCount == 'string') {
            if (animationIterationCount != 'infinite') {
                throw new Error('animationIterationCount必须是一个正整数或者\'infinite\'')
            }
        } else {
            if (animationIterationCount <= 0 || animationIterationCount != Math.floor(animationIterationCount)) {
                throw new Error('animationIterationCount必须是一个正整数或者\'infinite\'')
            }
        }
        if (delay < 0) {
            throw new Error('delay不能为负数')
        }


        let matrixKeyframes: MatrixKeyframes = this.execute(1, this.cssKeyframeProgressStep);


        let ruleName = `animatejs-${this._id}`;
        CSSKeyframesRuleUtil.addKeyFramesRuleByCSSMatrixKeyframe(ruleName, matrixKeyframes);

        setTimeout(() => {
            el.style.animation = `${ruleName} ${duration}ms`;

            let matrixKeyframe = matrixKeyframes.lastOne;
            el.style.transform = `${matrixKeyframe.transformMatrix.matrixCssStr}`;
            el.style.animationIterationCount = animationIterationCount + '';
        }, delay)
    }

    /**
     * 执行动画，返回时间戳和对应的变换矩阵
     * @param duration 持续时长，单位ms
     * @param tStep 时间间隔，单位ms，默认为16
     */
    execute(duration: number, tStep: number = 16): MatrixKeyframes {

        let key = `keyframes-d-${duration}-t-${tStep}`;
        if (this._cachedMatrixKeyframes[key]) {
            return this._cachedMatrixKeyframes[key];
        }

        let matrixKeyframes = new MatrixKeyframes();

        const animateRules = this._animateRules;
        if (!animateRules || animateRules.length == 0) {
            return matrixKeyframes;
        }

        for (let t = 0; t <= duration + 0.000001; t += tStep) {

            let transformMatrix = this.executeAnimateRules(t / duration);

            matrixKeyframes.add({
                progress: t,
                transformMatrix: transformMatrix.copy()
            });
        }

        this._cachedMatrixKeyframes[key] = matrixKeyframes;
        return matrixKeyframes;

    }

    /**
     * css动画优化，问题很大，暂未启用
     * @param matrixKeyframes
     * @private
     */
    private optimizeCSSKeyframes(matrixKeyframes: MatrixKeyframes): MatrixKeyframes {

        if (!matrixKeyframes || matrixKeyframes.length < 3) {
            return matrixKeyframes;
        }

        let optimizedKeyframes = new MatrixKeyframes();


        optimizedKeyframes.add(matrixKeyframes.firstOne);

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                for (let i = 1; i < matrixKeyframes.length - 1; i++) {
                    let m1 = matrixKeyframes.get(i - 1);
                    let m = matrixKeyframes.get(i);
                    let m2 = matrixKeyframes.get(i + 1);

                    let v1 = m1.transformMatrix.get(row, col);
                    let v = m.transformMatrix.get(row, col);
                    let v2 = m2.transformMatrix.get(row, col);

                    if ((v > v1 && v > v2) || (v < v1 && v < v2)) {
                        optimizedKeyframes.add(m);
                    }
                    if (v1 == v && v2 != v) {
                        optimizedKeyframes.add(m);
                    }

                    if (v2 == v && v1 != v) {
                        optimizedKeyframes.add(m);
                    }

                }
            }
        }
        optimizedKeyframes.add(matrixKeyframes.lastOne);

        optimizedKeyframes.sort();

        return optimizedKeyframes;
    }

    /**
     * 执行AnimateRules，传入时间进度：范围 0 ~ 1，返回当前进度的3维变换矩阵
     * @param t 传入时间进度：范围 0 ~ 1
     * @private
     */
    private executeAnimateRules(t: number): TransformMatrix3D {
        const animateRules = this._animateRules || [];

        let transformMatrix = new TransformMatrix3D();
        for (let animateRule of animateRules) {
            const easingFunctionName = animateRule.easingFunctionName;


            const type = animateRule.type;
            const direction = animateRule.direction;

            const from = animateRule.from;
            const to = animateRule.to;

            let value: number;
            if (easingFunctionName == 'custom') {
                const customFunction = animateRule.customEasingFunction;
                value = customFunction(t);
            } else {
                value = EasingFunctions[easingFunctionName](t);
            }

            value = from + (to - from) * value;

            let mat = new TransformMatrix3D();

            if (type == 'translate' && direction) {
                mat.translate(value, direction);
            } else if (type == 'scale') {
                mat.scale(value, direction);
            } else if (type == 'rotate') {
                mat.rotate(value, direction);
            }

            transformMatrix = transformMatrix.multiply(mat);
        }
        return transformMatrix;
    }


    get cssKeyframeProgressStep(): number {
        return this._cssKeyframeProgressStep;
    }

    set cssKeyframeProgressStep(value: number) {
        if (value < 0) {
            throw new Error('cssKeyframeProgressStep必须大于0')
        }
        if (value > 0.1) {
            throw new Error('cssKeyframeProgressStep必须小于等于0.1')
        }
        this._cssKeyframeProgressStep = value;
    }

    get enableOptimizeCSSKeyframes(): boolean {
        return this._enableOptimizeCSSKeyframes;
    }

    // set enableOptimizeCSSKeyframes(value: boolean) {
    //     this._enableOptimizeCSSKeyframes = value;
    // }
}
