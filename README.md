# CocoUI

基于 HTML5 Canvas 的轻量级 UI 框架，提供类似 DOM 的组件化开发体验。

## 特性

- **组件化架构** - 基于继承的组件系统，易于扩展
- **事件系统** - 完整的事件分发机制，支持鼠标和触摸事件
- **自动布局** - VBox、HBox 等布局容器
- **动画系统** - 内置缓动函数和补间动画
- **样式主题** - 支持自定义主题和样式
- **响应式渲染** - 基于失效-验证模式的性能优化
- **TypeScript 友好** - 良好的类型支持

## 安装

```bash
npm install
```

## 开发

```bash
npm run dev
```

启动开发服务器，打开 http://localhost:8080

## 构建

```bash
npm run build
```

## 快速开始

```javascript
import { Application, Button, Label } from 'cocoui'

// 创建应用
const app = new Application()
app.width = 800
app.height = 600
app.backgroundColor = '#f5f5f5'
app.initialize()

// 添加标签
const label = new Label()
label.text = 'Hello CocoUI!'
label.x = 50
label.y = 50
label.fontSize = 24
app.addChild(label)

// 添加按钮
const button = new Button()
button.label = '点击我'
button.x = 50
button.y = 100
button.on('click', () => {
  label.text = '按钮被点击了!'
})
app.addChild(button)
```

## 核心概念

### 组件生命周期

1. **createChildren()** - 创建子组件
2. **commitProperties()** - 提交属性变更
3. **updateDisplayList()** - 更新布局
4. **drawSkin()** - 绘制外观

### 失效-验证模式

当组件属性改变时，会标记为"失效"，在下一帧统一验证和更新：

```javascript
component.invalidateProperties()  // 属性失效
component.invalidateDisplayList() // 布局失效
component.invalidateSkin()        // 外观失效
```

### 事件系统

```javascript
// 监听事件
button.on('click', (event) => {
  console.log('按钮被点击')
})

// 一次性监听
button.once('click', (event) => {
  console.log('只触发一次')
})

// 移除监听
button.off('click', handler)
```

## 组件

### 基础组件

- **UIComponent** - 所有组件的基类
- **Container** - 基础容器
- **Label** - 文本标签
- **Button** - 按钮
- **TextInput** - 文本输入框
- **Image** - 图片
- **Panel** - 面板（带标题栏）

### 布局

- **VBox** - 垂直布局
- **HBox** - 水平布局

### 动画

```javascript
import { Tween, Easing } from 'cocoui'

// 基础动画
Tween.to(component, { x: 100 }, 500, { easing: Easing.quadOut })

// 链式动画
Tween.to(component, { x: 100 }, 500)
  .chain(Tween.to(component, { y: 100 }, 500))

// 弹性动画
Tween.to(component, { scaleX: 1.5 }, 800, { easing: Easing.elasticOut })
```

## 主题

```javascript
import { Theme } from 'cocoui'

// 注册自定义主题
Theme.register('myTheme', {
  Button: {
    backgroundColor: '#ff6b6b',
    textColor: '#ffffff'
  }
})

// 应用主题
Theme.apply('myTheme')
```

## 项目结构

```
src/
├── cocoui/
│   ├── core/              # 核心类
│   │   ├── Application.js
│   │   ├── UIComponent.js
│   │   ├── EventDispatcher.js
│   │   ├── InteractionManager.js
│   │   └── CallLaterMethod.js
│   ├── component/         # UI组件
│   │   ├── Button.js
│   │   ├── Container.js
│   │   ├── Label.js
│   │   ├── Panel.js
│   │   ├── Image.js
│   │   └── TextInput.js
│   ├── layout/            # 布局
│   │   ├── VBox.js
│   │   └── HBox.js
│   ├── animation/         # 动画
│   │   └── Tween.js
│   └── styles/            # 样式
│       └── Theme.js
└── index.js
```

## API 文档

### UIComponent

| 属性 | 类型 | 描述 |
|------|------|------|
| x | number | X坐标 |
| y | number | Y坐标 |
| width | number | 宽度 |
| height | number | 高度 |
| visible | boolean | 是否可见 |
| alpha | number | 透明度(0-1) |
| rotation | number | 旋转角度 |
| scaleX | number | X轴缩放 |
| scaleY | number | Y轴缩放 |

### Button

| 属性 | 类型 | 描述 |
|------|------|------|
| label | string | 按钮文本 |
| enabled | boolean | 是否可用 |
| backgroundColor | string | 背景颜色 |
| textColor | string | 文本颜色 |
| cornerRadius | number | 圆角半径 |

### Label

| 属性 | 类型 | 描述 |
|------|------|------|
| text | string | 文本内容 |
| fontSize | number | 字体大小 |
| fontFamily | string | 字体族 |
| textColor | string | 文本颜色 |
| textAlign | string | 水平对齐(left/center/right) |
| verticalAlign | string | 垂直对齐(top/middle/bottom) |

## 示例

运行 `npm run dev` 查看完整示例，包括：

- 按钮交互
- 输入框使用
- 动画效果
- 布局展示

## 许可证

MIT
