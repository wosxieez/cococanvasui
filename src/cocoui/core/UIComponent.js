import CallLaterMethod from './CallLaterMethod'
import EventDispatcher from './EventDispatcher'

export default class UIComponent extends EventDispatcher {
  constructor() {
    super()

    this.name = 'UIComponent'

    this._application = null
    this._x = 0
    this._y = 0
    this._width = 50
    this._height = 50
    this._visible = true
    this._alpha = 1
    this._rotation = 0
    this._scaleX = 1
    this._scaleY = 1

    this.children = []
    this.initialized = false
    this.invalidatePropertiesFlag = false
    this.invalidateDisplayListFlag = false
    this.invalidaetSkinFlag = false
    this.invalidateRenderFlag = false
    this.callLaterMethods = []
    this._parent = null
  }

  //---------------------------------------------------------------------------------------------------------------------
  //
  // Properties
  //
  //---------------------------------------------------------------------------------------------------------------------

  get x() {
    return this._x
  }

  set x(value) {
    value = Math.ceil(value)
    if (this._x === value) return

    this._x = value
    this.invalidateDisplayList()
    this.invalidateSkin()
  }

  get y() {
    return this._y
  }

  set y(value) {
    value = Math.ceil(value)
    if (this._y === value) return

    this._y = value
    this.invalidateDisplayList()
    this.invalidateSkin()
  }

  get width() {
    return this._width
  }

  set width(value) {
    value = Math.ceil(value)
    if (this._width === value) return

    this._width = value
    this.invalidateDisplayList()
    this.invalidateSkin()
  }

  get height() {
    return this._height
  }

  set height(value) {
    value = Math.ceil(value)
    if (this._height === value) return

    this._height = value
    this.invalidateDisplayList()
    this.invalidateSkin()
  }

  get visible() {
    return this._visible
  }

  set visible(value) {
    if (this._visible === value) return
    this._visible = value
    this.invalidateSkin()
  }

  get alpha() {
    return this._alpha
  }

  set alpha(value) {
    if (this._alpha === value) return
    this._alpha = Math.max(0, Math.min(1, value))
    this.invalidateSkin()
  }

  get rotation() {
    return this._rotation
  }

  set rotation(value) {
    if (this._rotation === value) return
    this._rotation = value
    this.invalidateDisplayList()
    this.invalidateSkin()
  }

  get scaleX() {
    return this._scaleX
  }

  set scaleX(value) {
    if (this._scaleX === value) return
    this._scaleX = value
    this.invalidateDisplayList()
    this.invalidateSkin()
  }

  get scaleY() {
    return this._scaleY
  }

  set scaleY(value) {
    if (this._scaleY === value) return
    this._scaleY = value
    this.invalidateDisplayList()
    this.invalidateSkin()
  }

  get application() {
    return this._application
  }

  set application(value) {
    if (this._application === value) return

    this._application = value

    this.pushCallLaterMethodsToApplicationCallLaterMethods()
    this.setChildrenApplication()
  }

  get parent() {
    return this._parent
  }

  set parent(value) {
    this._parent = value
  }

  get stage() {
    return this._application
  }

  //---------------------------------------------------------------------------------------------------------------------
  //
  // Transform
  //
  //---------------------------------------------------------------------------------------------------------------------

  /**
   * 将全局坐标转换为本地坐标
   * @param {number} globalX - 全局X坐标
   * @param {number} globalY - 全局Y坐标
   * @returns {Object} 本地坐标
   */
  globalToLocal(globalX, globalY) {
    let x = globalX
    let y = globalY
    let current = this

    while (current) {
      x -= current.x
      y -= current.y
      current = current.parent
    }

    return { x, y }
  }

  /**
   * 将本地坐标转换为全局坐标
   * @param {number} localX - 本地X坐标
   * @param {number} localY - 本地Y坐标
   * @returns {Object} 全局坐标
   */
  localToGlobal(localX, localY) {
    let x = localX
    let y = localY
    let current = this

    while (current) {
      x += current.x
      y += current.y
      current = current.parent
    }

    return { x, y }
  }

  //---------------------------------------------------------------------------------------------------------------------
  //
  // Hit Test
  //
  //---------------------------------------------------------------------------------------------------------------------

  /**
   * 检测点是否在组件内
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   * @returns {boolean}
   */
  hitTestPoint(x, y) {
    if (!this.visible || this.alpha <= 0) return false
    return x >= this.x && x <= this.x + this.width &&
           y >= this.y && y <= this.y + this.height
  }

  /**
   * 获取指定坐标处的子组件
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   * @returns {UIComponent|null}
   */
  getObjectUnderPoint(x, y) {
    if (!this.visible || this.alpha <= 0) return null

    for (let i = this.children.length - 1; i >= 0; i--) {
      const child = this.children[i]
      const result = child.getObjectUnderPoint(x - this.x, y - this.y)
      if (result) return result
    }

    return this.hitTestPoint(x, y) ? this : null
  }

  //---------------------------------------------------------------------------------------------------------------------
  //
  // Life Cycle
  //
  //---------------------------------------------------------------------------------------------------------------------

