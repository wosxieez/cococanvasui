import UIComponent from '../core/UIComponent'

export default class Application extends UIComponent {
  constructor() {
    super()

    this.name = 'Application'

    this._width = 800
    this._height = 600

    this.invalidateCallLaterFlag = false
    this.invalidateRenderFlag = false
  }

  initialize() {
    const canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height
    document.body.appendChild(canvas)

    this.application = this
    this.context = canvas.getContext('2d')

    super.initialize()
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
    //	UIComponent need push callLater methods to Application
    //	Application self not need
  }

  /**
   * 延迟调用失效
   */
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
    if (this.callLaterMethods.length == 0) return
    var callLaterMethod
    while (this.callLaterMethods.length > 0) {
      callLaterMethod = this.callLaterMethods.shift()
      console.log(callLaterMethod.caller.name, callLaterMethod.descript)
      callLaterMethod.method.apply(callLaterMethod.caller, callLaterMethod.args)
    }

    // now invalidate flag false
    this.invalidateCallLaterFlag = false
  }

  //---------------------------------------------------------------------------------------------------------------------
  //
  // Cycle Methods
  //
  //---------------------------------------------------------------------------------------------------------------------

  render() {
    this.context.clearRect(this.x, this.y, this.width, this.height)
    super.render(this.context)
  }
}
