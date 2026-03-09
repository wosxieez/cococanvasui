import EventDispatcher, { Event } from './EventDispatcher'

/**
 * 鼠标事件类
 */
export class MouseEvent extends Event {
  static CLICK = 'click'
  static DOUBLE_CLICK = 'doubleClick'
  static MOUSE_DOWN = 'mouseDown'
  static MOUSE_UP = 'mouseUp'
  static MOUSE_MOVE = 'mouseMove'
  static MOUSE_OVER = 'mouseOver'
  static MOUSE_OUT = 'mouseOut'
  static MOUSE_WHEEL = 'mouseWheel'

  constructor(type, x, y, button = 0, ctrlKey = false, shiftKey = false, altKey = false, metaKey = false) {
    super(type)
    this.x = x
    this.y = y
    this.button = button
    this.ctrlKey = ctrlKey
    this.shiftKey = shiftKey
    this.altKey = altKey
    this.metaKey = metaKey
  }
}

/**
 * 触摸事件类
 */
export class TouchEvent extends Event {
  static TOUCH_BEGIN = 'touchBegin'
  static TOUCH_END = 'touchEnd'
  static TOUCH_MOVE = 'touchMove'
  static TOUCH_TAP = 'touchTap'
  static TOUCH_DOUBLE_TAP = 'touchDoubleTap'

  constructor(type, touches, changedTouches, targetTouches) {
    super(type)
    this.touches = touches || []
    this.changedTouches = changedTouches || []
    this.targetTouches = targetTouches || []
  }
}

/**
 * 交互管理器 - 处理鼠标和触摸事件
 */
export default class InteractionManager extends EventDispatcher {
  constructor(application) {
    super()
    this.application = application
    this.canvas = application.context.canvas
    this.mouseX = 0
    this.mouseY = 0
    this.isMouseDown = false
    this.mouseDownTarget = null
    this.overTarget = null
    this._touchMap = new Map()
    this._doubleClickDelay = 300
    this._lastClickTime = 0
    this._clickCount = 0

    this._initListeners()
  }

  _initListeners() {
    const canvas = this.canvas

    // 鼠标事件
    canvas.addEventListener('mousedown', this._onMouseDown.bind(this))
    canvas.addEventListener('mouseup', this._onMouseUp.bind(this))
    canvas.addEventListener('mousemove', this._onMouseMove.bind(this))
    canvas.addEventListener('mouseout', this._onMouseOut.bind(this))
    canvas.addEventListener('wheel', this._onMouseWheel.bind(this))

    // 触摸事件
    canvas.addEventListener('touchstart', this._onTouchStart.bind(this), { passive: false })
    canvas.addEventListener('touchend', this._onTouchEnd.bind(this), { passive: false })
    canvas.addEventListener('touchmove', this._onTouchMove.bind(this), { passive: false })
    canvas.addEventListener('touchcancel', this._onTouchCancel.bind(this), { passive: false })

    // 上下文菜单
    canvas.addEventListener('contextmenu', (e) => e.preventDefault())
  }

  _getMousePosition(event) {
    const rect = this.canvas.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  }

