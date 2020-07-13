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
	if (to.matched.length===0){
		next({path:"notFound"});
	}else{
		if(to.meta.validate===true&&store.state.hasinit&&store.state.PagePermission[to.name]!==true){
			next({name:"noAuth"});
		}else{
			next();
		}
	}
	
});

new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App)
})
