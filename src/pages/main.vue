<template>
	<el-container class="main-c1" direction="vertical">
		<el-header class="main-head">
			<el-menu class="top-menu" mode="horizontal" @select="handleSelect">
				<el-submenu index="1">
					<template slot="title">{{$store.state.UserInfo.userName}}的工作台</template>
					<el-menu-item index="loginOut">退出系统</el-menu-item>
				</el-submenu>
			</el-menu>
			<!-- <div class="line"></div> -->
		</el-header>
		<el-container class="main-c2">
			<el-aside class="main-aside" width="210px">
				<el-menu class="main-menu" :router="true" :default-active="$route.name" @open="handleOpen" @close="handleClose"
				 background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
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
	import cookie from 'vue-cookie'
	import MenuTree from '~/components/MenuTree'
	import {
		loginOut,
		getSysResourceOfUser
	} from '~/request/api.js';

	export default {
		components: {
			'MenuTree': MenuTree
		},
		data() {
			return {
				menutree: [],
				activeIndex: '1',
				activeIndex2: '1'
			}
		},
		created() {
			this.getResource();
		},
		methods: {
			async handleSelect(key, keyPath) {
				if(key=="loginOut"){
					let result = await loginOut();
					cookie.set('token',null);
					this.$router.push({
						path: '/login'
					});
				}
			},
			async getResource() {
				let result = await getSysResourceOfUser();
				let buttoncodes = {};
				let pagecodes = {};
				let filterMenu = (ary) => {
					let newary = ary.filter((item) => {
						if (item.type == 1) {
							if (item.children != null) {
								item.children = filterMenu(item.children);
							}
							pagecodes[item.path] = true;
							return true;
						} else {
							buttoncodes[item.path] = true;
							return false;
						}
					});
					return newary;
				}
				this.menutree = filterMenu(result.sysResources);
				if (!pagecodes[this.$route.name] && this.$route.meta.validate) {
					this.$router.push({
						name: "noAuth"
					});
				}
				this.$store.commit('setUserInfo', result.sysUser);
				this.$store.commit('setButtonPermission', buttoncodes);
				this.$store.commit('setPagePermission', pagecodes);
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
		padding: 0;
		background-color: #ffffff;
	}

	.top-menu li {
		float: right;
	}

	.main-c2 {
		height: calc(100% - 60px);
	}

	.main-aside {
		height: 100%;
	}

	.main-menu {
		height: 100%;
		text-align: left;
	}

	.main-main {
		height: 100%;
	}

	.main-breadcrumb {
		margin-bottom: 15px;
	}
</style>
