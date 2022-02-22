import UIComponent from '../core/UIComponent'

export default class Application extends UIComponent {
  constructor() {
    super()

    console.log('hello this is application')
  }

  createChildren() {
    super.createChildren()

    console.log('hello this is application createChildren')
  }
}
