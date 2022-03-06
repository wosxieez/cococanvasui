import CallLaterMethod from './CallLaterMethod'

export default class UIComponent {
  constructor() {
    this.name = 'UIComponent'

    this._application = null
    this._x = 0
    this._y = 0
    this._width = 50
    this._height = 50

    this.children = []
    this.initialized = false
    this.invalidatePropertiesFlag = false // 属性失效
    this.invalidateDisplayListFlag = false // 显示列表失效
    this.invalidaetSkinFlag = false // 皮肤失效
    this.invalidateRenderFlag = false // 渲染失效
    this.callLaterMethods = []
  }

  //---------------------------------------------------------------------------------------------------------------------
  //
  // Properties
  //
  //---------------------------------------------------------------------------------------------------------------------

  //---------------------
  //	x
  //---------------------

  get x() {
    return this._x
  }

  set x(value) {
    value = Math.ceil(value)
    if (this._x == value) return

    this._x = value

    this.invalidateDisplayList()
    this.invalidateSkin()
  }

  //---------------------
  //	y
  //---------------------

  get y() {
    return this._y
  }

  set y(value) {
    value = Math.ceil(value)
    if (this._y == value) return

    this._y = value

    this.invalidateDisplayList()
    this.invalidateSkin()
  }

  //---------------------
  //	width
  //---------------------
  get width() {
    return this._width
  }

  set width(value) {
    value = Math.ceil(value)
    if (this._width == value) return

    this._width = value

    this.invalidateDisplayList()
    this.invalidateSkin()
  }

  //---------------------
  //	height
  //---------------------

  get height() {
    return this._height
  }

  set height(value) {
    value = Math.ceil(value)
    if (this._height == value) return

    this._height = value

    this.invalidateDisplayList()
    this.invalidateSkin()
  }

  get application() {
    return this._application
  }

  set application(value) {
    if (this._application == value) return

    this._application = value

    this.pushCallLaterMethodsToApplicationCallLaterMethods()
    this.setChildrenApplication()
  }

  //---------------------------------------------------------------------------------------------------------------------
  //
  //	Life Cycle
  //
  //---------------------------------------------------------------------------------------------------------------------

  initialize() {
    if (this.initialized) return

    // Life Cycle
    this.createChildren()
    this.invalidatePropertiesInLifeCycle()
    this.invalidateDisplayListInLifeCycle()
    this.invalidateSkinInLifeCycle()

    this.initialized = true
  }

  createChildren() {
    // override code
  }

  //----------------------------------------
  //	Invalidate Methods
  //----------------------------------------
  /**
   * Only Call In Life Cycle
   */
  invalidatePropertiesInLifeCycle() {
    if (!this.invalidatePropertiesFlag) {
      this.invalidatePropertiesFlag = true
      this.callLaterInLifeCycle(this.validateProperties, 0).descript =
        '[core] validateProperties()'
    }
  }
  /**
   * Only Call In Life Cycle
   */
  invalidateDisplayListInLifeCycle() {
    if (!this.invalidateDisplayListFlag) {
      this.invalidateDisplayListFlag = true
      this.callLaterInLifeCycle(this.validateDisplayList, 2).descript =
        '[core] validateDisplayList()'
    }
  }
  /**
   * Only Call In Life Cycle
   */
  invalidateSkinInLifeCycle() {
    if (!this.invalidaetSkinFlag) {
      this.invalidaetSkinFlag = true
      this.callLaterInLifeCycle(this.validateSkin, 3).descript =
        '[core] validateSkin()'
    }
  }

  invalidateProperties() {
    if (!this.invalidatePropertiesFlag && this.initialized) {
      this.invalidatePropertiesFlag = true
      this.callLater(this.validateProperties).descript = 'validateProperties()'
    }
  }

  invalidateDisplayList() {
    if (!this.invalidateDisplayListFlag && this.initialized) {
      this.invalidateDisplayListFlag = true
      this.callLater(this.validateDisplayList).descript =
        'validateDisplayList()'
    }
  }

  invalidateSkin() {
    if (!this.invalidaetSkinFlag && this.initialized) {
      this.invalidaetSkinFlag = true
      this.callLater(this.validateSkin).descript = 'validateSkin()'
    }
  }

