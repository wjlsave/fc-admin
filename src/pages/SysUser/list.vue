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
				<el-button type="primary" icon="el-icon-edit">添加</el-button>
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

		<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
		 :current-page="pageNum" :page-sizes="[1,20,50,100,1000,10000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
		 :total="total">
		</el-pagination>
	</div>
</template>

<script>
	import {
		getSysUserpagelist
	} from '~/request/api.js';
	export default {
		data() {
			return {
				pageNum: 1,
				pageSize: 1,
				total: 3,
				paramForm: {
					account: '',
					userName: '',
					state: null
				},
				tableData: []
			}
		},
		created(){
			this.pageNum = 1;
			this.pageSize = 1;
			this.getPageInfo();
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
				Object.assign(params,this.paramForm);
				for(let key in params){
				    if(params[key]==null||params[key]==""){
						delete params[key];
					}
				}
				let result = await getSysUserpagelist(params);
				this.tableData = result.list;
				this.total = result.total;
			},
			handleSizeChange(val) {
				this.pageNum = 1;
				this.pageSize = val;
				this.getPageInfo();
			},
			handleCurrentChange(val) {
				this.pageNum = val;
				this.getPageInfo();
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
