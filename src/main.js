import Vue from 'vue'

import router from './router'

import App from './App.vue'
import './registerServiceWorker'

Vue.config.productionTip = false

new Vue({
  data: {
    username: '',
  },
  methods: {
    setUsername(username) {
      this.username = username
    },
  },
  router,
  render: (h) => h(App),
}).$mount('#app')
