import Watcher from '../watcher'
import { observe } from '../observer'
import Compile from '../compile'

export default class Vue {
  constructor(options = {}) {
    this.$options = options
    const data = this._data = this.$options.data

    Object.keys(data).forEach(key => this._proxy(key))
    observe(data, this)

    new Compile(options.el || document.body, this)
  }

  //代理属性
  _proxy(key) {
    Object.defineProperty(this, key, {
      configurable: true,
      enumerable: true,
      get: () => this._data[key],
      set: val => { this._data[key] = val }
    })
  }
}
