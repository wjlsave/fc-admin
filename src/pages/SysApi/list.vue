<template>
	<div class="pagelist-container">
		<el-form :inline="true" size="medium" :model="paramForm" class="pagelist-form">
			<el-form-item>
				<el-input v-model="paramForm.apiPath" placeholder="路径"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="search">查询</el-button>
				<el-button type="primary" icon="el-icon-edit" @click="dialogFormVisible = true" v-if="$store.state.ButtonPermission.addSysApi">添加</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="tableData" height="calc(100% - 119px)" border style="width: 100%">
			<el-table-column prop="apiPath" label="接口路径" width="200">
			</el-table-column>
			<el-table-column prop="apiDescribe" label="接口说明">
			</el-table-column>
			
			<el-table-column label="操作" width="200" align="center">
			      <template slot-scope="scope">
					<el-button
					  size="mini"
					  type="primary"
					   v-if="!$store.state.ButtonPermission.editSysApi&&$store.state.ButtonPermission.seeSysApi"
					  @click="handleEdit(scope.$index, scope.row)">查看</el-button>  
			        <el-button
			          size="mini"
					  type="warning"
					   v-if="$store.state.ButtonPermission.editSysApi"
			          @click="handleEdit(scope.$index, scope.row)">修改</el-button>
			        <el-button
			          size="mini"
			          type="danger"
					  v-if="$store.state.ButtonPermission.cutSysApi"
			          @click="cut(scope.$index, scope.row)">删除</el-button>
			      </template>
			    </el-table-column>
		</el-table>

		<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
		 :page-sizes="[10,20,50,100,1000,10000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
		 :total="total">
		</el-pagination>

		<el-dialog :title="editid?($store.state.ButtonPermission.editSysApi?'修改接口':'查看接口'):'添加接口'" :visible.sync="dialogFormVisible" width="800px" @close="close" :close-on-click-modal="false">
			<el-form :model="postForm" ref="postForm" :rules="rules" label-width="100px" :disabled="editid&&!$store.state.ButtonPermission.editSysApi">
				<el-form-item label="接口路径" prop="apiPath">
					<el-input v-model="postForm.apiPath" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="接口说明" prop="apiDescribe">
					<el-input v-model="postForm.apiDescribe"  type="textarea" rows="4" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="add" v-if="!editid&&$store.state.ButtonPermission.addSysApi">提 交</el-button>
				<el-button type="primary" @click="edit" v-if="editid&&$store.state.ButtonPermission.editSysApi">修 改</el-button>
			</div>
		</el-dialog>
	</div>

</template>

<script>
	import {
		getSysApiPagelist,
		SysApiDetail,
		SysApiAdd,
		SysApiEdit,
		SysApiCut
	} from '~/request/api.js';
	export default {
		data() {
			return {
				pageNum: 1,
				pageSize: 20,
				total: 0,
				paramForm: {
					apiPath: ''
				},
				tableData: [],
				dialogFormVisible: false,
				postForm: {
					apiPath: null,
					apiDescribe: null
				},
				rules: {
					apiPath: [{
							required: true,
							message: '请输入接口路径',
							trigger: 'blur'
						},
						{
							range:{max:100},
							message: '不超过100个字符',
							trigger: 'blur'
						}
					],
					apiDescribe: [{
							range:{max:1000},
							message: '不超过1000个字符',
							trigger: 'blur'
						}
					],
				},
				editid:null
			}
		},
		created() {
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
				Object.assign(params, this.$util.filterParams(this.paramForm));
				let result = await getSysApiPagelist(params);
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
			},
			async add() {
				this.$refs["postForm"].validate(async (valid) => {
					if (valid) {
						let params = Object.assign({},this.postForm);
						let result = await SysApiAdd(this.$util.filterParams(params));
						this.dialogFormVisible = false;
						this.getPageInfo();
					}
				});
			},
			async handleEdit(index,row){
				this.editid = row.id;
				this.dialogFormVisible = true;
				let result = await SysApiDetail({id:row.id});
				this.postForm = this.$util.OverrideObject(this.postForm,result);
			},
			async edit() {
				this.$refs["postForm"].validate(async (valid) => {
					if (valid) {
						let params = Object.assign({id:this.editid},this.postForm);
						let result = await SysApiEdit(this.$util.filterParams(params));
						this.dialogFormVisible = false;
						this.getPageInfo();
					}
				});
			},
			cut(index,row){
				this.$confirm('此操作将永久删除接口信息, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(async () => {
				          let result = await SysApiCut({id:row.id});
						  this.getPageInfo();
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消删除'
				          });
						});
			},
			close() {
				this.$refs["postForm"].resetFields();
				this.editid = null;
			}
		}
	}
</script>

<style scoped="scoped">
	.pagelist-container {
		height: calc(100% - 29px)
	}
</style>
