<template>
	<fc-list 
	:modelInfo = "modelInfo"
	:paramFormConfig = "paramFormConfig"
	:tableConfig = "tableConfig"
	:postFormConfig="postFormConfig"
	:rules="rules"></fc-list>
</template>

<script>
	import fcList from '~/components/pagetemplate/fc-list.vue'
	export default {
		data() {
			return {
				modelInfo:{
					name:"用户",
					code:"SysUser"
				},
				paramFormConfig:[
					{
						component:"el-input",
						bindingCode:"account",
						placeholder:"填写账户"
					},
					{
						component:"el-input",
						bindingCode:"userName",
						placeholder:"填写姓名"
					}
				],
				tableConfig:[
					{
						bindingCode:"account",
						label:"账户",
						width:120,
						align:"left"
					},
					{
						bindingCode:"account",
						label:"姓名",
						minWidth:120,
						align:"center"
					}
				],
				postFormConfig:[
					{
						label:"账户",
						component:"el-input",
						bindingCode:"account"
					},
					{
						label:"姓名",
						component:"el-input",
						bindingCode:"userName"
					}
				],
				rules: {
					account: [{
							required: true,
							message: '请输入账户名称',
							trigger: 'blur'
						},
						{
							pattern: /^[a-zA-Z0-9_-]{4,16}$/,
							message: '4到16位（字母，数字，下划线，减号）',
							trigger: 'blur'
						}
					],
					userName: [{
							required: true,
							message: '请输入用户姓名',
							trigger: 'blur'
						},
						{
							pattern: /^[\u4E00-\u9FA5A-Za-z\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$/,
							message: '用户姓名不合法',
							trigger: 'blur'
						}
					],
				}
			}
		},
		components:{
			"fc-list":fcList
		}
	}
	
</script>

<style>
</style>
