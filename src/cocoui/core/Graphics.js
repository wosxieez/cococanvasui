export default class Graphics {
  static context = null

  beginFill(color) {
    Graphics.context.fillStyle = color
  }

  drawReact(x, y, width, height) {
    Graphics.context.fillRect(x, y, width, height)
  }

  endFill() {}
}
