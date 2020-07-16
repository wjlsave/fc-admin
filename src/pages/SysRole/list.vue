<template>
	<div class="pagelist-container">
		<el-form :inline="true" size="medium" :model="paramForm" class="pagelist-form">
			<el-form-item>
				<el-input v-model="paramForm.roleName" placeholder="角色名称"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="search">查询</el-button>
				<el-button type="primary" icon="el-icon-edit" @click="dialogFormVisible = true">添加</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="tableData" height="calc(100% - 119px)" border style="width: 100%">
			<el-table-column prop="roleName" label="角色名称">
			</el-table-column>
			<el-table-column prop="roleDescription" label="角色描述">
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" align="center">
			</el-table-column>
			<el-table-column label="操作" width="200" fixed="right" align="center">
			      <template slot-scope="scope">
			        <el-button
			          size="mini"
					  type="warning"
			          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
			        <el-button
			          size="mini"
			          type="danger"
			          @click="cut(scope.$index, scope.row)">删除</el-button>
			      </template>
			    </el-table-column>
		</el-table>

		<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
		 :page-sizes="[10,20,50,100,1000,10000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
		 :total="total">
		</el-pagination>

		<el-dialog :title="editid?'修改角色':'添加角色'" :visible.sync="dialogFormVisible" width="800px" @closed="closed" :close-on-click-modal="false">
			<el-form :model="postForm" ref="postForm" :rules="rules" label-width="100px">
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="postForm.roleName" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="roleDescription">
					<el-input v-model="postForm.roleDescription" type="textarea" rows="4" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="资源权限">
					<el-tree :data="resourcelist" ref="resourceTree" :props="defaultProps"  node-key="id" :default-checked-keys="postForm.resourceids" show-checkbox default-expand-all>
						<div slot-scope="{ node, data }">
							<i :class="data.iconClass||iconClass[data.type]">{{data.resourceName}}</i>
						</div>
					</el-tree>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancel">取 消</el-button>
				<el-button type="primary" @click="add" v-if="editid==null">提 交</el-button>
				<el-button type="primary" @click="edit" v-if="editid!=null">修 改</el-button>
			</div>
		</el-dialog>
	</div>

</template>

<script>
	import {
		getSysRolePagelist,
		SysRoleDetail,
		SysRoleAdd,
		SysRoleEdit,
		SysRoleCut,
		getSysResourceTreelist
	} from '~/request/api.js';
	export default {
		data() {
			return {
				pageNum: 1,
				pageSize: 20,
				total: 0,
				paramForm: {
					roleName: null
				},
				tableData: [],
				dialogFormVisible: false,
				postForm: {
					roleName: null,
					roleDescription: null,
					resourceids: []
				},
				resourcelist: [],
				iconClass: ['el-icon-folder', 'el-icon-tickets', 'el-icon-mouse'],
				defaultProps: {
					children: 'children',
					label: 'resourceName'
				},
				rules: {
					roleName: [{
							required: true,
							message: '请输入角色名称',
							trigger: 'blur'
						},
						{
							range:{min:1,max:50},
							message: '不超过50个字符',
							trigger: 'blur'
						}
					],
					roleDescription: [{
							range:{min:1,max:1000},
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
			this.getResourcelist();
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
				let result = await getSysRolePagelist(params);
				this.tableData = result.list;
				this.total = result.total;
			},
			async getResourcelist() {
				let result = await getSysResourceTreelist({
					pageNum: 1,
					pageSize: 0
				});
				this.resourcelist = [{
					id: 0,
					resourceName: "资源",
					children: result,
					type: 0
				}];
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
			cancel() {
				this.dialogFormVisible = false;
			},
			async add() {
				this.$refs["postForm"].validate(async (valid) => {
					if (valid) {
						let params = Object.assign({},this.postForm);
						let checkedKeys = this.$refs["resourceTree"].getCheckedKeys();
						let halfCheckedKeys = this.$refs["resourceTree"].getHalfCheckedKeys();
						let resourceids =  checkedKeys.concat(halfCheckedKeys).filter(item=>{return item!==0});
						params.resourceids = resourceids.join(",");
						let result = await SysRoleAdd(this.$util.filterParams(params));
						this.dialogFormVisible = false;
						this.getPageInfo();
					}
				});
			},
			async edit() {
				this.$refs["postForm"].validate(async (valid) => {
					if (valid) {
						let params = Object.assign({id:this.editid},this.postForm);
						let checkedKeys = this.$refs["resourceTree"].getCheckedKeys();
						let halfCheckedKeys = this.$refs["resourceTree"].getHalfCheckedKeys();
						let allCheckedKeys = checkedKeys.concat(halfCheckedKeys);
						let resourceids = allCheckedKeys.filter(item=>{
							return item!==0
						});
						params.resourceids = resourceids.join(",");
						let result = await SysRoleEdit(this.$util.filterParams(params));
						this.dialogFormVisible = false;
						this.getPageInfo();
					}
				});
			},
			async handleEdit(index,row){
				this.editid = row.id;
				let result = await SysRoleDetail({id:row.id});
				this.dialogFormVisible = true;
				let resourceids = result.resourceids;
				delete result.resourceids;
				this.postForm = this.$util.OverrideObject(this.postForm,result);
				this.$nextTick().then(() =>{
				    let resourceTree = this.$refs["resourceTree"];
					resourceTree.setChecked(0,false,true);
					resourceids.forEach(item=>{
						let node = resourceTree.getNode(item);
						if(node!=null&&node.isLeaf){
							resourceTree.setChecked(item,true);
						}
					});
				    
				})
			},
			cut(index,row){
				this.$confirm('此操作将永久删除角色信息, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(async () => {
				          let result = await SysRoleCut({id:row.id});
						  this.getPageInfo();
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消删除'
				          });
						});
			},
			closed() {
				this.$refs["postForm"].resetFields();
				this.editid = null;
				this.postForm.resourceids = [];
				this.$refs["resourceTree"].setChecked(0,false,true);
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
