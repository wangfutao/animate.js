import {MatrixKeyframe} from "./MatrixKeyframe";
import {MatrixKeyframes} from "./MatrixKeyframes";

/**
 * css的@keyframs工具类，用来添加@keyframs
 */
export class CSSKeyframesRuleUtil {
    static _styleSheets?: StyleSheetList;

    static get styleSheets() {
        if (!this._styleSheets) {
            this._styleSheets = document.styleSheets;
        }
        return this._styleSheets;
    }

    /**
     * 判断当前name的@keyframs是否存在于styleSheets中
     * @param name
     */
    static hasRule(name: string) {
        let styleSheets = this.styleSheets;

        let styleSheet = styleSheets[0];
        if (!styleSheet) return false;

        let cssRules = styleSheet.cssRules;
        if (!cssRules) return false;

        for (let cssRule of cssRules) {
            if (cssRule instanceof CSSKeyframesRule) {
                let cssKeyframesRule = cssRule as CSSKeyframesRule;
                if (name == cssKeyframesRule.name) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 添加一个动画@keyframs于styleSheets中
     * @param name
     * @param matrixKeyframes
     */
    static addKeyFramesRuleByCSSMatrixKeyframe(name: string, matrixKeyframes: MatrixKeyframes) {
        if (this.hasRule(name)) {
            // console.log(name, '已存在');
            return;
        }
        if (!matrixKeyframes || matrixKeyframes.length <= 0) {
            throw new Error('cssMatrixKeyframes为空');
        }

        let keyframesStr = ``;


        for (let i = 0; i < matrixKeyframes.length; i++) {
            const matrixKeyframe = matrixKeyframes.get(i);
            const progress = matrixKeyframe.progress;
            const transformMatrix = matrixKeyframe.transformMatrix;

            keyframesStr += `
               ${progress * 100}% {
                    transform: ${transformMatrix.matrixCssStr}
               }
            `
        }
        let rule = `@keyframes ${name} {${keyframesStr}}`;

        this.styleSheets[0].insertRule(rule);
    }
}

