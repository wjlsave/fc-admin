import Vue from 'vue'
import router from '~/router/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from '~/App.vue'

Vue.use(ElementUI);

new Vue({
	el: '#app',
	router,
	render: h => h(App)
})
