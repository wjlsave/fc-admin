<template>
	<el-container class="main-c1" direction="vertical">
		<el-header class="main-head"></el-header>
		<el-container class="main-c2">
			<el-aside class="main-aside" width="210px">
				<el-menu default-active="1-1" class="main-menu" @open="handleOpen" @close="handleClose" background-color="#545c64"
				 text-color="#fff" active-text-color="#ffd04b">
					<el-submenu index="1">
						<template slot="title">
							<i class="el-icon-location"></i>
							<span>系统配置</span>
						</template>
						<el-menu-item index="1-1">用户管理</el-menu-item>
						<el-menu-item index="1-2">角色管理</el-menu-item>
					</el-submenu>
					<el-menu-item index="2">
						<i class="el-icon-menu"></i>
						<span slot="title">导航二</span>
					</el-menu-item>
					<el-menu-item index="3" disabled>
						<i class="el-icon-document"></i>
						<span slot="title">导航三</span>
					</el-menu-item>
					<el-menu-item index="4">
						<i class="el-icon-setting"></i>
						<span slot="title">导航四</span>
					</el-menu-item>
				</el-menu>
			</el-aside>
			<el-main class="main-main">
				<el-breadcrumb separator-class="el-icon-arrow-right" class="main-breadcrumb">
				  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
				  <el-breadcrumb-item>活动管理</el-breadcrumb-item>
				  <el-breadcrumb-item>活动列表</el-breadcrumb-item>
				  <el-breadcrumb-item>活动详情</el-breadcrumb-item>
				</el-breadcrumb>
				
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	export default {
	    methods: {
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
