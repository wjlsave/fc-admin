import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
	routes: [{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/login',
			component: resolve=>require(["~/pages/login"],resolve),
		},
		{
			path: '/main',
			component: resolve=>require(["~/pages/main"],resolve),
			children: [{
				path: "",
				redirect: 'user'
			}, {
				path: "user",
				component: resolve=>require(["~/pages/user/user"],resolve),
			}]
		}
	]
})
