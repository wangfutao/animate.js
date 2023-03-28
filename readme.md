# Animate.js

**三维缓动函数动画 · 特性**
- 支持给任意HTML元素添加动画
- 支持给一个动画添加多个规则
- 支持自定义缓动函数（缓动函数参考[https://easings.net](https://easings.net)）
- 默认使用requestAnimationFrame来执行动画，同时支持使用CSS的@keyframes来执行动画
- CSS的@keyframes使用transform: matrix3d()来执行，不被js主线程的阻塞
- 支持导出所有的动画关键帧，可用于canvas、WebGL中的对象做矩阵变换
- 后续加入对vue、react的支持

----

#### <u>更多使用文档稍后更新...</u>

----

### Quick start

### **1. 通过npm安装**
```
  npm i @wangft/animate.js
```

### **2. 使用方法**
```js
  //import 
  import {Animate} from "@wangft/animate.js";
```
```js
  //step1: 创建一个Animate对象
  const animate = new Animate();
  
  //step2: 添加动画规则
  animate.addRule({
    easingFunction: 'easeOutElastic',
    type: "translate",
    direction: 'x',
    from: -50,
    to: 0
  });
  

  //step3: 获取目标HTMLElement对象，比如一个div
  const div = this.div;
  
  //step4: 执行动画，持续1000ms
  animate.run(div, 1000);
```
### **3. 动画规则参数解释**
``` js
easingFunction: 缓动曲线名称，参考下图
type: 动画类型
  - 平移translate
  - 旋转rotate
  - 缩放scale
direction: 方向，支持x、y、z
  - 当type为translate时，表示平移的方向，必选x、y、z
  - 当type为rotate时，表示旋转轴，可选x、y或z，不传默认为z，表示绕z轴旋转
  - 当type为scale时，表示缩放的方向，可选x、y或z，不传默认为x+y+z，表示x、y、z三个方向同时缩放，目前只支持单选
from: 动画的起点
  - 当type为translate时，单位为px，元素初始状态为0，左负右正，上负下正
  - 当type为rotate时，单位为弧度，元素初始状态为0，顺时针方向为正方向
  - 当type为scale时，无单位，表示缩放比例，元素初始状态为1
to: 动画的终点
  -同from
```
#### 更多的使用方法及示例请查看：<u>Docs(待更新)</u>

Animate.js内置的部分缓动曲线，参考[https://easings.net](https://easings.net)

![](https://wangft.cn/upload-imgs/8937a21a0a6717df243276400.png)
