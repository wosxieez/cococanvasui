import UIComponent from '../core/UIComponent'
import Graphics from './Graphics'

export default class Application extends UIComponent {
  constructor() {
    super()

    this._name = 'Application'
    this._width = 800
    this._height = 600
  }

  initialize() {
    super.initialize()

    //创建一个canvas到body上
    const canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height
    document.body.appendChild(canvas)

    // 设置全局上下文
    const context = canvas.getContext('2d')
    Graphics.context = context


    this.updateDisplayList()
  }

  updateDisplayList() {
    super.updateDisplayList()

    this.graphics.beginFill('#CCCCCC')
    this.graphics.drawReact(0, 0, this.width, this.height)
    this.graphics.endFill()
  }
}
