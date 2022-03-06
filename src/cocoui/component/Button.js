import UIComponent from '../core/UIComponent'

export default class Button extends UIComponent {
  constructor() {
    super()

    this.name = 'Button'

    this._width = 70
    this._height = 300
  }
}
