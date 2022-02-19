* 使用webpack对库进行打包
* 是用babel进行代码转换
* webpack.config.js中output
  - 设置library: 导出库的名称 如cocoui
  - 设置libraryExport: default    暴露那个属性，如果不设置，引用的时候是 cocoui.default.UIComponent   或者index.js中 直接export { UIComponent }
  - 设置libraryTarget: umd   指定输出的类型  commonjs amd umd