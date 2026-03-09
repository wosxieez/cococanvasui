import Container from '../component/Container'

/**
 * 水平布局容器
 */
export default class HBox extends Container {
  constructor() {
    super()
    this.name = 'HBox'
    this._gap = 10
    this._padding = 0
    this._verticalAlign = 'top' // top, middle, bottom, stretch
  }

  //--------------------------------------------------------------------------
  // Properties
  //--------------------------------------------------------------------------

  get gap() {
    return this._gap
  }

  set gap(value) {
    if (this._gap === value) return
    this._gap = value
    this.invalidateDisplayList()
  }

  get padding() {
    return this._padding
  }

  set padding(value) {
    if (this._padding === value) return
    this._padding = value
    this.invalidateDisplayList()
  }

  get verticalAlign() {
    return this._verticalAlign
  }

  set verticalAlign(value) {
    if (this._verticalAlign === value) return
    this._verticalAlign = value
    this.invalidateDisplayList()
  }

  //--------------------------------------------------------------------------
  // Layout
  //--------------------------------------------------------------------------

  updateDisplayList() {
    super.updateDisplayList()

    let currentX = this._padding
    const availableHeight = this.height - this._padding * 2

    for (const child of this.children) {
      if (!child.visible) continue

      // 计算垂直位置
      let childY = this._padding
      switch (this._verticalAlign) {
        case 'middle':
          childY = this._padding + (availableHeight - child.height) / 2
          break
        case 'bottom':
          childY = this._padding + availableHeight - child.height
          break
        case 'stretch':
          childY = this._padding
          child.height = availableHeight
          break
      }

      child.x = currentX
      child.y = childY

      currentX += child.width + this._gap
    }

    // 自动调整容器宽度
    const contentWidth = currentX - this._gap + this._padding
    if (contentWidth > this.width) {
      this.width = contentWidth
    }
  }
}
