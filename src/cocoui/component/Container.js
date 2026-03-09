import UIComponent from '../core/UIComponent'

/**
 * 容器组件 - 可以包含其他组件的基础容器
 */
export default class Container extends UIComponent {
  constructor() {
    super()
    this.name = 'Container'
    this._backgroundColor = null
    this._borderColor = null
    this._borderWidth = 0
    this._cornerRadius = 0
  }

  //--------------------------------------------------------------------------
  // Properties
  //--------------------------------------------------------------------------

  get backgroundColor() {
    return this._backgroundColor
  }

  set backgroundColor(value) {
    if (this._backgroundColor === value) return
    this._backgroundColor = value
    this.invalidateSkin()
  }

  get borderColor() {
    return this._borderColor
  }

  set borderColor(value) {
    if (this._borderColor === value) return
    this._borderColor = value
    this.invalidateSkin()
  }

  get borderWidth() {
    return this._borderWidth
  }

  set borderWidth(value) {
    if (this._borderWidth === value) return
    this._borderWidth = value
    this.invalidateSkin()
  }

  get cornerRadius() {
    return this._cornerRadius
  }

  set cornerRadius(value) {
    if (this._cornerRadius === value) return
    this._cornerRadius = value
    this.invalidateSkin()
  }

  //--------------------------------------------------------------------------
  // Methods
  //--------------------------------------------------------------------------

  drawSkin(context) {
    context.save()

    // 绘制背景
    if (this._backgroundColor) {
      context.fillStyle = this._backgroundColor
      if (this._cornerRadius > 0) {
        this._drawRoundRect(context, 0, 0, this.width, this.height, this._cornerRadius)
        context.fill()
      } else {
        context.fillRect(0, 0, this.width, this.height)
      }
    }

    // 绘制边框
    if (this._borderColor && this._borderWidth > 0) {
      context.strokeStyle = this._borderColor
      context.lineWidth = this._borderWidth
      if (this._cornerRadius > 0) {
        this._drawRoundRect(context, 0, 0, this.width, this.height, this._cornerRadius)
        context.stroke()
      } else {
        context.strokeRect(0, 0, this.width, this.height)
      }
    }

    context.restore()
  }

  _drawRoundRect(context, x, y, width, height, radius) {
    context.beginPath()
    context.moveTo(x + radius, y)
    context.lineTo(x + width - radius, y)
    context.quadraticCurveTo(x + width, y, x + width, y + radius)
    context.lineTo(x + width, y + height - radius)
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    context.lineTo(x + radius, y + height)
    context.quadraticCurveTo(x, y + height, x, y + height - radius)
    context.lineTo(x, y + radius)
    context.quadraticCurveTo(x, y, x + radius, y)
    context.closePath()
  }
}
