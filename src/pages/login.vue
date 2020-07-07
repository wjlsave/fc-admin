<template>
	<el-container class="logincontainer">
		<el-header>
		</el-header>
		<el-main>
			<el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="100px" class="login-form">
				<el-form-item label="账号" prop="account">
					<el-input v-model="loginForm.account"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input type="password" @keyup.enter.native="submitForm('loginForm')" v-model="loginForm.password" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('loginForm')">登陆</el-button>
				</el-form-item>
			</el-form>
		</el-main>
	</el-container>
</template>

<script>
	import { login } from '~/request/api.js';
	import cookie from 'vue-cookie'
	export default {
		data() {
			return {
				loginForm: {
					account: '',
					password: ''
				},
				rules: {
					account: [{
							required: true,
							message: '请输入账号',
							trigger: 'blur'
						},
						{
							pattern:/^[a-zA-Z0-9_-]{4,16}$/,
							message: '4到16位（字母，数字，下划线，减号）',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 30,
							message: '30个字符',
							trigger: 'blur'
						}
					]
				}
			};
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						let result = await login(this.loginForm,()=>{
							this.$refs[formName].resetFields();
						});
						cookie.set("token",result);
						this.$router.push({
							path: '/main'
						});
					} 
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			}
		}
	}
</script>

<style>
	.logincontainer {
		height: 100%;
		background-color: #ABCDEF;
	}

	.login-form {
		width: 30%;
		position: absolute;
		top: 35%;
		right: 8%;
	}
</style>
