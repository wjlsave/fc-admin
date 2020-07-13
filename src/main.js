import Vue from 'vue'
import router from '~/router/index'
import store from '~/store/index'
import util from '~/util/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from '~/App.vue'

Vue.prototype.$util = util;
Vue.use(ElementUI);

router.beforeEach((to,from,next)=>{
	console.log(to);
	next();
});

new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App)
})
