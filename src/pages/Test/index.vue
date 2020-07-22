<template>
	<fc-list 
	:modelInfo = "modelInfo"
	:module = "module"
	:paramFormConfig = "paramFormConfig"
	:tableConfig = "tableConfig"
	:postFormConfig="postFormConfig"
	:rules="rules">
		<template slot="postFormButton"  slot-scope="scope">
			<el-button type="danger" @click="resetpassword(scope.data)" v-if="scope.data.editid&&$store.state.ButtonPermission.resetPassword">重置密码</el-button>
		</template>
	</fc-list>
</template>

<script>
	import fcList from '~/components/pageTemplate/fc-list.vue'
	import config from './config.js'
	import {
		SysUserResetPassword
	} from '~/request/api.js';
	export default {
		data() {
			return config
		},
		components:{
			"fc-list":fcList
		},
		methods:{
			resetpassword(scope){
				this.$confirm('此操作将改变用户密码, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(async () => {
				          let result = await SysUserResetPassword({id:scope.editid});
						  scope.getPageInfo();
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消重置'
				          });
						});
			}
		}
	}
	
</script>

<style>
</style>
