<template>
	<div class="pagelist-container">
		<el-form :inline="true" size="medium" :model="formInline" class="pagelist-form">
			<el-form-item>
				<el-input v-model="formInline.user" placeholder="审批人"></el-input>
			</el-form-item>
			<el-form-item>
				<el-select clearable v-model="formInline.region" placeholder="活动区域">
					<el-option label="区域一" value="shanghai"></el-option>
					<el-option label="区域二" value="beijing"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">查询</el-button>
				<el-button type="primary" icon="el-icon-edit">添加</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="tableData" height="calc(100% - 119px)" border style="width: 100%">
			<el-table-column prop="date" label="日期" width="180">
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="180">
			</el-table-column>
			<el-table-column prop="address" label="地址">
			</el-table-column>
		</el-table>
		
		<el-pagination
			background
			hide-on-single-page
		  @size-change="handleSizeChange"
		  @current-change="handleCurrentChange"
		  :current-page="currentPage4"
		  :page-sizes="[100, 200, 300, 400]"
		  :page-size="100"
		  layout="total, sizes, prev, pager, next, jumper"
		  :total="400">
		</el-pagination>
	</div>
</template>

<script>
	import { getuserinfo } from '../../request/api.js';
	export default {
		data() {
			return {
				currentPage4: 4,
				formInline: {
					user: '',
					region: ''
				},
				tableData: [{
					date: '2016-05-02',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}, {
					date: '2016-05-04',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1517 弄'
				}, {
					date: '2016-05-01',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1519 弄'
				}, {
					date: '2016-05-03',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1516 弄'
				}]
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
				let result = getuserinfo();
				console.log(result);
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			  },
			  handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
			  }
		}
	}
</script>

<style>
	.pagelist-container{height: calc(100% - 29px)}
	.pagelist-form{text-align: left;}
</style>
