import Graphics from './Graphics'

export default class UIComponent {
  constructor() {
    this._name = 'UIComponent'
    this._children = []
    this._initialized = false
    this._application = null
    this.graphics = new Graphics()
    this._x = 0
    this._y = 0
    this._width = 100
    this._height = 100
  }

  //----------------------------------------------------------------------------------------------------
  //
  // Properties
  //
  //----------------------------------------------------------------------------------------------------

  get application() {
    return this._application
  }

  set application(value) {
    this._application = value
  }

  get x() {
    return this._x
  }

  set x(value) {
    this._x = value
  }

  get y() {
    return this._y
  }

  set y(value) {
    this._y = value
  }

  get width() {
    return this._width
  }

  set width(value) {
    this._width = value
  }

  get height() {
    return this._height
  }

  set height(value) {
    this._height = value
  }

  //----------------------------------------------------------------------------------------------------
  //
  // Methods
  //
  //----------------------------------------------------------------------------------------------------

  initialize() {
    console.log(`${this._name} initialize`)

    if (this._initialized) return
    this._initialized = true
  }

  addChild(child) {
    console.log(`${this._name} addChild ${child}`)

    if (child instanceof UIComponent) {
      child.initialize()
      child.application = this.application
    }
  }

  updateDisplayList() {}
}
