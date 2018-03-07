import Dep from './dep'

export default class Observer {
  constructor(obj) {
    this.obj = obj
    this.walk(obj)
  }
  //递归。。让每个字属性可以observe
  walk(obj) {
    Object.keys(obj).forEach(key => this.defineReactive(obj, key, obj[key]))
  }

  defineReactive(obj, key, val) {
    let dep = new Dep()
    let childOb = observe(val)

    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,

      //给data对象添加依赖关系
      get: () => {
        // watch使用的标志位，
        Dep.target && dep.depend()
        childOb && childOb.dep.depend()

        return val
      },

      // 当数据改变时通知数据更新
      set: newVal => {
        if (val === newVal || (newVal !== newVal && val !== val)) {
          return
        }
        val = newVal
        // 监听子属性
        childOb = observe(newVal)
        // 通知数据更新
        dep.notify()
      }
    })
  }
}

export function observe(value, vm) {
  if (!value || typeof value !== 'object') {
    return
  }
  return new Observer(value)
}
