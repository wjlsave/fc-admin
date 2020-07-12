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
				redirect: 'welcome'
			}, {
				path: "SysUser",
				component: resolve=>require(["~/pages/SysUser/list"],resolve),
			}, {
				path: "SysRole",
				component: resolve=>require(["~/pages/SysRole/list"],resolve),
			}, {
				path: "SysResource",
				component: resolve=>require(["~/pages/SysResource/list"],resolve),
			}, {
				path: "welcome",
				component: resolve=>require(["~/pages/welcome"],resolve),
			}]
		}
	]
})
