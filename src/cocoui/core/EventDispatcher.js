export default class EventDispatcher {
  constructor() {
    this._listeners = new Map()
  }

  /**
   * 添加事件监听器
   * @param {string} type - 事件类型
   * @param {Function} listener - 监听器函数
   * @param {boolean} [useCapture=false] - 是否在捕获阶段触发
   */
  addEventListener(type, listener, useCapture = false) {
    if (!this._listeners.has(type)) {
      this._listeners.set(type, [])
    }
    const listeners = this._listeners.get(type)
    if (!listeners.some(l => l.listener === listener && l.useCapture === useCapture)) {
      listeners.push({ listener, useCapture })
    }
  }

  /**
   * 移除事件监听器
   * @param {string} type - 事件类型
   * @param {Function} listener - 监听器函数
   * @param {boolean} [useCapture=false] - 是否在捕获阶段触发
   */
  removeEventListener(type, listener, useCapture = false) {
    if (!this._listeners.has(type)) return
    const listeners = this._listeners.get(type)
    const index = listeners.findIndex(l => l.listener === listener && l.useCapture === useCapture)
    if (index !== -1) {
      listeners.splice(index, 1)
    }
  }

  /**
   * 派发事件
   * @param {Event} event - 事件对象
   * @returns {boolean} - 是否阻止默认行为
   */
  dispatchEvent(event) {
    event.target = this
    
    // 捕获阶段
    if (!this._dispatchPhase(event, true)) {
      return false
    }
    
    // 冒泡阶段
    if (!this._dispatchPhase(event, false)) {
      return false
    }
    
    return !event.defaultPrevented
  }

  _dispatchPhase(event, useCapture) {
    if (!this._listeners.has(event.type)) return true
    
    const listeners = this._listeners.get(event.type)
    const phaseListeners = listeners.filter(l => l.useCapture === useCapture)
    
    for (const { listener } of phaseListeners) {
      listener.call(this, event)
      if (event._stopImmediatePropagation) {
        return false
      }
    }
    
    return !event._stopPropagation
  }

  /**
   * 是否有指定类型的监听器
   * @param {string} type - 事件类型
   * @returns {boolean}
   */
  hasEventListener(type) {
    return this._listeners.has(type) && this._listeners.get(type).length > 0
  }

  /**
   * 简写的添加事件监听
   * @param {string} type - 事件类型
   * @param {Function} listener - 监听器
   */
  on(type, listener) {
    this.addEventListener(type, listener)
  }

  /**
   * 简写的移除事件监听
   * @param {string} type - 事件类型
   * @param {Function} listener - 监听器
   */
  off(type, listener) {
    this.removeEventListener(type, listener)
  }

  /**
   * 简写的派发事件
   * @param {string} type - 事件类型
   * @param {Object} [data] - 事件数据
   */
  emit(type, data = {}) {
    const event = new Event(type, data)
    this.dispatchEvent(event)
  }

  /**
   * 添加一次性事件监听
   * @param {string} type - 事件类型
   * @param {Function} listener - 监听器
   */
  once(type, listener) {
    const onceWrapper = (event) => {
      this.removeEventListener(type, onceWrapper)
      listener.call(this, event)
    }
    this.addEventListener(type, onceWrapper)
  }
}

/**
 * 事件类
 */
export class Event {
  constructor(type, data = {}) {
    this.type = type
    this.target = null
    this.currentTarget = null
    this.data = data
    this._stopPropagation = false
    this._stopImmediatePropagation = false
    this.defaultPrevented = false
    this.timeStamp = Date.now()
  }

  /**
   * 阻止事件冒泡
   */
  stopPropagation() {
    this._stopPropagation = true
  }

  /**
   * 立即停止事件传播
   */
  stopImmediatePropagation() {
    this._stopImmediatePropagation = true
    this._stopPropagation = true
  }

  /**
   * 阻止默认行为
   */
  preventDefault() {
    this.defaultPrevented = true
  }
}
