<template>
	<div class="pagelist-container">
		<el-form :inline="true" size="medium" :model="paramForm" class="pagelist-form">
			<el-form-item>
				<el-input v-model="paramForm.account" placeholder="账号"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="paramForm.userName" placeholder="用户名"></el-input>
			</el-form-item>
			<el-form-item>
				<el-select clearable v-model="paramForm.state" placeholder="状态">
					<el-option label="启用" value="1"></el-option>
					<el-option label="禁用" value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="search">查询</el-button>
				<el-button type="primary" icon="el-icon-edit" @click="dialogFormVisible = true">添加</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="tableData" height="calc(100% - 119px)" border style="width: 100%">
			<el-table-column prop="account" label="账户" width="180">
			</el-table-column>
			<el-table-column prop="userName" label="姓名" width="180">
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间">
			</el-table-column>
		</el-table>

		<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
		 :page-sizes="[10,20,50,100,1000,10000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
		</el-pagination>
		
		<el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="800px">
			<el-form :model="postForm" ref="postForm" :rules="rules" label-width="100px" >
				<el-form-item label="账户名称" prop="account">
					<el-input v-model="postForm.account" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="用户姓名" prop="userName">
					<el-input v-model="postForm.userName" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="启用状态">
					<el-switch
					  v-model="postForm.state"
					  active-color="#13ce66"
					  inactive-color="#ff4949"
					  active-value= "1"
					  inactive-value= "0">
					</el-switch>
				</el-form-item>
				<el-form-item label="角色选择">
					<el-transfer v-model="postForm.roleids" :data="rolelist" :titles="['待选角色', '已选角色']"></el-transfer>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancel">取 消</el-button>
				<el-button type="primary" @click="save">确 定</el-button>
			</div>
		</el-dialog>
	</div>

</template>

<script>
	import {
		getSysUserpagelist,SysUseradd,getRolepagelist
	} from '~/request/api.js';
	export default {
		data() {
			return {
				pageNum: 1,
				pageSize: 20,
				total: 0,
				paramForm: {
					account: '',
					userName: '',
					state: null,
					roleids:[]
				},
				tableData: [],
				dialogFormVisible: false,
				postForm: {
					account: null,
					userName: null,
					state: "1"
				},
				rolelist:[],
				rules: {
					account: [{
							required: true,
							message: '请输入账户名称',
							trigger: 'blur'
						},
						{
							pattern:/^[a-zA-Z0-9_-]{4,16}$/,
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
		created() {
			this.getPageInfo();
			this.getRolelist();
		},
		methods: {
			search() {
				this.getPageInfo();
			},
			async getPageInfo() {
				let params = {
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}
				Object.assign(params, this.$util.filterParams(this.paramForm));
				let result = await getSysUserpagelist(params);
				this.tableData = result.list;
				this.total = result.total;
			},
			async getRolelist() {
				let result = await getRolepagelist({pageNum:1,pageSize:0});
				this.rolelist = [];
				for(let i = 0;i<result.list.length;i++){
					this.rolelist.push({
						key: result.list[i].id,
						label: result.list[i].roleName
					});
				}
			},
			handleSizeChange(val) {
				this.pageNum = 1;
				this.pageSize = val;
				this.getPageInfo();
			},
			handleCurrentChange(val) {
				this.pageNum = val;
				this.getPageInfo();
			},
			cancel(){
				this.dialogFormVisible =false;
			},
			async save(){
				this.$refs["postForm"].validate(async (valid) => {
					if (valid) {
						this.postForm.roleids = this.postForm.roleids.join(",");
						let result = await SysUseradd(this.$util.filterParams(this.postForm));
						this.dialogFormVisible =false;
						this.$refs["postForm"].resetFields();
						this.getPageInfo();
					} 
				});
			}
		}
	}
</script>

<style>
	.pagelist-container {
		height: calc(100% - 29px)
	}

	.pagelist-form {
		text-align: left;
	}
</style>
