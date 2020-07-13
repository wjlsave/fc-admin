import Vue from 'vue'
import Vuex from 'vuex'

//挂载Vuex
Vue.use(Vuex)

//创建VueX对象
const store = new Vuex.Store({
    state:{
       UserInfo:{},
	   ButtonPermission:{},
	   PagePermission:{}
    },
	mutations:{
		setButtonPermission(state,data){
			state.ButtonPermission = data;
		},
		setPagePermission(state,data){
			state.PagePermission = data;
		}
	}
})

export default store