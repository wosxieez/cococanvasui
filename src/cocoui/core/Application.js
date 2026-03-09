import UIComponent from './UIComponent'
import InteractionManager from './InteractionManager'

export default class Application extends UIComponent {
  constructor() {
    super()

    this.name = 'Application'

    this._width = 800
    this._height = 600
    this._backgroundColor = '#ffffff'

    this.invalidateCallLaterFlag = false
    this.invalidateRenderFlag = false
  }

  initialize() {
    const canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height
    canvas.style.display = 'block'
    canvas.style.backgroundColor = this._backgroundColor
    document.body.appendChild(canvas)
    document.body.style.margin = '0'
    document.body.style.overflow = 'hidden'

    this.application = this
    this.context = canvas.getContext('2d')

    // 初始化交互管理器
    this.interactionManager = new InteractionManager(this)

    super.initialize()

    // 开始渲染循环
    this._startRenderLoop()
  }

  //---------------------------------------------------------------------------------------------------------------------
  //
  // Properties
  //
  //---------------------------------------------------------------------------------------------------------------------

  get backgroundColor() {
    return this._backgroundColor
  }

  set backgroundColor(value) {
    if (this._backgroundColor === value) return
    this._backgroundColor = value
    if (this.context && this.context.canvas) {
      this.context.canvas.style.backgroundColor = value
    }
    this.invalidateRender()
  }

  //---------------------------------------------------------------------------------------------------------------------
  //
  // Render Loop
  //
  //---------------------------------------------------------------------------------------------------------------------

  _startRenderLoop() {
    const loop = () => {
      this.render(this.context)
      requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
  }

  //---------------------------------------------------------------------------------------------------------------------
  //
  // Call Later Code
  //
  //---------------------------------------------------------------------------------------------------------------------

  pushCallLaterMethodToApplicationCallLaterMethods(callLaterMethod) {
    this.callLaterMethods.push(callLaterMethod)
    this.invalidateCallLater()
  }

  pushCallLaterMethodsToApplicationCallLaterMethods() {
    // UIComponent need push callLater methods to Application
    // Application self not need
  }

  invalidateCallLater() {
    if (this.initialized && !this.invalidateCallLaterFlag) {
      this.invalidateCallLaterFlag = true
      setTimeout(() => {
        this.validateCallLater()
      }, 0)
    }
  }

  validateCallLater() {
    if (this.invalidateCallLaterFlag) {
      this.updateCallLater()
    }
  }

  updateCallLater() {
    if (this.callLaterMethods.length === 0) return

    // 按优先级排序
    this.callLaterMethods.sort((a, b) => a.priority - b.priority)

    let callLaterMethod
    while (this.callLaterMethods.length > 0) {
      callLaterMethod = this.callLaterMethods.shift()
      if (process.env.NODE_ENV !== 'production') {
        console.log(callLaterMethod.caller.name, callLaterMethod.descript)
      }
      callLaterMethod.method.apply(callLaterMethod.caller, callLaterMethod.args)
    }

    this.invalidateCallLaterFlag = false
  }

  //---------------------------------------------------------------------------------------------------------------------
  //
  // Cycle Methods
  //
  //---------------------------------------------------------------------------------------------------------------------

  render(context) {
    // 清空画布
    context.clearRect(0, 0, this.width, this.height)

    // 绘制背景
    if (this._backgroundColor) {
      context.fillStyle = this._backgroundColor
      context.fillRect(0, 0, this.width, this.height)
    }

    super.render(context)
  }
}
