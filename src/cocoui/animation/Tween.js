import EventDispatcher from '../core/EventDispatcher'

/**
 * 缓动函数
 */
export const Easing = {
  // 线性
  linear: t => t,

  // 二次方
  quadIn: t => t * t,
  quadOut: t => t * (2 - t),
  quadInOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  // 三次方
  cubicIn: t => t * t * t,
  cubicOut: t => --t * t * t + 1,
  cubicInOut: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  // 四次方
  quartIn: t => t * t * t * t,
  quartOut: t => 1 - --t * t * t * t,
  quartInOut: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,

  // 正弦
  sineIn: t => 1 - Math.cos(t * Math.PI / 2),
  sineOut: t => Math.sin(t * Math.PI / 2),
  sineInOut: t => -(Math.cos(Math.PI * t) - 1) / 2,

  // 指数
  expoIn: t => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
  expoOut: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  expoInOut: t => {
    if (t === 0) return 0
    if (t === 1) return 1
    return t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2
  },

  // 弹性
  elasticIn: t => {
    if (t === 0) return 0
    if (t === 1) return 1
    return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI)
  },
  elasticOut: t => {
    if (t === 0) return 0
    if (t === 1) return 1
    return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1
  },
  elasticInOut: t => {
    if (t === 0) return 0
    if (t === 1) return 1
    return t < 0.5 ?
      -Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * Math.PI / 4.5) / 2 :
      Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * Math.PI / 4.5) / 2 + 1
  },

  // 回弹
  backIn: t => {
    const c1 = 1.70158
    const c3 = c1 + 1
    return c3 * t * t * t - c1 * t * t
  },
  backOut: t => {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  },
  backInOut: t => {
    const c1 = 1.70158
    const c2 = c1 * 1.525
    return t < 0.5 ?
      Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2) / 2 :
      (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2
  },

  // 弹跳
  bounceIn: t => 1 - Easing.bounceOut(1 - t),
  bounceOut: t => {
    const n1 = 7.5625
    const d1 = 2.75
    if (t < 1 / d1) {
      return n1 * t * t
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375
    }
  },
  bounceInOut: t => t < 0.5 ?
    (1 - Easing.bounceOut(1 - 2 * t)) / 2 :
    (1 + Easing.bounceOut(2 * t - 1)) / 2
}

/**
 * 动画类
 */
export class Tween extends EventDispatcher {
  static _tweens = []
  static _isRunning = false

  /**
   * 启动动画引擎
   */
  static start() {
    if (Tween._isRunning) return
    Tween._isRunning = true
    Tween._tick()
  }

  /**
   * 停止动画引擎
   */
  static stop() {
    Tween._isRunning = false
  }

  /**
   * 更新所有动画
   */
  static _tick() {
    if (!Tween._isRunning) return

    const now = performance.now()
    for (let i = Tween._tweens.length - 1; i >= 0; i--) {
      const tween = Tween._tweens[i]
      if (tween._update(now)) {
        Tween._tweens.splice(i, 1)
      }
    }

    if (Tween._tweens.length > 0) {
      requestAnimationFrame(Tween._tick)
    } else {
      Tween._isRunning = false
    }
  }

  /**
   * 创建并启动一个动画
   * @param {Object} target - 目标对象
   * @param {Object} to - 目标属性
   * @param {number} duration - 持续时间（毫秒）
   * @param {Object} options - 选项
   * @returns {Tween}
   */
  static to(target, to, duration, options = {}) {
    const tween = new Tween(target, to, duration, options)
    tween.start()
    return tween
  }

  /**
   * 从指定属性开始动画
   * @param {Object} target - 目标对象
   * @param {Object} from - 起始属性
   * @param {number} duration - 持续时间（毫秒）
   * @param {Object} options - 选项
   * @returns {Tween}
   */
  static from(target, from, duration, options = {}) {
    const tween = new Tween(target, options.to || {}, duration, options)
    tween._from = from
    tween.start()
    return tween
  }

  /**
   * 停止目标的所有动画
   * @param {Object} target - 目标对象
   */
  static killTweensOf(target) {
    for (let i = Tween._tweens.length - 1; i >= 0; i--) {
      if (Tween._tweens[i]._target === target) {
        Tween._tweens.splice(i, 1)
      }
    }
  }

  constructor(target, to, duration, options = {}) {
    super()
    this._target = target
    this._to = to
    this._duration = duration
    this._from = null
    this._easing = options.easing || Easing.quadOut
    this._delay = options.delay || 0
    this._onStart = options.onStart
    this._onUpdate = options.onUpdate
    this._onComplete = options.onComplete
    this._repeat = options.repeat || 0
    this._yoyo = options.yoyo || false

    this._startTime = 0
    this._isPlaying = false
    this._repeatCount = 0
    this._reversed = false
    this._startValues = {}
    this._changeValues = {}
  }

  /**
   * 启动动画
   */
  start() {
    if (this._isPlaying) return this

    this._isPlaying = true
    this._startTime = performance.now() + this._delay

    // 计算起始值和变化值
    for (const key in this._to) {
      if (this._from && key in this._from) {
        this._startValues[key] = this._from[key]
      } else {
        this._startValues[key] = this._target[key]
      }
      this._changeValues[key] = this._to[key] - this._startValues[key]
    }

    if (!Tween._isRunning) {
      Tween.start()
    }

    if (Tween._tweens.indexOf(this) === -1) {
      Tween._tweens.push(this)
    }

    this.emit('start')
    if (this._onStart) this._onStart()

    return this
  }

  /**
   * 停止动画
   */
  stop() {
    this._isPlaying = false
    const index = Tween._tweens.indexOf(this)
    if (index !== -1) {
      Tween._tweens.splice(index, 1)
    }
    return this
  }

  /**
   * 暂停动画
   */
  pause() {
    this._isPlaying = false
    this._pausedTime = performance.now()
    return this
  }

  /**
   * 恢复动画
   */
  resume() {
    if (!this._pausedTime) return this
    this._startTime += performance.now() - this._pausedTime
    this._pausedTime = null
    this._isPlaying = true
    if (!Tween._isRunning) {
      Tween.start()
    }
    return this
  }

  /**
   * 更新动画
   * @private
   */
  _update(now) {
    if (!this._isPlaying) return false

    if (now < this._startTime) return false

    let elapsed = (now - this._startTime) / this._duration
    elapsed = Math.min(1, Math.max(0, elapsed))

    const value = this._easing(this._reversed ? 1 - elapsed : elapsed)

    // 更新属性
    for (const key in this._to) {
      this._target[key] = this._startValues[key] + this._changeValues[key] * value
    }

    this.emit('update')
    if (this._onUpdate) this._onUpdate()

    if (elapsed === 1) {
      if (this._repeat === -1 || this._repeatCount < this._repeat) {
        this._repeatCount++
        if (this._yoyo) {
          this._reversed = !this._reversed
        }
        this._startTime = now
        return false
      }

      this._isPlaying = false
      this.emit('complete')
      if (this._onComplete) this._onComplete()
      return true
    }

    return false
  }

  /**
   * 链式调用
   * @param {Tween} tween - 下一个动画
   */
  chain(tween) {
    this.once('complete', () => tween.start())
    return this
  }
}

export default Tween
