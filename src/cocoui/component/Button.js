import UIComponent from '../core/UIComponent'

/**
 * 按钮组件
 */
export default class Button extends UIComponent {
  constructor() {
    super()
    this.name = 'Button'

    // 默认大小
    this._width = 100
    this._height = 36

    // 文本属性
    this._label = 'Button'
    this._fontSize = 14
    this._fontFamily = 'Arial'
    this._fontWeight = 'normal'

    // 样式属性
    this._backgroundColor = '#007bff'
    this._textColor = '#ffffff'
    this._borderColor = null
    this._borderWidth = 0
    this._cornerRadius = 4

    // 状态样式
    this._hoverBackgroundColor = '#0056b3'
    this._hoverTextColor = '#ffffff'
    this._activeBackgroundColor = '#004494'
    this._activeTextColor = '#ffffff'
    this._disabledBackgroundColor = '#cccccc'
    this._disabledTextColor = '#666666'

    // 状态
    this._enabled = true
    this._isHover = false
    this._isActive = false

    this._initListeners()
  }

  //--------------------------------------------------------------------------
  // Properties
  //--------------------------------------------------------------------------

  get label() {
    return this._label
  }

  set label(value) {
    if (this._label === value) return
    this._label = String(value ?? '')
    this.invalidateSkin()
  }

  get fontSize() {
    return this._fontSize
  }

  set fontSize(value) {
    if (this._fontSize === value) return
    this._fontSize = value
    this.invalidateSkin()
  }

  get fontFamily() {
    return this._fontFamily
  }

  set fontFamily(value) {
    if (this._fontFamily === value) return
    this._fontFamily = value
    this.invalidateSkin()
  }

  get fontWeight() {
    return this._fontWeight
  }

  set fontWeight(value) {
    if (this._fontWeight === value) return
    this._fontWeight = value
    this.invalidateSkin()
  }

  get backgroundColor() {
    return this._backgroundColor
  }

  set backgroundColor(value) {
    if (this._backgroundColor === value) return
    this._backgroundColor = value
    this.invalidateSkin()
  }

  get textColor() {
    return this._textColor
  }

  set textColor(value) {
    if (this._textColor === value) return
    this._textColor = value
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

  get enabled() {
    return this._enabled
  }

  set enabled(value) {
    if (this._enabled === value) return
    this._enabled = value
    this.alpha = value ? 1 : 0.6
    this.invalidateSkin()
  }

  //--------------------------------------------------------------------------
  // Event Listeners
  //--------------------------------------------------------------------------

  _initListeners() {
    this.on('mouseOver', this._onMouseOver.bind(this))
    this.on('mouseOut', this._onMouseOut.bind(this))
    this.on('mouseDown', this._onMouseDown.bind(this))
    this.on('mouseUp', this._onMouseUp.bind(this))
    this.on('click', this._onClick.bind(this))
  }

  _onMouseOver(event) {
    if (!this._enabled) return
    this._isHover = true
    this.invalidateSkin()
  }

  _onMouseOut(event) {
    this._isHover = false
    this._isActive = false
    this.invalidateSkin()
  }

  _onMouseDown(event) {
    if (!this._enabled) return
    this._isActive = true
    this.invalidateSkin()
  }

  _onMouseUp(event) {
    this._isActive = false
    this.invalidateSkin()
  }

  _onClick(event) {
    if (!this._enabled) {
      event.stopPropagation()
    }
  }

  //--------------------------------------------------------------------------
  // Render
  //--------------------------------------------------------------------------

  drawSkin(context) {
    if (!this._enabled) {
      this._drawButton(context, this._disabledBackgroundColor, this._disabledTextColor)
    } else if (this._isActive) {
      this._drawButton(context, this._activeBackgroundColor, this._activeTextColor)
    } else if (this._isHover) {
      this._drawButton(context, this._hoverBackgroundColor, this._hoverTextColor)
    } else {
      this._drawButton(context, this._backgroundColor, this._textColor)
    }
  }

  _drawButton(context, bgColor, textColor) {
    context.save()

    // 绘制背景
    if (bgColor) {
      context.fillStyle = bgColor
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

    // 绘制文本
    if (this._label) {
      context.font = `${this._fontWeight} ${this._fontSize}px ${this._fontFamily}`
      context.fillStyle = textColor
      context.textBaseline = 'middle'
      context.textAlign = 'center'
      context.fillText(this._label, this.width / 2, this.height / 2)
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
