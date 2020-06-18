import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import Login from './pages/login.vue'
import Main from './pages/main.vue'
import User from './pages/user/user.vue'

Vue.use(ElementUI)
Vue.use(VueRouter)

const routes = [{
		path: '/',
		redirect: '/login'
	},
	{
		path: '/login',
		component: Login
	},
	{
		path: '/main',
		component: Main,
		children: [{
			path: "",
			redirect: 'user'
		}, {
			path: "user",
			component: User
		}]
	}
]

const router = new VueRouter({
	routes
})

new Vue({
	el: '#app',
	router,
	render: h => h(App)
})
