import compileUtil from '../utils'
/**
 * @class 指令解析类 Compile
 * @param el element节点
 * @param vm mvvm实例
 */
export default class Compile {
  constructor(el, vm) {
    this.$vm = vm
    this.$el = this.isElementNode(el) ? el : document.querySelector(el)

    if (this.$el) {
      this.fragment = this.nodeFragment(this.$el)
      this.compileElement(this.fragment)
      // 将文档碎片放回真实dom
      this.$el.appendChild(this.fragment)
    }
  }

  compileElement(el) {
    const { childNodes } = el;

    [].slice.call(childNodes).forEach(node => {
      const text = node.textContent
      const reg = /\{\{((?:.|\n)+?)\}\}/

      // 如果是element节点
      if (this.isElementNode(node)) {
        this.compile(node)

        // 如果是text节点
      } else if (this.isTextNode(node) && reg.test(text)) {
        // 匹配第一个选项
        this.compileText(node, RegExp.$1)
      }

      // 解析子节点包含的指令
      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node)
      }
    })
  }

  // 文档碎片，遍历过程中会有多次的dom操作，为提高性能我们会将el节点转化为fragment文档碎片
  // 解析操作完成，将其添加回真实dom节点中
  nodeFragment(el) {
    const fragment = document.createDocumentFragment()
    let child

    while (child = el.firstChild) {
      fragment.appendChild(child)
    }
    return fragment
  }

  //指令解析
  compile(node) {
    let { attributes } = node;
    [].slice.call(attributes).forEach(({ name, value }) => {
      if (this.isDirective(name)) {
        const exp = value
        const dir = name.substring(2)

        // 事件指令
        if (this.isEventDirective(dir)) {
          compileUtil.eventHandler(node, this.$vm, exp, dir)
        } else {
          // 普通指令
          compileUtil[dir] && compileUtil[dir](node, this.$vm, exp)
        }

        node.removeAttribute(name)
      }
    })
  }

  // 文本指令解析
  compileText(node, exp) {
    compileUtil.text(node, this.$vm, exp)
  }

  // element节点
  isElementNode({ nodeType }) {
    return nodeType === 1
  }

  // text纯文本
  isTextNode({ nodeType }) {
    return nodeType === 3
  }

  // 普通指令判定
  isDirective(attr) {
    return attr.indexOf('x-') === 0
  }

  // 时间指令判定
  isEventDirective(dir) {
    return dir.indexOf('on') === 0
  }
}