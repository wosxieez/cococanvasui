console.log('hello this is cocoui')

// 初始一个画布
const canvas = document.createElement('CANVAS')
canvas.width = 1024
canvas.height = 768
document.body.appendChild(canvas)

const context = canvas.getContext('2d')
context.fillStyle = '#AAAAAA'
context.fillRect(0, 0, 800, 600)

//---------------------------------------------------------------------------------------------------------------------
//
//  Core
//
//---------------------------------------------------------------------------------------------------------------------

function CallLaterMethod() {}

//---------------------------------------------------------------------------------------------------------------------
//
//  UIComponent
//
//---------------------------------------------------------------------------------------------------------------------

function UIComponent() {
  this.name = 'uicomponent'
  this.x = 0
  this.y = 0
  this.width = 100
  this.height = 100
  this.childs = []
  this.initialized = false

  this.initialize = function () {
    if (this.initialized) return
    this.initialized = true

    console.log('uicomponent initialize')

    this.createChildren()
    this.updateDisplayList()
  }

  this.createChildren = function () {
    console.log('uicomponent createChildren')
  }
  this.updateDisplayList = function () {
    console.log('uicomponent updateDisplayList')
  }

  this.addChild = function (child) {
    console.log('uicomponent addChild')

    this.childs.push(child)

    if (child instanceof UIComponent) {
      child.initialize()
    }
  }
}

//---------------------------------------------------------------------------------------------------------------------
//
//  Application
//
//---------------------------------------------------------------------------------------------------------------------

function Application() {
  UIComponent.call(this)

  this.x = 0
  this.y = 0
  this.width = 600
  this.height = 600

  // override
  this.updateDisplayList = function () {
    console.log('application updateDisplayList')

    context.fillStyle = 'gray'
    context.fillRect(this.x, this.y, this.width, this.height)
  }

  /**
   *
   * 下一帧执行函数
   *
   * @param method 函数
   * @param args 函数参数
   *
   */
  function callLater(method, ...args) {
    var clm = new CallLaterMethod()
    clm.method = method
    clm.args = args
    clm.caller = name

    pushCallLaterMethodToApplicationCallLaterMethods(clm)
    return clm
  }
}
Application.prototype = Object.create(UIComponent.prototype)
Application.prototype.constructor = Application

//---------------------------------------------------------------------------------------------------------------------
//
//  Button
//
//---------------------------------------------------------------------------------------------------------------------

function Button() {
  UIComponent.call(this)

  this.x = 10
  this.y = 0
  this.width = 100
  this.height = 30

  // override
  this.updateDisplayList = function () {
    console.log('button updateDisplayList')

    context.fillStyle = 'blue'
    context.fillRect(this.x, this.y, this.width, this.height)
  }
}
Button.prototype = Object.create(UIComponent.prototype)
Button.prototype.constructor = Button

//---------------------------------------------------------------------------------------------------------------------
//
//  TEST CODE
//
//---------------------------------------------------------------------------------------------------------------------

const application = new Application()
const button = new Button()
application.addChild(button)

console.log(application, application instanceof UIComponent)
console.log(button, button instanceof UIComponent)
