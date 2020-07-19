import Vue from 'vue'
import Vuex from 'vuex'

//挂载Vuex
Vue.use(Vuex)

//创建VueX对象
const store = new Vuex.Store({
    state:{
	   hasinit:false,
       UserInfo:{},
	   ButtonPermission:{},
	   PagePermission:{}
    },
	mutations:{
		setUserInfo(state,data){
			state.UserInfo = data;
		},
		setButtonPermission(state,data){
			state.ButtonPermission = data;
		},
		setPagePermission(state,data){
			state.PagePermission = data;
			state.hasinit = true;
		}
	}
})

export default store