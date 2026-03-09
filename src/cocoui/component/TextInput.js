import UIComponent from '../core/UIComponent'
import Container from './Container'

/**
 * 文本输入框组件
 */
export default class TextInput extends UIComponent {
  constructor() {
    super()
    this.name = 'TextInput'

    // 默认大小
    this._width = 200
    this._height = 32

    // 文本属性
    this._text = ''
    this._placeholder = ''
    this._fontSize = 14
    this._fontFamily = 'Arial'
    this._textColor = '#333333'
    this._placeholderColor = '#999999'

    // 样式
    this._backgroundColor = '#ffffff'
    this._borderColor = '#cccccc'
    this._borderWidth = 1
    this._cornerRadius = 4
    this._focusedBorderColor = '#007bff'

    // 状态
    this._enabled = true
    this._focused = false
    this._cursorVisible = false
    this._cursorPosition = 0
    this._selectionStart = 0
    this._selectionEnd = 0

    // 光标闪烁
    this._cursorInterval = null

    // 隐藏的原生输入框（用于支持输入法）
    this._nativeInput = null

    this._initListeners()
  }

  //--------------------------------------------------------------------------
  // Properties
  //--------------------------------------------------------------------------

  get text() {
    return this._text
  }

  set text(value) {
    const newValue = String(value ?? '')
    if (this._text === newValue) return
    this._text = newValue
    this._cursorPosition = Math.min(this._cursorPosition, this._text.length)
    this.invalidateSkin()
    this.emit('change')
  }

  get placeholder() {
    return this._placeholder
  }

  set placeholder(value) {
    if (this._placeholder === value) return
    this._placeholder = value
    if (!this._text) {
      this.invalidateSkin()
    }
  }

  get enabled() {
    return this._enabled
  }

  set enabled(value) {
    if (this._enabled === value) return
    this._enabled = value
    if (!value) {
      this._blur()
    }
    this.alpha = value ? 1 : 0.6
    this.invalidateSkin()
  }

  get focused() {
    return this._focused
  }

  //--------------------------------------------------------------------------
  // Event Listeners
  //--------------------------------------------------------------------------

  _initListeners() {
    this.on('mouseDown', this._onMouseDown.bind(this))
    this.on('keyDown', this._onKeyDown.bind(this))

    // 全局点击事件（用于失焦）
    if (typeof window !== 'undefined') {
      window.addEventListener('mousedown', this._onGlobalMouseDown.bind(this))
    }
  }

  _onMouseDown(event) {
    if (!this._enabled) return
    this._focus()
    
    // 计算光标位置
    const context = this.application?.context
    if (context) {
      context.font = `${this._fontSize}px ${this._fontFamily}`
      const clickX = event.x - 10 // 减去内边距
      this._cursorPosition = this._getCharIndexAt(context, clickX)
      this.invalidateSkin()
    }
  }

  _onGlobalMouseDown(event) {
    // 检查是否点击在当前组件外
    if (this._focused && this.application) {
      const rect = this.application.context.canvas.getBoundingClientRect()
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top
      const globalPos = this.localToGlobal(0, 0)
      
      if (mouseX < globalPos.x || mouseX > globalPos.x + this.width ||
          mouseY < globalPos.y || mouseY > globalPos.y + this.height) {
        this._blur()
      }
    }
  }

  _onKeyDown(event) {
    if (!this._focused || !this._enabled) return

    const key = event.data?.key || event.key
    
    switch (key) {
      case 'Backspace':
        if (this._cursorPosition > 0) {
          this.text = this._text.slice(0, this._cursorPosition - 1) + 
                      this._text.slice(this._cursorPosition)
          this._cursorPosition--
        }
        break

      case 'Delete':
        if (this._cursorPosition < this._text.length) {
          this.text = this._text.slice(0, this._cursorPosition) + 
                      this._text.slice(this._cursorPosition + 1)
        }
        break

      case 'ArrowLeft':
        this._cursorPosition = Math.max(0, this._cursorPosition - 1)
        this.invalidateSkin()
        break

      case 'ArrowRight':
        this._cursorPosition = Math.min(this._text.length, this._cursorPosition + 1)
        this.invalidateSkin()
        break

      case 'Home':
        this._cursorPosition = 0
        this.invalidateSkin()
        break

      case 'End':
        this._cursorPosition = this._text.length
        this.invalidateSkin()
        break

      default:
        // 输入字符
        if (key.length === 1 && !event.ctrlKey && !event.metaKey) {
          this.text = this._text.slice(0, this._cursorPosition) + 
                      key + 
                      this._text.slice(this._cursorPosition)
          this._cursorPosition++
        }
    }
  }

