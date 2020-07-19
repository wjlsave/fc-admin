<template>
	<div class="pagelist-container">
		<el-form :inline="true" size="medium" :model="paramForm">
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
				<el-button type="primary" icon="el-icon-edit" @click="dialogFormVisible = true" v-if="$store.state.ButtonPermission.addSysUser">添加</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="tableData" height="calc(100% - 119px)" border style="width: 100%">
			<el-table-column prop="account" label="账户">
			</el-table-column>
			<el-table-column prop="userName" label="姓名">
			</el-table-column>
			<el-table-column prop="state" label="状态" align="center">
				<template slot-scope="scope">
					<el-tag :type="scope.row.state === 1 ? 'success' : 'danger'" disable-transitions>{{scope.row.state===1?'启用':'停用'}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" align="center">
			</el-table-column>
			<el-table-column prop="lastLoginTime" label="最后登录时间" align="center">
			</el-table-column>
			<el-table-column label="操作" width="300" fixed="right" align="center">
			      <template slot-scope="scope">
					<el-button
					  size="mini"
					  type="primary"
					   v-if="!$store.state.ButtonPermission.editSysUser&&$store.state.ButtonPermission.seeSysUser"
					  @click="handleEdit(scope.$index, scope.row)">查看</el-button>
			        <el-button
			          size="mini"
					  type="warning"
					   v-if="$store.state.ButtonPermission.editSysUser"
			          @click="handleEdit(scope.$index, scope.row)">修改</el-button>
			        <el-button
			          size="mini"
			          type="danger"
					  v-if="$store.state.ButtonPermission.cutSysUser"
			          @click="cut(scope.$index, scope.row)">删除</el-button>
			      </template>
			    </el-table-column>
		</el-table>

		<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
		 :page-sizes="[10,20,50,100,1000,10000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
		 :total="total">
		</el-pagination>

		<el-dialog :title="editid?($store.state.ButtonPermission.editSysUser?'修改用户':'查看用户'):'添加用户'" :visible.sync="dialogFormVisible" width="800px" @close="close" :close-on-click-modal="false">
			<el-form :model="postForm" ref="postForm" :rules="rules" label-width="100px" :disabled="editid&&!$store.state.ButtonPermission.editSysUser">
				<el-form-item label="账户名称" prop="account">
					<el-input v-model="postForm.account" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="用户姓名" prop="userName">
					<el-input v-model="postForm.userName" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="启用状态">
					<el-switch v-model="postForm.state" active-color="#13ce66" inactive-color="#ff4949" active-value="1"
					 inactive-value="0">
					</el-switch>
				</el-form-item>
				<el-form-item label="角色选择">
					<el-transfer v-model="postForm.roleids" :data="rolelist" :titles="['待选角色','已选角色']"></el-transfer>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="add" v-if="!editid&&$store.state.ButtonPermission.addSysUser">提 交</el-button>
				<el-button type="primary" @click="edit" v-if="editid&&$store.state.ButtonPermission.editSysUser">修 改</el-button>
				<el-button type="danger" @click="resetpassword" v-if="editid&&$store.state.ButtonPermission.resetPassword">重置密码</el-button>
			</div>
		</el-dialog>
	</div>

</template>

<script>
	import {
		getSysUserPagelist,
		SysUserDetail,
		SysUserAdd,
		SysUserEdit,
		SysUserCut,
		getSysRolePagelist,
		SysUserResetPassword
	} from '~/request/api.js';
	export default {
		data() {
			return {
				pageNum: 1,
				pageSize: 20,
				total: 0,
				paramForm: {
					account: null,
					userName: null,
					state: null
				},
				tableData: [],
				dialogFormVisible: false,
				postForm: {
					account: null,
					userName: null,
					state: "1",
					roleids: []
				},
				rolelist: [],
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
				},
				editid:null
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
				let result = await getSysUserPagelist(params);
				this.tableData = result.list;
				this.total = result.total;
			},
			async getRolelist() {
				let result = await getSysRolePagelist({
					pageNum: 1,
					pageSize: 0
				});
				this.rolelist = [];
				for (let i = 0; i < result.list.length; i++) {
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
			async add() {
				this.$refs["postForm"].validate(async (valid) => {
					if (valid) {
						let params = Object.assign({},this.postForm);
						params.roleids = params.roleids.join(",");
						let result = await SysUserAdd(this.$util.filterParams(params));
						this.dialogFormVisible = false;
						this.getPageInfo();
					}
				});
			},
			async edit() {
				this.$refs["postForm"].validate(async (valid) => {
					if (valid) {
						let params = Object.assign({id:this.editid},this.postForm);
						params.roleids = params.roleids.join(",");
						let result = await SysUserEdit(this.$util.filterParams(params));
						this.dialogFormVisible = false;
						this.getPageInfo();
					}
				});
			},
			
			resetpassword(){
				this.$confirm('此操作将改变用户密码, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(async () => {
				          let result = await SysUserResetPassword({id:this.editid});
						  this.getPageInfo();
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消重置'
				          });
						});
			},
			async handleEdit(index,row){
				this.editid = row.id;
				this.dialogFormVisible = true;
				let result = await SysUserDetail({id:row.id});
				this.postForm = this.$util.OverrideObject(this.postForm,result);
				this.postForm.roleids = result.roleids;
				this.postForm.state+="";
			},
			cut(index,row){
				this.$confirm('此操作将永久删除用户信息, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(async () => {
				          let result = await SysUserCut({id:row.id});
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
				this.postForm.roleids = [];
				this.postForm.state = "1";
			}
		}
	}
</script>

<style scoped="scoped">
	.pagelist-container {
		height: calc(100% - 29px)
	}
	
	.el-transfer-panel__list{
		line-height: normal;
	}
</style>
