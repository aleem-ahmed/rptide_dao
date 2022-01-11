// [IMPORT] //
import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'


// [IMPORT] Personal //
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import '@/assets/styles/index.scss'


// [VUE-USE] //
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
