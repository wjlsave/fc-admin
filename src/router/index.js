import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

export default new VueRouter({
	routes: [{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/login',
			component: resolve => require(["~/pages/login"], resolve),
		},
		{
			path: '/main',
			component: resolve => require(["~/pages/main"], resolve),
			children: [{
				path: "",
				redirect: 'welcome'
			}, {
				path: "SysUser",
				name:"SysUser",
				component: resolve => require(["~/pages/SysUser/list"], resolve),
			}, {
				path: "SysRole",
				name:"SysRole",
				component: resolve => require(["~/pages/SysRole/list"], resolve),
			}, {
				path: "SysResource",
				name:"SysResource",
				component: resolve => require(["~/pages/SysResource/list"], resolve),
			}, {
				path: "welcome",
				name:"welcome",
				component: resolve => require(["~/pages/welcome"], resolve),
			}]
		}
	]
})
