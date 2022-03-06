import UIComponent from '../core/UIComponent'

export default class Application extends UIComponent {
  constructor() {
    super()

    this.name = 'Application'

    this._width = 800
    this._height = 600

    this.invalidateCallLaterFlag = false
    this.rendererTotalTime = 0
  }

  initialize() {
    super.initialize()

    this.application = this
  }

  //---------------------------------------------------------------------------------------------------------------------
  //
  // Call Later Code
  //
  //---------------------------------------------------------------------------------------------------------------------

  /**
   *
   * 下一帧执行函数
   *
   * @param method 函数
   * @param args 函数参数
   *
   */
  addedChildcallLater(method, ...args) {
    var clm = new CallLaterMethod()
    clm.method = method
    clm.args = args
    clm.caller = this

    this.pushCallLaterMethodToApplicationCallLaterMethods(clm)
    return clm
  }

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
      }, 1000)
    }
  }

  validateCallLater() {
    if (this.invalidateCallLaterFlag) {
      this.updateCallLater()
    }
  }

  updateCallLater() {
    console.log('updateCallLater')

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
}
