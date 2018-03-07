import Dep from '../observer/dep.js'

/** 
 * @class 观察类
 * @param vm vm对象
 * @param expOrFn 属性表达式
 * @param cb 回调函数（一半用来做view动态更新）
*/
export default class Watcher {
  constructor(vm, expOrFn, cb) {
    this.cb = cb
    this.vm = vm
    this.expOrFn = expOrFn.trim()
    this.depIds = {}

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = this.parseGetter(expOrFn)
    }

    this.value = this.get()
  }

  update() {
    this.run()
  }

  run() {
    const newVal = this.get()
    const oldVal = this.value
    if (newVal === oldVal) return

    this.value = newVal
    // 将newVal,oldVal挂载到MVVM实例上
    this.cb.call(this.vm, newVal, oldVal)
  }

  get() {
    Dep.target = this // 将当前订阅者指向自己
    const value = this.getter.call(this.vm, this.vm) // 触发get，将自身添加到dep中
    Dep.target = null // 添加完成，重置
    return value
  }

  // 添加watcher到dep.subs[]
  addDep(dep) {
    if (!this.depIds.hasOwnProperty(dep.id)) {
      dep.addSub(this)
      this.depIds[dep.id] = dep
    }
  }

  parseGetter(exp) {
    if (/[^\w.$]/.test(exp)) return
    const exps = exp.split('.')

    // 简易的循环依赖处理
    return function (obj) {
      for (let i = 0; i < exps.length; i++) {
        if (!obj) return
        obj = obj[exps[i]]
      }
      return obj
    }
  }

}
