let uid = 0

export default class Dep {
  constructor() {
    this.id = uid++
    this.subs = []
  }

  // 添加订阅者
  addSub(sub) {
    this.subs.push(sub)
  }

  // 移除订阅者
  removeSub(sub) {
    let index = this.subs.indexOf(sub)
    index !== -1 && this.subs.splice(index, 1)
  }

  //通知数据变更
  notify() {
    this.subs.forEach(sub => sub.update())
  }

  // 添加watcher
  depend() {
    Dep.target.addDep(this)
  }
}

// Dep.target的是watcher
Dep.target = null
