# Animate.js

**三维函数动画 · 特性**
- 支持给任意HTML元素添加动画
- 支持给一个动画添加多个规则
- 支持自定义缓动函数（缓动函数参考[https://easings.net](https://easings.net)）
- 默认使用requestAnimationFrame来执行动画，同时支持使用CSS的@keyframes来执行动画
- CSS的@keyframes使用transform: matrix3d()来执行，不被js主线程的阻塞
- 支持导出所有的动画关键帧，可用于canvas、WebGL中的对象做矩阵变换

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
### **3. 动画规则解释**
``` js
easingFunction: 缓动曲线名称
type: 动画类型，平移translate，旋转rotate，缩放scale
direction: 方向，当type为translate时，direction为平移的方向，比如'x'为沿着x轴平移
from: 动画的起点
to: 动画的终点
```
#### 更多的使用方法及示例请查看：<u>Docs(待更新)</u>

Animate.js内置的部分缓动曲线，参考[https://easings.net](https://easings.net)

![](https://wangft.cn/upload-imgs/8937a21a0a6717df243276400.png)