  initialize() {
    if (this.initialized) return

    this.createChildren()
    this.invalidatePropertiesInLifeCycle()
    this.invalidateDisplayListInLifeCycle()
    this.invalidateSkinInLifeCycle()

    this.initialized = true

    // 派发初始化完成事件
    this.emit('initialized')
  }

  createChildren() {
    // override code
  }

  invalidatePropertiesInLifeCycle() {
    if (!this.invalidatePropertiesFlag) {
      this.invalidatePropertiesFlag = true
      this.callLaterInLifeCycle(this.validateProperties, 0).descript = '[core] validateProperties()'
    }
  }

  invalidateDisplayListInLifeCycle() {
    if (!this.invalidateDisplayListFlag) {
      this.invalidateDisplayListFlag = true
      this.callLaterInLifeCycle(this.validateDisplayList, 2).descript = '[core] validateDisplayList()'
    }
  }

  invalidateSkinInLifeCycle() {
    if (!this.invalidaetSkinFlag) {
      this.invalidaetSkinFlag = true
      this.callLaterInLifeCycle(this.validateSkin, 3).descript = '[core] validateSkin()'
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
      this.callLater(this.validateDisplayList).descript = 'validateDisplayList()'
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

  validateNow() {
    this.validateProperties()
    this.validateDisplayList()
    this.validateSkin()
  }

  validateProperties() {
    if (this.invalidatePropertiesFlag) {
      this.invalidatePropertiesFlag = false
      this.commitProperties()
    }
  }

  validateDisplayList() {
    if (this.invalidateDisplayListFlag) {
      this.invalidateDisplayListFlag = false
      this.updateDisplayList()
    }
  }

  validateSkin() {
    if (this.invalidaetSkinFlag) {
      this.invalidaetSkinFlag = false
      if (this.application) this.application.invalidateRender()
    }
  }

  validateRender() {
    if (this.invalidateRenderFlag) {
      this.invalidateRenderFlag = false
      this.render()
    }
  }

  commitProperties() {
    // override code here
  }

  updateDisplayList() {
    // override code here
  }

  render(context) {
    if (!context || !this.visible || this.alpha <= 0) return

    context.save()
    
    // 应用变换
    context.translate(this.x, this.y)
    if (this.rotation !== 0) {
      context.rotate((this.rotation * Math.PI) / 180)
    }
    if (this.scaleX !== 1 || this.scaleY !== 1) {
      context.scale(this.scaleX, this.scaleY)
    }
    if (this.alpha !== 1) {
      context.globalAlpha = this.alpha
    }

    this.drawSkin(context)

    // 渲染子组件
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i]
      if (child instanceof UIComponent) {
        child.render(context)
      }
    }

    context.restore()
  }

  drawSkin(context) {
    context.lineWidth = 1
    context.strokeStyle = '#000000'
    context.strokeRect(0, 0, this.width, this.height)
  }

  //---------------------------------------------------------------------------------------------------------------------
  //
  // Methods
  //
  //---------------------------------------------------------------------------------------------------------------------

  setChildrenApplication() {
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i]
      if (child instanceof UIComponent) {
        child.application = this.application
      }
    }
  }

  //---------------------------------------------------------------------------------------------------------------------
  //
  // Call Later
  //
  //---------------------------------------------------------------------------------------------------------------------

  callLater(method, ...args) {
    const clm = new CallLaterMethod()
    clm.method = method
    clm.args = args
    clm.caller = this

    if (this.application) {
      this.application.pushCallLaterMethodToApplicationCallLaterMethods(clm)
    } else {
      this.callLaterMethods.push(clm)
    }

    return clm
  }

  callLaterInLifeCycle(method, index, ...args) {
    const clm = new CallLaterMethod()
    clm.method = method
    clm.args = args
    clm.caller = this
    this.callLaterMethods.splice(index, 0, clm)
    return clm
  }

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
  // Child Management
  //
  //---------------------------------------------------------------------------------------------------------------------

  addChild(child) {
    if (child instanceof UIComponent) {
      if (child.parent) {
        child.parent.removeChild(child)
      }
      this.children.push(child)
      child.parent = this
      child.initialize()
      child.application = this.application
      this.invalidateDisplayList()
    }
    return child
  }

  addChildAt(child, index) {
    if (child instanceof UIComponent) {
      if (child.parent) {
        child.parent.removeChild(child)
      }
      this.children.splice(index, 0, child)
      child.parent = this
      child.initialize()
      child.application = this.application
      this.invalidateDisplayList()
    }
    return child
  }

  removeChild(child) {
    if (child instanceof UIComponent) {
      const index = this.children.indexOf(child)
      if (index !== -1) {
        this.removeChildAt(index)
      }
    }
    return child
  }

  removeChildAt(index) {
    if (index >= 0 && index < this.children.length) {
      const child = this.children[index]
      child.parent = null
      child.application = null
      this.children.splice(index, 1)
      this.invalidateDisplayList()
      return child
    }
    return null
  }

  removeAllChildren() {
    while (this.children.length > 0) {
      this.removeChildAt(0)
    }
  }

  getChildAt(index) {
    if (index >= 0 && index < this.children.length) {
      return this.children[index]
    }
    return null
  }

  getChildIndex(child) {
    return this.children.indexOf(child)
  }

  contains(child) {
    return this.children.indexOf(child) !== -1
  }

  get numChildren() {
    return this.children.length
  }
}
