import Container from '../component/Container'

/**
 * 垂直布局容器
 */
export default class VBox extends Container {
  constructor() {
    super()
    this.name = 'VBox'
    this._gap = 10
    this._padding = 0
    this._horizontalAlign = 'left' // left, center, right, stretch
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

  get horizontalAlign() {
    return this._horizontalAlign
  }

  set horizontalAlign(value) {
    if (this._horizontalAlign === value) return
    this._horizontalAlign = value
    this.invalidateDisplayList()
  }

  //--------------------------------------------------------------------------
  // Layout
  //--------------------------------------------------------------------------

  updateDisplayList() {
    super.updateDisplayList()

    let currentY = this._padding
    const availableWidth = this.width - this._padding * 2

    for (const child of this.children) {
      if (!child.visible) continue

      // 计算水平位置
      let childX = this._padding
      switch (this._horizontalAlign) {
        case 'center':
          childX = this._padding + (availableWidth - child.width) / 2
          break
        case 'right':
          childX = this._padding + availableWidth - child.width
          break
        case 'stretch':
          childX = this._padding
          child.width = availableWidth
          break
      }

      child.x = childX
      child.y = currentY

      currentY += child.height + this._gap
    }

    // 自动调整容器高度
    const contentHeight = currentY - this._gap + this._padding
    if (contentHeight > this.height) {
      this.height = contentHeight
    }
  }
}
