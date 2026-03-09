import Container from './Container'
import Label from './Label'

/**
 * 面板组件 - 带有标题栏的容器
 */
export default class Panel extends Container {
  constructor() {
    super()
    this.name = 'Panel'

    // 默认大小
    this._width = 300
    this._height = 200

    // 标题栏属性
    this._title = 'Panel'
    this._titleHeight = 32
    this._titleBackgroundColor = '#f0f0f0'
    this._titleTextColor = '#333333'
    this._titleFontSize = 14
    this._showTitle = true

    // 内容区域
    this._contentPadding = 10
    this._contentContainer = null

    // 创建内容容器
    this._createContentContainer()
    this._createTitleLabel()
  }

  //--------------------------------------------------------------------------
  // Properties
  //--------------------------------------------------------------------------

  get title() {
    return this._title
  }

  set title(value) {
    if (this._title === value) return
    this._title = value
    if (this._titleLabel) {
      this._titleLabel.text = value
    }
  }

  get titleHeight() {
    return this._titleHeight
  }

  set titleHeight(value) {
    if (this._titleHeight === value) return
    this._titleHeight = value
    this.invalidateDisplayList()
  }

  get showTitle() {
    return this._showTitle
  }

  set showTitle(value) {
    if (this._showTitle === value) return
    this._showTitle = value
    if (this._titleLabel) {
      this._titleLabel.visible = value
    }
    this.invalidateDisplayList()
  }

  get contentContainer() {
    return this._contentContainer
  }

  //--------------------------------------------------------------------------
  // Create Children
  //--------------------------------------------------------------------------

  _createContentContainer() {
    this._contentContainer = new Container()
    this._contentContainer.name = 'contentContainer'
    super.addChild(this._contentContainer)
  }

  _createTitleLabel() {
    this._titleLabel = new Label()
    this._titleLabel.name = 'titleLabel'
    this._titleLabel.text = this._title
    this._titleLabel.fontSize = this._titleFontSize
    this._titleLabel.textColor = this._titleTextColor
    this._titleLabel.autoSize = false
    this._titleLabel.width = this._width - 20
    this._titleLabel.height = this._titleHeight
    super.addChild(this._titleLabel)
  }

  //--------------------------------------------------------------------------
  // Override Methods
  //--------------------------------------------------------------------------

  addChild(child) {
    if (child === this._contentContainer || child === this._titleLabel) {
      return super.addChild(child)
    }
    return this._contentContainer.addChild(child)
  }

  removeChild(child) {
    if (child === this._contentContainer || child === this._titleLabel) {
      return super.removeChild(child)
    }
    return this._contentContainer.removeChild(child)
  }

  //--------------------------------------------------------------------------
  // Layout
  //--------------------------------------------------------------------------

  updateDisplayList() {
    super.updateDisplayList()

    // 更新标题栏位置
    if (this._titleLabel) {
      this._titleLabel.x = 10
      this._titleLabel.y = (this._titleHeight - this._titleLabel.height) / 2
      this._titleLabel.width = this._width - 20
      this._titleLabel.visible = this._showTitle
    }

    // 更新内容容器
    if (this._contentContainer) {
      this._contentContainer.x = this._contentPadding
      this._contentContainer.y = this._showTitle ? this._titleHeight + this._contentPadding : this._contentPadding
      this._contentContainer.width = this._width - this._contentPadding * 2
      this._contentContainer.height = this._height - (this._showTitle ? this._titleHeight : 0) - this._contentPadding * 2
    }
  }

  drawSkin(context) {
    context.save()

    // 绘制面板背景
    if (this._backgroundColor) {
      context.fillStyle = this._backgroundColor
      if (this._cornerRadius > 0) {
        this._drawRoundRect(context, 0, 0, this.width, this.height, this._cornerRadius)
        context.fill()
      } else {
        context.fillRect(0, 0, this.width, this.height)
      }
    }

    // 绘制标题栏背景
    if (this._showTitle && this._titleBackgroundColor) {
      context.fillStyle = this._titleBackgroundColor
      const radius = this._cornerRadius
      if (radius > 0) {
        // 只有顶部圆角
        context.beginPath()
        context.moveTo(0, radius)
        context.quadraticCurveTo(0, 0, radius, 0)
        context.lineTo(this.width - radius, 0)
        context.quadraticCurveTo(this.width, 0, this.width, radius)
        context.lineTo(this.width, this._titleHeight)
        context.lineTo(0, this._titleHeight)
        context.closePath()
        context.fill()
      } else {
        context.fillRect(0, 0, this.width, this._titleHeight)
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