  //--------------------------------------------------------------------------
  // Focus/Blur
  //--------------------------------------------------------------------------

  _focus() {
    if (this._focused) return
    this._focused = true
    this._startCursorBlink()
    this.invalidateSkin()
    this.emit('focus')
  }

  _blur() {
    if (!this._focused) return
    this._focused = false
    this._stopCursorBlink()
    this._cursorVisible = false
    this.invalidateSkin()
    this.emit('blur')
  }

  _startCursorBlink() {
    this._cursorInterval = setInterval(() => {
      this._cursorVisible = !this._cursorVisible
      this.invalidateSkin()
    }, 500)
  }

  _stopCursorBlink() {
    if (this._cursorInterval) {
      clearInterval(this._cursorInterval)
      this._cursorInterval = null
    }
  }

  //--------------------------------------------------------------------------
  // Helper Methods
  //--------------------------------------------------------------------------

  _getCharIndexAt(context, x) {
    let currentWidth = 0
    for (let i = 0; i < this._text.length; i++) {
      const charWidth = context.measureText(this._text[i]).width
      if (currentWidth + charWidth / 2 >= x) {
        return i
      }
      currentWidth += charWidth
    }
    return this._text.length
  }

  _getTextWidth(context, text) {
    return context.measureText(text).width
  }

  //--------------------------------------------------------------------------
  // Render
  //--------------------------------------------------------------------------

  drawSkin(context) {
    context.save()

    // 绘制背景
    context.fillStyle = this._backgroundColor
    if (this._cornerRadius > 0) {
      this._drawRoundRect(context, 0, 0, this.width, this.height, this._cornerRadius)
      context.fill()
    } else {
      context.fillRect(0, 0, this.width, this.height)
    }

    // 绘制边框
    context.strokeStyle = this._focused ? this._focusedBorderColor : this._borderColor
    context.lineWidth = this._borderWidth
    if (this._cornerRadius > 0) {
      this._drawRoundRect(context, 0, 0, this.width, this.height, this._cornerRadius)
      context.stroke()
    } else {
      context.strokeRect(0, 0, this.width, this.height)
    }

    // 设置裁剪区域（防止文本超出）
    context.beginPath()
    if (this._cornerRadius > 0) {
      this._drawRoundRect(context, 0, 0, this.width, this.height, this._cornerRadius)
    } else {
      context.rect(0, 0, this.width, this.height)
    }
    context.clip()

    // 绘制文本
    context.font = `${this._fontSize}px ${this._fontFamily}`
    context.textBaseline = 'middle'
    const padding = 10
    const textY = this.height / 2

    if (this._text) {
      context.fillStyle = this._textColor
      context.fillText(this._text, padding, textY)

      // 绘制光标
      if (this._focused && this._cursorVisible) {
        const textBeforeCursor = this._text.slice(0, this._cursorPosition)
        const cursorX = padding + context.measureText(textBeforeCursor).width
        
        context.beginPath()
        context.moveTo(cursorX, (this.height - this._fontSize) / 2)
        context.lineTo(cursorX, (this.height + this._fontSize) / 2)
        context.strokeStyle = this._textColor
        context.lineWidth = 1
        context.stroke()
      }
    } else if (this._placeholder) {
      context.fillStyle = this._placeholderColor
      context.fillText(this._placeholder, padding, textY)
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

  destroy() {
    this._blur()
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousedown', this._onGlobalMouseDown)
    }
    super.destroy?.()
  }
}
