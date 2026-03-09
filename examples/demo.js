import { Application, Button, Label, VBox, HBox, Panel, TextInput, Tween, Easing } from '../src/index.js'

// 创建应用
const app = new Application()
app.width = 800
app.height = 600
app.backgroundColor = '#f5f5f5'
app.initialize()

// 创建主容器
const mainContainer = new VBox()
mainContainer.x = 20
mainContainer.y = 20
mainContainer.width = 760
mainContainer.height = 560
mainContainer.gap = 20
app.addChild(mainContainer)

// 标题
const title = new Label()
title.text = 'CocoUI Demo'
title.fontSize = 24
title.fontWeight = 'bold'
title.height = 40
mainContainer.addChild(title)

// 按钮示例区域
const buttonPanel = new Panel()
buttonPanel.title = '按钮示例'
buttonPanel.width = 760
buttonPanel.height = 150
mainContainer.addChild(buttonPanel)

const buttonContainer = new HBox()
buttonContainer.x = 10
buttonContainer.y = 10
buttonContainer.width = 740
buttonContainer.height = 100
buttonContainer.gap = 15
buttonContainer.verticalAlign = 'middle'
buttonPanel.contentContainer.addChild(buttonContainer)

// 普通按钮
const normalBtn = new Button()
normalBtn.label = '普通按钮'
normalBtn.on('click', () => console.log('普通按钮被点击'))
buttonContainer.addChild(normalBtn)

// 禁用按钮
const disabledBtn = new Button()
disabledBtn.label = '禁用按钮'
disabledBtn.enabled = false
buttonContainer.addChild(disabledBtn)

// 带动画的按钮
const animateBtn = new Button()
animateBtn.label = '点击我'
animateBtn.on('click', () => {
  Tween.to(animateBtn, { scaleX: 1.1, scaleY: 1.1 }, 100, { 
    easing: Easing.elasticOut,
    onComplete: () => {
      Tween.to(animateBtn, { scaleX: 1, scaleY: 1 }, 200, { easing: Easing.bounceOut })
    }
  })
})
buttonContainer.addChild(animateBtn)

// 样式自定义按钮
const customBtn = new Button()
customBtn.label = '自定义样式'
customBtn.backgroundColor = '#28a745'
customBtn.hoverBackgroundColor = '#218838'
customBtn.activeBackgroundColor = '#1e7e34'
customBtn.cornerRadius = 20
buttonContainer.addChild(customBtn)

// 输入框示例区域
const inputPanel = new Panel()
inputPanel.title = '输入框示例'
inputPanel.width = 760
inputPanel.height = 120
mainContainer.addChild(inputPanel)

const inputContainer = new VBox()
inputContainer.x = 10
inputContainer.y = 10
inputContainer.width = 740
inputContainer.height = 80
inputContainer.gap = 10
inputPanel.contentContainer.addChild(inputContainer)

const usernameInput = new TextInput()
usernameInput.width = 300
usernameInput.height = 36
usernameInput.placeholder = '请输入用户名'
inputContainer.addChild(usernameInput)

const passwordInput = new TextInput()
passwordInput.width = 300
passwordInput.height = 36
passwordInput.placeholder = '请输入密码'
inputContainer.addChild(passwordInput)

// 动画示例区域
const animationPanel = new Panel()
animationPanel.title = '动画示例'
animationPanel.width = 760
animationPanel.height = 200
mainContainer.addChild(animationPanel)

// 创建一个小方块用于动画演示
const animBox = new Panel()
animBox.width = 80
animBox.height = 80
animBox.backgroundColor = '#007bff'
animBox.cornerRadius = 8
animBox.x = 20
animBox.y = 60
animationPanel.contentContainer.addChild(animBox)

// 动画按钮
const animButtonRow = new HBox()
animButtonRow.x = 20
animButtonRow.y = 20
animButtonRow.width = 720
animButtonRow.height = 30
animButtonRow.gap = 10
animationPanel.contentContainer.addChild(animButtonRow)

// 移动动画
const moveBtn = new Button()
moveBtn.label = '移动'
moveBtn.width = 80
moveBtn.height = 30
moveBtn.on('click', () => {
  const targetX = animBox.x === 20 ? 400 : 20
  Tween.to(animBox, { x: targetX }, 500, { easing: Easing.cubicInOut })
})
animButtonRow.addChild(moveBtn)

// 旋转动画
const rotateBtn = new Button()
rotateBtn.label = '旋转'
rotateBtn.width = 80
rotateBtn.height = 30
rotateBtn.on('click', () => {
  Tween.to(animBox, { rotation: animBox.rotation + 360 }, 800, { easing: Easing.backOut })
})
animButtonRow.addChild(rotateBtn)

// 缩放动画
const scaleBtn = new Button()
scaleBtn.label = '缩放'
scaleBtn.width = 80
scaleBtn.height = 30
scaleBtn.on('click', () => {
  Tween.to(animBox, { scaleX: 1.5, scaleY: 1.5 }, 300, { 
    easing: Easing.quadOut,
    onComplete: () => {
      Tween.to(animBox, { scaleX: 1, scaleY: 1 }, 300, { easing: Easing.bounceOut })
    }
  })
})
animButtonRow.addChild(scaleBtn)

// 淡入淡出
const fadeBtn = new Button()
fadeBtn.label = '淡入淡出'
fadeBtn.width = 80
fadeBtn.height = 30
fadeBtn.on('click', () => {
  Tween.to(animBox, { alpha: 0.2 }, 500, { 
    easing: Easing.sineInOut,
    onComplete: () => {
      Tween.to(animBox, { alpha: 1 }, 500, { easing: Easing.sineInOut })
    }
  })
})
animButtonRow.addChild(fadeBtn)

// 弹性动画
const elasticBtn = new Button()
elasticBtn.label = '弹性'
elasticBtn.width = 80
elasticBtn.height = 30
elasticBtn.on('click', () => {
  Tween.to(animBox, { y: 100 }, 800, { easing: Easing.elasticOut })
    .chain(Tween.to(animBox, { y: 60 }, 400, { easing: Easing.quadIn }))
})
animButtonRow.addChild(elasticBtn)

// 连续动画
const sequenceBtn = new Button()
sequenceBtn.label = '连续'
sequenceBtn.width = 80
sequenceBtn.height = 30
sequenceBtn.on('click', () => {
  animBox.x = 20
  animBox.y = 60
  animBox.rotation = 0
  
  const t1 = Tween.to(animBox, { x: 300 }, 500, { easing: Easing.quadOut })
  const t2 = Tween.to(animBox, { y: 150 }, 500, { easing: Easing.quadOut })
  const t3 = Tween.to(animBox, { rotation: 180 }, 500, { easing: Easing.quadOut })
  const t4 = Tween.to(animBox, { x: 20, y: 60, rotation: 360 }, 800, { easing: Easing.bounceOut })
  
  t1.chain(t2)
  t2.chain(t3)
  t3.chain(t4)
  t1.start()
})
animButtonRow.addChild(sequenceBtn)

console.log('CocoUI Demo 已加载')
