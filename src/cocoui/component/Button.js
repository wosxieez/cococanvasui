import UIComponent from '../core/UIComponent'

export default class Button extends UIComponent {
  constructor() {
    super()

    this.name = 'Button'

    this._width = 70
    this._height = 30
    this._label = null
  }

  get label() {
    return this._label
  }

  set label(value) {
    if (this._label == value) return

    this._label = value

    this.invalidateProperties()
    this.invalidateSkin()
  }

  /**
   * override draw skin
   */
  drawSkin(context) {
    super.drawSkin(context)

    context.font = '12px Georgia'
    context.fillText(this.label || this.name, this.x, this.y + this.height)
  }
}
