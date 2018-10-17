import Observer from './observer'
import Vue from './instance/vue'


const v = new Vue({
  el: '#mvvm',
  data: {
    a: 'test model',
    b: {c:'hello MVVM'},
    flag: true
  },
  methods: {
    testToggle: function () {
      this.flag = !this.flag;
      this.b.c = this.flag ? 'hello MVVM' : 'test success'
    }
  }
})

