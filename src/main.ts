import Vue from 'vue'
import App from './App.vue'
import router from './router'

import '@/ui'
import '@/ui/icons'
import '@/styles/tailwind/output.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
