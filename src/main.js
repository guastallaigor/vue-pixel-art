import Vue from 'vue'
import App from './App.vue'
import 'typeface-press-start-2p/index.css'
import './style/nes.min.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
