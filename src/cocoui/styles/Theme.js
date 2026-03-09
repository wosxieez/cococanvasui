/**
 * 主题管理器
 */
export default class Theme {
  static _current = null
  static _themes = new Map()

  /**
   * 注册主题
   * @param {string} name - 主题名称
   * @param {Object} styles - 样式配置
   */
  static register(name, styles) {
    Theme._themes.set(name, styles)
  }

  /**
   * 获取主题
   * @param {string} name - 主题名称
   * @returns {Object}
   */
  static get(name) {
    return Theme._themes.get(name)
  }

  /**
   * 应用主题
   * @param {string} name - 主题名称
   */
  static apply(name) {
    Theme._current = name
  }

  /**
   * 获取当前主题样式
   * @param {string} component - 组件名称
   * @returns {Object}
   */
  static getStyles(component) {
    const theme = Theme._themes.get(Theme._current)
    return theme?.[component] || {}
  }

  /**
   * 应用样式到组件
   * @param {UIComponent} component - 组件实例
   * @param {string} componentName - 组件名称
   */
  static applyTo(component, componentName) {
    const styles = Theme.getStyles(componentName)
    for (const key in styles) {
      if (key in component) {
        component[key] = styles[key]
      }
    }
  }
}

// 默认主题
Theme.register('default', {
  Button: {
    backgroundColor: '#007bff',
    textColor: '#ffffff',
    fontSize: 14,
    fontFamily: 'Arial',
    cornerRadius: 4,
    hoverBackgroundColor: '#0056b3',
    activeBackgroundColor: '#004494'
  },

  Label: {
    fontSize: 14,
    fontFamily: 'Arial',
    textColor: '#333333'
  },

  TextInput: {
    backgroundColor: '#ffffff',
    textColor: '#333333',
    borderColor: '#cccccc',
    focusedBorderColor: '#007bff',
    fontSize: 14,
    fontFamily: 'Arial',
    cornerRadius: 4
  },

  Container: {
    backgroundColor: null,
    borderColor: '#dddddd',
    borderWidth: 1
  },

  Panel: {
    backgroundColor: '#ffffff',
    borderColor: '#dddddd',
    borderWidth: 1,
    cornerRadius: 4,
    titleBackgroundColor: '#f0f0f0',
    titleTextColor: '#333333'
  }
})

Theme.register('dark', {
  Button: {
    backgroundColor: '#4a4a4a',
    textColor: '#ffffff',
    fontSize: 14,
    fontFamily: 'Arial',
    cornerRadius: 4,
    hoverBackgroundColor: '#5a5a5a',
    activeBackgroundColor: '#3a3a3a'
  },

  Label: {
    fontSize: 14,
    fontFamily: 'Arial',
    textColor: '#ffffff'
  },

  TextInput: {
    backgroundColor: '#2a2a2a',
    textColor: '#ffffff',
    borderColor: '#444444',
    focusedBorderColor: '#007bff',
    fontSize: 14,
    fontFamily: 'Arial',
    cornerRadius: 4
  },

  Container: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444444',
    borderWidth: 1
  },

  Panel: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444444',
    borderWidth: 1,
    cornerRadius: 4,
    titleBackgroundColor: '#3a3a3a',
    titleTextColor: '#ffffff'
  }
})

// 应用默认主题
Theme.apply('default')

export { Theme }
