import UIComponent from '../core/UIComponent'

/**
 * 图片组件
 */
export default class Image extends UIComponent {
  constructor() {
    super()
    this.name = 'Image'
    this._width = 100
    this._height = 100
    this._source = null
    this._image = null
    this._loaded = false
    this._scaleMode = 'stretch' // stretch, fit, fill, none
    this._smooth = true
  }

  //--------------------------------------------------------------------------
  // Properties
  //--------------------------------------------------------------------------

  get source() {
    return this._source
  }

  set source(value) {
    if (this._source === value) return
    this._source = value
    this._loadImage()
  }

  get scaleMode() {
    return this._scaleMode
  }

  set scaleMode(value) {
    if (this._scaleMode === value) return
    this._scaleMode = value
    this.invalidateSkin()
  }

  get smooth() {
    return this._smooth
  }

  set smooth(value) {
    if (this._smooth === value) return
    this._smooth = value
    this.invalidateSkin()
  }

  get loaded() {
    return this._loaded
  }

  //--------------------------------------------------------------------------
  // Load Image
  //--------------------------------------------------------------------------

  _loadImage() {
    if (!this._source) {
      this._image = null
      this._loaded = false
      this.invalidateSkin()
      return
    }

    this._loaded = false
    this._image = new window.Image()
    this._image.crossOrigin = 'anonymous'
    
    this._image.onload = () => {
      this._loaded = true
      
      // 如果自动大小，设置组件尺寸为图片尺寸
      if (this._autoSize) {
        this._width = this._image.naturalWidth
        this._height = this._image.naturalHeight
      }
      
      this.invalidateSkin()
      this.emit('load')
    }

    this._image.onerror = () => {
      this._loaded = false
      this.emit('error')
    }

    this._image.src = this._source
  }

  //--------------------------------------------------------------------------
  // Render
  //--------------------------------------------------------------------------

  drawSkin(context) {
    if (!this._loaded || !this._image) return

    context.save()
    
    // 设置图像平滑
    context.imageSmoothingEnabled = this._smooth

    const imgWidth = this._image.naturalWidth
    const imgHeight = this._image.naturalHeight
    const componentWidth = this.width
    const componentHeight = this.height

    let sx = 0, sy = 0, sWidth = imgWidth, sHeight = imgHeight
    let dx = 0, dy = 0, dWidth = componentWidth, dHeight = componentHeight

    switch (this._scaleMode) {
      case 'stretch':
        // 默认行为 - 拉伸填充
        break

      case 'fit':
        // 等比缩放，完整显示
        const fitScale = Math.min(componentWidth / imgWidth, componentHeight / imgHeight)
        dWidth = imgWidth * fitScale
        dHeight = imgHeight * fitScale
        dx = (componentWidth - dWidth) / 2
        dy = (componentHeight - dHeight) / 2
        break

      case 'fill':
        // 等比缩放，填充整个区域（可能裁剪）
        const fillScale = Math.max(componentWidth / imgWidth, componentHeight / imgHeight)
        const scaledWidth = imgWidth * fillScale
        const scaledHeight = imgHeight * fillScale
        sx = (scaledWidth - componentWidth) / fillScale / 2
        sy = (scaledHeight - componentHeight) / fillScale / 2
        sWidth = componentWidth / fillScale
        sHeight = componentHeight / fillScale
        break

      case 'none':
        // 不缩放，保持原图大小
        dWidth = imgWidth
        dHeight = imgHeight
        dx = (componentWidth - imgWidth) / 2
        dy = (componentHeight - imgHeight) / 2
        break
    }

    context.drawImage(this._image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    context.restore()
  }
}
