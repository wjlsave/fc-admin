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
			path: '/notFound',
			component: resolve => require(["~/pages/404"], resolve),
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
				meta:{validate:true,menuname:"用户管理"},
				component: resolve => require(["~/pages/SysUser/list"], resolve),
			}, {
				path: "SysRole",
				name:"SysRole",
				meta:{validate:true,menuname:"角色管理"},
				component: resolve => require(["~/pages/SysRole/list"], resolve),
			}, {
				path: "SysResource",
				name:"SysResource",
				meta:{validate:true,menuname:"资源管理"},
				component: resolve => require(["~/pages/SysResource/list"], resolve),
			}, {
				path: "SysApi",
				name:"SysApi",
				meta:{validate:true,menuname:"接口管理"},
				component: resolve => require(["~/pages/SysApi/list"], resolve),
			}, {
				path: "welcome",
				name:"welcome",
				component: resolve => require(["~/pages/welcome"], resolve),
			}, {
				path: 'noAuth',
				name:"noAuth",
				component: resolve => require(["~/pages/noAuth"], resolve),
			}, {
				path: "Test",
				name:"Test",
				component: resolve => require(["~/pages/Test"], resolve),
			}]
		}
	]
})
