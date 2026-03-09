import UIComponent from '../core/UIComponent'

/**
 * 标签组件 - 显示文本
 */
export default class Label extends UIComponent {
  constructor() {
    super()
    this.name = 'Label'
    this._text = ''
    this._fontSize = 14
    this._fontFamily = 'Arial'
    this._fontWeight = 'normal'
    this._textColor = '#000000'
    this._textAlign = 'left'
    this._verticalAlign = 'top'
    this._lineHeight = 0
    this._wordWrap = false
    this._autoSize = true

    // 默认大小
    this._width = 100
    this._height = 20
  }

  //--------------------------------------------------------------------------
  // Properties
  //--------------------------------------------------------------------------

  get text() {
    return this._text
  }

  set text(value) {
    if (this._text === value) return
    this._text = String(value ?? '')
    this.invalidateProperties()
    this.invalidateSkin()
  }

  get fontSize() {
    return this._fontSize
  }

  set fontSize(value) {
    if (this._fontSize === value) return
    this._fontSize = value
    this.invalidateProperties()
    this.invalidateSkin()
  }

  get fontFamily() {
    return this._fontFamily
  }

  set fontFamily(value) {
    if (this._fontFamily === value) return
    this._fontFamily = value
    this.invalidateProperties()
    this.invalidateSkin()
  }

  get fontWeight() {
    return this._fontWeight
  }

  set fontWeight(value) {
    if (this._fontWeight === value) return
    this._fontWeight = value
    this.invalidateProperties()
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

  get textAlign() {
    return this._textAlign
  }

  set textAlign(value) {
    if (this._textAlign === value) return
    this._textAlign = value
    this.invalidateSkin()
  }

  get verticalAlign() {
    return this._verticalAlign
  }

  set verticalAlign(value) {
    if (this._verticalAlign === value) return
    this._verticalAlign = value
    this.invalidateSkin()
  }

  get lineHeight() {
    return this._lineHeight || this._fontSize * 1.2
  }

  set lineHeight(value) {
    if (this._lineHeight === value) return
    this._lineHeight = value
    this.invalidateSkin()
  }

  get wordWrap() {
    return this._wordWrap
  }

  set wordWrap(value) {
    if (this._wordWrap === value) return
    this._wordWrap = value
    this.invalidateSkin()
  }

  get autoSize() {
    return this._autoSize
  }

  set autoSize(value) {
    if (this._autoSize === value) return
    this._autoSize = value
    this.invalidateProperties()
  }

  //--------------------------------------------------------------------------
  // Life Cycle
  //--------------------------------------------------------------------------

  commitProperties() {
    super.commitProperties()
    
    if (this._autoSize) {
      this.measureSize()
    }
  }

  //--------------------------------------------------------------------------
  // Methods
  //--------------------------------------------------------------------------

  /**
   * 测量文本大小
   */
  measureSize() {
    const context = this.application?.context
    if (!context) return

    context.font = `${this._fontWeight} ${this._fontSize}px ${this._fontFamily}`
    
    if (this._wordWrap) {
      const lines = this._wrapText(context, this._text, this.width)
      const textWidth = Math.max(...lines.map(line => context.measureText(line).width))
      const textHeight = lines.length * this.lineHeight
      this._width = Math.max(this._width, textWidth)
      this._height = Math.max(this._height, textHeight)
    } else {
      const metrics = context.measureText(this._text)
      this._width = metrics.width
      this._height = this.lineHeight
    }
  }

  drawSkin(context) {
    context.save()

    // 设置字体
    context.font = `${this._fontWeight} ${this._fontSize}px ${this._fontFamily}`
    context.fillStyle = this._textColor
    context.textBaseline = 'top'

    // 计算文本位置
    let startX = 0
    let startY = 0

    if (this._wordWrap) {
      const lines = this._wrapText(context, this._text, this.width)
      const textHeight = lines.length * this.lineHeight

      // 垂直对齐
      switch (this._verticalAlign) {
        case 'middle':
          startY = (this.height - textHeight) / 2
          break
        case 'bottom':
          startY = this.height - textHeight
          break
        default:
          startY = 0
      }

      // 绘制每一行
      lines.forEach((line, index) => {
        const lineY = startY + index * this.lineHeight
        
        // 水平对齐
        switch (this._textAlign) {
          case 'center':
            startX = (this.width - context.measureText(line).width) / 2
            break
          case 'right':
            startX = this.width - context.measureText(line).width
            break
          default:
            startX = 0
        }

        context.fillText(line, startX, lineY)
      })
    } else {
      const metrics = context.measureText(this._text)

      // 水平对齐
      switch (this._textAlign) {
        case 'center':
          startX = (this.width - metrics.width) / 2
          break
        case 'right':
          startX = this.width - metrics.width
          break
        default:
          startX = 0
      }

      // 垂直对齐
      switch (this._verticalAlign) {
        case 'middle':
          startY = (this.height - this.lineHeight) / 2
          break
        case 'bottom':
          startY = this.height - this.lineHeight
          break
        default:
          startY = 0
      }

      context.fillText(this._text, startX, startY)
    }

    context.restore()
  }

  /**
   * 文本自动换行
   */
  _wrapText(context, text, maxWidth) {
    const words = text.split('')
    const lines = []
    let currentLine = ''

    for (const word of words) {
      const testLine = currentLine + word
      const metrics = context.measureText(testLine)
      
      if (metrics.width > maxWidth && currentLine !== '') {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    
    if (currentLine !== '') {
      lines.push(currentLine)
    }

    return lines.length === 0 ? [''] : lines
  }
}