  _getTouchPosition(touch) {
    const rect = this.canvas.getBoundingClientRect()
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    }
  }

  _hitTest(x, y) {
    return this._hitTestRecursive(this.application, x, y)
  }

  _hitTestRecursive(component, x, y) {
    if (!component.visible) return null

    // 逆序遍历子组件（后渲染的在上面）
    for (let i = component.children.length - 1; i >= 0; i--) {
      const child = component.children[i]
      const hit = this._hitTestRecursive(child, x, y)
      if (hit) return hit
    }

    if (component.hitTestPoint) {
      return component.hitTestPoint(x, y) ? component : null
    }

    // 默认矩形碰撞检测
    if (x >= component.x && x <= component.x + component.width &&
        y >= component.y && y <= component.y + component.height) {
      return component
    }

    return null
  }

  _onMouseDown(event) {
    const pos = this._getMousePosition(event)
    this.mouseX = pos.x
    this.mouseY = pos.y
    this.isMouseDown = true

    const target = this._hitTest(pos.x, pos.y)
    this.mouseDownTarget = target

    if (target) {
      const mouseEvent = new MouseEvent(
        MouseEvent.MOUSE_DOWN,
        pos.x - target.x,
        pos.y - target.y,
        event.button,
        event.ctrlKey,
        event.shiftKey,
        event.altKey,
        event.metaKey
      )
      target.dispatchEvent(mouseEvent)
    }
  }

  _onMouseUp(event) {
    const pos = this._getMousePosition(event)
    this.isMouseDown = false

    const target = this._hitTest(pos.x, pos.y)

    if (this.mouseDownTarget) {
      const mouseEvent = new MouseEvent(
        MouseEvent.MOUSE_UP,
        pos.x - this.mouseDownTarget.x,
        pos.y - this.mouseDownTarget.y,
        event.button,
        event.ctrlKey,
        event.shiftKey,
        event.altKey,
        event.metaKey
      )
      this.mouseDownTarget.dispatchEvent(mouseEvent)
    }

    // 检测点击
    if (target && target === this.mouseDownTarget) {
      const clickEvent = new MouseEvent(
        MouseEvent.CLICK,
        pos.x - target.x,
        pos.y - target.y,
        event.button,
        event.ctrlKey,
        event.shiftKey,
        event.altKey,
        event.metaKey
      )
      target.dispatchEvent(clickEvent)

      // 双击检测
      const now = Date.now()
      if (now - this._lastClickTime < this._doubleClickDelay) {
        const doubleClickEvent = new MouseEvent(
          MouseEvent.DOUBLE_CLICK,
          pos.x - target.x,
          pos.y - target.y,
          event.button,
          event.ctrlKey,
          event.shiftKey,
          event.altKey,
          event.metaKey
        )
        target.dispatchEvent(doubleClickEvent)
        this._clickCount = 0
      } else {
        this._clickCount = 1
      }
      this._lastClickTime = now
    }

    this.mouseDownTarget = null
  }

  _onMouseMove(event) {
    const pos = this._getMousePosition(event)
    this.mouseX = pos.x
    this.mouseY = pos.y

    const target = this._hitTest(pos.x, pos.y)

    // 处理 mouseOver/mouseOut
    if (target !== this.overTarget) {
      if (this.overTarget) {
        const outEvent = new MouseEvent(
          MouseEvent.MOUSE_OUT,
          pos.x - this.overTarget.x,
          pos.y - this.overTarget.y,
          event.button,
          event.ctrlKey,
          event.shiftKey,
          event.altKey,
          event.metaKey
        )
        this.overTarget.dispatchEvent(outEvent)
      }

      if (target) {
        const overEvent = new MouseEvent(
          MouseEvent.MOUSE_OVER,
          pos.x - target.x,
          pos.y - target.y,
          event.button,
          event.ctrlKey,
          event.shiftKey,
          event.altKey,
          event.metaKey
        )
        target.dispatchEvent(overEvent)
      }

      this.overTarget = target
    }

    // 派发 mouseMove
    if (target) {
      const moveEvent = new MouseEvent(
        MouseEvent.MOUSE_MOVE,
        pos.x - target.x,
        pos.y - target.y,
        event.button,
        event.ctrlKey,
        event.shiftKey,
        event.altKey,
        event.metaKey
      )
      target.dispatchEvent(moveEvent)
    }
  }

  _onMouseOut(event) {
    if (this.overTarget) {
      const pos = this._getMousePosition(event)
      const outEvent = new MouseEvent(
        MouseEvent.MOUSE_OUT,
        pos.x - this.overTarget.x,
        pos.y - this.overTarget.y
      )
      this.overTarget.dispatchEvent(outEvent)
      this.overTarget = null
    }
  }

  _onMouseWheel(event) {
    const pos = this._getMousePosition(event)
    const target = this._hitTest(pos.x, pos.y)

    if (target) {
      const wheelEvent = new MouseEvent(
        MouseEvent.MOUSE_WHEEL,
        pos.x - target.x,
        pos.y - target.y
      )
      wheelEvent.deltaX = event.deltaX
      wheelEvent.deltaY = event.deltaY
      wheelEvent.deltaZ = event.deltaZ
      wheelEvent.deltaMode = event.deltaMode
      target.dispatchEvent(wheelEvent)
    }

    event.preventDefault()
  }

  _onTouchStart(event) {
    event.preventDefault()
    const touches = Array.from(event.changedTouches).map(touch => ({
      identifier: touch.identifier,
      ...this._getTouchPosition(touch)
    }))

    for (const touch of touches) {
      this._touchMap.set(touch.identifier, { x: touch.x, y: touch.y })
      const target = this._hitTest(touch.x, touch.y)

      if (target) {
        const touchEvent = new TouchEvent(
          TouchEvent.TOUCH_BEGIN,
          touches,
          touches,
          touches
        )
        target.dispatchEvent(touchEvent)
      }
    }
  }

  _onTouchEnd(event) {
    event.preventDefault()
    const touches = Array.from(event.changedTouches).map(touch => ({
      identifier: touch.identifier,
      ...this._getTouchPosition(touch)
    }))

    for (const touch of touches) {
      const startPos = this._touchMap.get(touch.identifier)
      this._touchMap.delete(touch.identifier)

      const target = this._hitTest(touch.x, touch.y)

      if (target) {
        const touchEvent = new TouchEvent(
          TouchEvent.TOUCH_END,
          touches,
          touches,
          touches
        )
        target.dispatchEvent(touchEvent)

        // 检测点击
        if (startPos) {
          const dx = touch.x - startPos.x
          const dy = touch.y - startPos.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 10) { // 10像素容差
            const tapEvent = new TouchEvent(
              TouchEvent.TOUCH_TAP,
              touches,
              touches,
              touches
            )
            target.dispatchEvent(tapEvent)
          }
        }
      }
    }
  }

  _onTouchMove(event) {
    event.preventDefault()
    const touches = Array.from(event.changedTouches).map(touch => ({
      identifier: touch.identifier,
      ...this._getTouchPosition(touch)
    }))

    for (const touch of touches) {
      this._touchMap.set(touch.identifier, { x: touch.x, y: touch.y })
      const target = this._hitTest(touch.x, touch.y)

      if (target) {
        const touchEvent = new TouchEvent(
          TouchEvent.TOUCH_MOVE,
          touches,
          touches,
          touches
        )
        target.dispatchEvent(touchEvent)
      }
    }
  }

  _onTouchCancel(event) {
    const touches = Array.from(event.changedTouches).map(touch => ({
      identifier: touch.identifier,
      ...this._getTouchPosition(touch)
    }))

    for (const touch of touches) {
      this._touchMap.delete(touch.identifier)
    }
  }
}
