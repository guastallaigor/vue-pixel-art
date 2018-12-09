import Vue from 'vue'
import App from './App.vue'
import VueClipboard from 'vue-clipboard2'
import 'typeface-press-start-2p/index.css'
import './style/nes.min.css'

Vue.use(VueClipboard)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
