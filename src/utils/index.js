import Watcher from '../watcher'

// 定义$elm,缓存当前执行input事件的input dom 对象
let $elm
let timer = null

// 指令处理集合
export default {
  html(node, vm, exp) {
    this.bind(node, vm, exp, 'html')
  },

  text(node, vm, exp) {
    this.bind(node, vm, exp, 'text')
  },

  class(node, vm, exp) {
    this.bind(node, vm, exp, 'class')
  },

  model(node, vm, exp) {
    this.bind(node, vm, exp, 'model')

    let val = this._getVmVal(vm, exp)

    // 监听input事件
    node.addEventListener('input', ({ target }) => {
      const newVal = target.value
      $elm = target

      if (val === newVal) return

      // 设置定时器，完成ui js的异步渲染
      clearTimeout(timer)
      timer = setTimeout(() => {
        this._setVmVal(vm, exp, newVal)
        val = newVal
      })
    })
  },

  bind(node, vm, exp, dir) {
    const updaterFn = updater[`${dir}Updater`]
    // 初始化渲染
    updaterFn && updaterFn(node, this._getVmVal(vm, exp))

    new Watcher(vm, exp, (value, oldValue) => {
      updaterFn && updaterFn(node, value, oldValue)
    })
  },

  eventHandler(node, vm, exp, dir) {
    const eventType = dir.split(':')[1]
    const fn = vm.$options.methods && vm.$options.methods[exp]

    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm), false)
    }
  },

  _getVmVal(vm, exp) {
    let val = vm

    exp = exp.split('.')
    exp.forEach(key => {
      key = key.trim()
      val = val[key]
    })
    return val
  },

  _setVmVal(vm, exp, value) {
    let val = vm
    exp = exp.split('.')
    exp.forEach((key, index) => {
      key = key.trim()
      if (index < exp.length - 1) {
        val = val[key]
      } else {
        val[key] = value
      }
    })
  }
}

// 指令渲染集合
const updater = {
  htmlUpdater(node, value) {
    node.innerHTML = typeof value === 'undefined' ? '' : value
  },

  textUpdater(node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value
  },

  classUpdater() {

  },

  modelUpdater(node, value, oldValue) {
    //不对当前操作input进行渲染操作
    if ($elm === node) return false

    $elm = undefined
    node.value = typeof value === 'undefined' ? '' : value
  }
}