  invalidateRender() {
    if (!this.invalidateRenderFlag && this.initialized) {
      this.invalidateRenderFlag = true
      this.callLater(this.validateRender).descript = '[core] validateRender()'
    }
  }

  //----------------------------------------
  //	Validate Methods
  //----------------------------------------

  /**
   * 如果有失效方法，则立即生效方法</br>
   * call commitProperties now</br>
   * call updateDisplayList now</br>
   */
  validateNow() {
    this.validateProperties()
    this.validateDisplayList()
    this.validateSkin()
  }

  /**
   * call commitProperties now
   */
  validateProperties() {
    if (this.invalidatePropertiesFlag) {
      this.invalidatePropertiesFlag = false
      this.commitProperties()
    }
  }

  /**
   * call updateDisplayList now
   */
  validateDisplayList() {
    if (this.invalidateDisplayListFlag) {
      this.invalidateDisplayListFlag = false
      this.updateDisplayList()
    }
  }

  /**
   * call application invalidateRender now
   */
  validateSkin() {
    if (this.invalidaetSkinFlag) {
      this.invalidaetSkinFlag = false
      if (this.application) this.application.invalidateRender()
    }
  }

  /**
   * call render now
   */
  validateRender() {
    if (this.invalidateRenderFlag) {
      this.invalidateRenderFlag = false
      this.render()
    }
  }

  //----------------------------------------
  //	Real Methods
  //----------------------------------------
  /**
   * commitProperties
   */
  commitProperties() {
    // override code here
  }

  /**
   * update display list
   */
  updateDisplayList() {
    // override code here
  }

  /**
   * render
   */
  render(context) {
    if (!context) return

    this.drawSkin(context)

    var child
    for (var i = 0; i < this.children.length; i++) {
      child = this.children[i]
      if (child instanceof UIComponent) child.render(context)
    }
  }

  /**
   * draw skin
   */
  drawSkin(context) {
    context.lineWidth = 1
    context.strokeStyle = '#000000'
    context.strokeRect(this.x, this.y, this.width, this.height)
  }

  //---------------------------------------------------------------------------------------------------------------------
  //
  //	Methods
  //
  //---------------------------------------------------------------------------------------------------------------------

  /**
   * set each child 'application'
   */
  setChildrenApplication() {
    var child
    for (var i = 0; i < this.children.length; i++) {
      child = this.children[i]
      if (child instanceof UIComponent) child.application = application
    }
  }

  //---------------------------------------------------------------------------------------------------------------------
  //
  // Call Later
  //
  //---------------------------------------------------------------------------------------------------------------------

  /**
   *
   * 下一帧执行函数
   *
   * @param method 函数
   * @param flag 函数标记 callLater(test, 'test()')
   * @param args 函数参数
   *
   */
  callLater(method, ...args) {
    var clm = new CallLaterMethod()
    clm.method = method
    clm.args = args
    clm.caller = this

    // if 'application' not null, push method to 'application'
    // if 'application' null, push to 'callLaterMethods', When 'application' not null, push to 'application'
    if (this.application)
      this.application.pushCallLaterMethodToApplicationCallLaterMethods(clm)
    else this.callLaterMethods.push(clm)

    return clm
  }

  /**
   * 延迟调用 在生命周期中
   * 在生命周期中application总是为null, 所以保存到自己的callLaterMethods中去
   */
  callLaterInLifeCycle(method, index, ...args) {
    var clm = new CallLaterMethod()
    clm.method = method
    clm.args = args
    clm.caller = this
    this.callLaterMethods.splice(index, 0, clm)
    return clm
  }

  /**
   *  Push 'callLaterMethods' method to 'application' method
   */
  pushCallLaterMethodsToApplicationCallLaterMethods() {
    if (!this.application) return

    while (this.callLaterMethods.length > 0) {
      this.application.pushCallLaterMethodToApplicationCallLaterMethods(
        this.callLaterMethods.shift()
      )
    }
  }

  //---------------------------------------------------------------------------------------------------------------------
  //
  //	Added Removed Child
  //
  //---------------------------------------------------------------------------------------------------------------------

  /**
   * Add Child
   *
   * @param child
   * @return
   */
  addChild(child) {
    if (child instanceof UIComponent) {
      this.children.push(child)
      child.initialize()
      child.application = application
    }

    return child
  }
}
