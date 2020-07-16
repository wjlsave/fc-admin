<template>
	<div>
		<el-row>
			<el-col :span="12">
				<el-tree :data="treelist" :props="defaultProps" node-key="id" default-expand-all :allow-drag="allowDrag" :allow-drop="allowDrop"  @node-drop="handleDrop" draggable >
					<div class="custom-tree-node" slot-scope="{ node, data }">
						<i :class="data.iconClass||iconClass[data.type]">{{data.resourceName}}</i>
						<span>
							<el-button type="text" size="mini" @click="handleAdd(data)" v-if="data.type!=2">
								添加
							</el-button>
							<el-button type="text" class="Danger" size="mini" @click="cut(data)">
								删除
							</el-button>
							<el-button type="text" size="mini" @click="handleEdit(data)">
								修改
							</el-button>
							<el-button type="text" size="mini" @click="support(data)">
								支撑接口
							</el-button>
						</span>
					</div>
				</el-tree>
			</el-col>
		</el-row>

		<el-dialog :title="editid?'修改资源':'添加资源'" :visible.sync="dialogFormVisible" width="800px" @closed="closed"
		 :close-on-click-modal="false">
			<el-form :model="postForm" ref="postForm" :rules="rules" label-width="100px">
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
				<el-button type="primary" @click="add" v-if="editid==null">提 交</el-button>
				<el-button type="primary" @click="edit" v-if="editid!=null">修 改</el-button>
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
		SysResourceTreeDrag
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
							trigger: 'blur'
						},
						{
							range: {
								max: 50
							},
							trigger: 'blur'
						}
					],
					type: [{
						required: true,
						trigger: 'blur'
					}],
					path: [{
							required: true,
							trigger: 'blur'
						},
						{
							range: {
								max: 200
							},
							trigger: 'blur'
						}
					],
					iconClass: [{
						range: {
							max: 100
						},
						trigger: 'blur'
					}]
				},
				editid: null
			};
		},
		created() {
			this.getTreelist();
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
				let result = await SysResourceDetail({
					id: data.id
				});
				this.dialogFormVisible = true;
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
			support(data) {

			},
			closed() {
				this.$refs["postForm"].resetFields();
				this.editid = null;
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
			}
		}
	};
</script>

<style>
	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}
</style>
