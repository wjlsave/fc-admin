<template>
	<el-container class="main-c1" direction="vertical">
		<el-header class="main-head"></el-header>
		<el-container class="main-c2">
			<el-aside class="main-aside" width="210px">
				<el-menu class="main-menu" :router="true" :default-active="$route.name" @open="handleOpen" @close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
					<MenuTree :menuData="menutree"></MenuTree>
				</el-menu>
			</el-aside>
			<el-main class="main-main">
				<el-breadcrumb separator-class="el-icon-arrow-right" class="main-breadcrumb">
				  <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
				  <el-breadcrumb-item>{{$route.meta.menuname}}</el-breadcrumb-item>
				  
				</el-breadcrumb>
				
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	import MenuTree from '~/components/MenuTree'
	import {
		getSysResourceOfUser
	} from '~/request/api.js';
	
	export default {
		components: {
		  'MenuTree': MenuTree
		},
		data(){
			return {
				menutree:[]
			}
		},
		created(){
			this.getResource();
		},
	    methods: {
		  async getResource(){
		  	let result = await getSysResourceOfUser();
			let buttoncodes = {};
			let pagecodes = {};
			let filterMenu = (ary) => {
				let newary = ary.filter((item)=>{
					if(item.type==1){
						if(item.children!=null){
							item.children = filterMenu(item.children);
						}
						pagecodes[item.path] = true;
						return true;
					}else{
						buttoncodes[item.path] = true;
						return false;
					}
				});
				return newary;
			} 
			this.menutree = filterMenu(result);
			if(!pagecodes[this.$route.name]&&this.$route.meta.validate){
				this.$router.push({name:"noAuth"});
				//this.$route.push({path:"/noAuth"});
			}
			this.$store.commit('setButtonPermission',buttoncodes);
			this.$store.commit('setPagePermission',pagecodes);
		  },
	      handleOpen(key, keyPath) {
	        console.log(key, keyPath);
	      },
	      handleClose(key, keyPath) {
	        console.log(key, keyPath);
	      }
	    }
	  }
</script>

<style scoped="scoped">
	.main-c1 {
		height: 100%;
	}

	.main-head {
		background-color: #abcdef;
	}

	.main-c2 {
		height: calc(100% - 60px);
	}

	.main-aside {
		height: 100%;
	}
	
	.main-menu{
		height: 100%;
		text-align: left;
	}
	
	.main-main {
		height: 100%;
	}
	
	.main-breadcrumb{
		margin-bottom: 15px;
	}
</style>
