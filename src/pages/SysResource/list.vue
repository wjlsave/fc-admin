<template>
	<div>
		<el-row>
			<el-col :span="12">
				<el-tree :data="treelist" :props="defaultProps" node-key="id" default-expand-all :expand-on-click-node="false" :allow-drag="allowDrag" :allow-drop="allowDrop"  @node-drop="handleDrop" draggable >
					<div class="custom-tree-node" slot-scope="{ node, data }">
						<i :class="data.iconClass||iconClass[data.type]">{{data.resourceName}}</i>
						<span>
							<el-button type="text" size="mini" @click="handleAdd(data)" v-if="data.type!=2&&$store.state.ButtonPermission.addSysResource">
								添加
							</el-button>
							<el-button type="text" style="color: #E6A23C;" size="mini" @click="handleEdit(data)" v-if="data.id!==0&&!$store.state.ButtonPermission.editSysResource&&$store.state.ButtonPermission.seeSysResource">
								查看
							</el-button>
							<el-button type="text" style="color: #E6A23C;" size="mini" @click="handleEdit(data)" v-if="data.id!==0&&$store.state.ButtonPermission.editSysResource">
								修改
							</el-button>
							<el-button type="text" style="color: #F56C6C;" class="Danger" size="mini" @click="cut(data)" v-if="data.id!==0&&$store.state.ButtonPermission.cutSysResource">
								删除
							</el-button>
							<el-button type="text" style="color: #F56C6C;" size="mini" @click.native.prevent="support(data)" v-if="data.id!==0&&$store.state.ButtonPermission.supportApi">
								支撑接口
							</el-button>
						</span>
					</div>
				</el-tree>
			</el-col>
		</el-row>

		<el-dialog :title="editid?($store.state.ButtonPermission.editSysResource?'修改资源':'查看资源'):'添加资源'" :visible.sync="dialogFormVisible" width="800px" @closed="closed"
		 :close-on-click-modal="false">
			<el-form :model="postForm" ref="postForm" :rules="rules" label-width="100px" :disabled="editid&&!$store.state.ButtonPermission.editSysResource">
				<el-form-item label="资源名称" prop="resourceName">
					<el-input v-model="postForm.resourceName" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="资源类别" prop="type">
					<el-radio v-model="postForm.type" label="1">菜单</el-radio>
					<el-radio v-model="postForm.type" label="2">按钮</el-radio>
				</el-form-item>
				<el-form-item label="资源路径" prop="path">
					<el-input v-model="postForm.path" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="资源图标" prop="iconClass">
					<el-input v-model="postForm.iconClass" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="add"  v-if="!editid&&$store.state.ButtonPermission.addSysResource">提 交</el-button>
				<el-button type="primary" @click="edit"  v-if="editid&&$store.state.ButtonPermission.editSysResource">修 改</el-button>
			</div>
		</el-dialog>
		<el-dialog title="设置支撑接口" :visible.sync="dialogSetVisible" width="800px" @close="closeSet" :close-on-click-modal="false">
			<el-form :model="setForm" ref="setForm" label-width="0">
				<el-form-item>
					<el-transfer filterable :filter-method="filterMethod" filter-placeholder="" 
					v-model="setForm.apiids" :data="apilist" :titles="['待选接口', '已选接口']"></el-transfer>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogSetVisible = false">取 消</el-button>
				<el-button type="primary" @click="addSet">提 交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		getSysResourceTreelist,
		SysResourceDetail,
		SysResourceCut,
		SysResourceAdd,
		SysResourceEdit,
		SysResourceTreeDrag,
		getSysApiPagelist,
		getSysResourceApis,
		setSysResourceApis
	} from '~/request/api.js';
	export default {
		data() {
			return {
				treelist: [],
				defaultProps: {
					children: 'children',
					label: 'resourceName'
				},
				iconClass: ['el-icon-folder', 'el-icon-tickets', 'el-icon-mouse'],
				dialogFormVisible: false,
				postForm: {
					parentId: null,
					resourceName: null,
					type: null,
					path: null,
					iconClass: null
				},
				rules: {
					resourceName: [{
							required: true,
							message: '请输入资源名称',
							trigger: 'blur'
						},
						{
							range: {
								max: 50
							},
							message: '不超过50个字符',
							trigger: 'blur'
						}
					],
					type: [{
						required: true,
						message: '请选择资源类别',
						trigger: 'blur'
					}],
					path: [{
							required: true,
							message: '请输入资源路径',
							trigger: 'blur'
						},
						{
							range: {
								max: 200
							},
							message: '不超过200个字符',
							trigger: 'blur'
						}
					],
					iconClass: [{
						range: {
							max: 100
						},
						message: '不超过100个字符',
						trigger: 'blur'
					}]
				},
				editid: null,
				dialogSetVisible:false,
				setForm:{
					apiids:[]
				},
				apilist:[]
			};
		},
		created() {
			this.getTreelist();
			this.getApiList();
		},
		methods: {
			async getTreelist() {
				let result = await getSysResourceTreelist({});
				this.treelist = [{
					id: 0,
					resourceName: "菜单",
					children: result,
					type: 0
				}];
			},
			async getApiList() {
				let result = await getSysApiPagelist({
					pageNum: 1,
					pageSize: 0
				});
				this.apilist = [];
				for (let i = 0; i < result.list.length; i++) {
					this.apilist.push({
						key: result.list[i].id,
						label: result.list[i].apiPath
					});
				}
			},
			handleAdd(data) {
				this.dialogFormVisible = true;
				this.postForm.parentId = data.id;
			},
			async add() {
				this.$refs["postForm"].validate(async (valid) => {
					if (valid) {
						let params = Object.assign({}, this.postForm);
						let result = await SysResourceAdd(this.$util.filterParams(params));
						this.dialogFormVisible = false;
						this.getTreelist();
					}
				});
			},
			async handleEdit(data) {
				this.editid = data.id;
				this.dialogFormVisible = true;
				let result = await SysResourceDetail({
					id: data.id
				});
				this.postForm = this.$util.OverrideObject(this.postForm, result);
				this.postForm.type+="";
			},
			async edit() {
				this.$refs["postForm"].validate(async (valid) => {
					if (valid) {
						let params = Object.assign({
							id: this.editid
						}, this.postForm);
						let result = await SysResourceEdit(this.$util.filterParams(params));
						this.dialogFormVisible = false;
						this.getTreelist();
					}
				});
			},
			cut(data) {
				this.$confirm('此操作将永久删除资源信息, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					let result = await SysResourceCut({
						id: data.id
					});
					this.getTreelist();
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			allowDrag(node) {
				if(node.data.id===0){
					return false;
				}
				return true;
			},
			allowDrop(draggingNode, dropNode, type) {
				if(type=='inner'&&dropNode.data.type==2){
					return false;
				}
				return true;
			},
			async handleDrop(draggingNode, dropNode, dropType, ev) {
				let parentNode;
				if(dropType=='inner'){
					parentNode = dropNode;
				}else{
					parentNode = dropNode.parent;
				}
				let parentid = parentNode.data.id;
				let childrenids = parentNode.data.children.map((item)=>{
					return item.id;
				}).join(",");
				let result = await SysResourceTreeDrag({
					parentid,
					childrenids
				},()=>{
					this.getTreelist();
				});
			},
			async support(data) {
				this.editid = data.id;
				this.dialogSetVisible = true;
				let result = await getSysResourceApis({id:data.id});
				this.setForm.apiids = result;
			},
			async addSet() {
				let result = await setSysResourceApis({
					id:this.editid,
					apiids:this.setForm.apiids.join(",")
				});
				this.dialogSetVisible = false;
			},
			closed() {
				this.$refs["postForm"].resetFields();
				this.editid = null;
			},
			closeSet() {
				this.$refs["setForm"].resetFields();
				this.editid = null;
				this.setForm.apiids = [];
			},
			filterMethod(query, item) {
				return item.label.indexOf(query) > -1;
			}
		}
	};
</script>

<style scoped="scoped">
	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}
	
	.el-transfer-panel{
		line-height: normal;
		width: 325px;
	}
	
</style>
