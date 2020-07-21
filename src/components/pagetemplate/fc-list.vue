<template>
	<div class="pagelist-container">
		<el-form :inline="true" size="medium" v-model="paramForm">
			<el-form-item v-for="(inputConfig,index) in paramFormConfig" :key="index"  
			:label="inputConfig.label" :prop="inputConfig.bindingCode">
				<component :is="inputConfig.component" v-model="paramForm[inputConfig.bindingCode]" 
				:placeholder="inputConfig.placeholder" :config="inputConfig.config"></component>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="search">查询</el-button>
				<el-button type="primary" icon="el-icon-edit" @click="handleAdd" v-if="$store.state.ButtonPermission['add'+modelInfo.code]">添加</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="tableData" height="calc(100% - 119px)" border>
			<el-table-column v-for="(columnConfig,index) in tableConfig" :key="index"
				:prop="columnConfig.bindingCode" :label="columnConfig.label" :align="columnConfig.align" 
				:width="columnConfig.width" :min-width="columnConfig.minWidth">
				<div  slot-scope="scope">
					<div v-if="!!columnConfig.component"><component :is="columnConfig.component" :value="scope.row[columnConfig.bindingCode]"></component></div>
					<div v-else>{{scope.row[columnConfig.bindingCode]}}</div>
				</div>
			</el-table-column>
			<el-table-column label="操作" width="300" fixed="right" align="center">
			      <template slot-scope="scope">
					<el-button
					  size="mini"
					  type="primary"
					   v-if="!$store.state.ButtonPermission['edit'+modelInfo.code]&&$store.state.ButtonPermission['add'+modelInfo.code]"
					  @click="handleEdit(scope.$index, scope.row)">查看</el-button>
			        <el-button
			          size="mini"
					  type="warning"
					   v-if="$store.state.ButtonPermission['edit'+modelInfo.code]"
			          @click="handleEdit(scope.$index, scope.row)">修改</el-button>
			        <el-button
			          size="mini"
			          type="danger"
					  v-if="$store.state.ButtonPermission['cut'+modelInfo.code]"
			          @click="cut(scope.$index, scope.row)">删除</el-button>
			      </template>
			    </el-table-column>
		</el-table>
		<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
		 :page-sizes="[10,20,50,100,1000,10000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
		 :total="total">
		</el-pagination>
		<el-dialog :title="(editid?($store.state.ButtonPermission['edit'+modelInfo.code]?'修改':'查看'):'添加')+modelInfo.name" 
		:visible.sync="dialogFormVisible" width="800px" @close="close" :close-on-click-modal="false">
			<el-form :model="postForm" ref="postForm" :rules="rules" label-width="100px" :disabled="editid&&!$store.state.ButtonPermission['edit'+modelInfo.code]">
				<el-form-item v-for="(inputConfig,index) in postFormConfig" :key="index"
				:label="inputConfig.label" :prop="inputConfig.bindingCode">
					<component :is="inputConfig.component" v-model="postForm[inputConfig.bindingCode]" 
					:placeholder="inputConfig.placeholder" :config="inputConfig.config"></component>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				{{postForm}}
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="add" v-if="!editid&&$store.state.ButtonPermission['add'+modelInfo.code]">提 交</el-button>
				<el-button type="primary" @click="edit" v-if="editid&&$store.state.ButtonPermission['edit'+modelInfo.code]">修 改</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import http from '~/request/httpConfig'
	import components from './mycomponent'
	export default {
		props: {
			modelInfo:{
				type:Object,
				default:{
					name:"",
					code:""
				}
			},
			paramFormConfig: {
				type: Array,
				default:[]
			},
			postFormConfig:{
				type: Array,
				default:[]
			},
			tableConfig:{
				type: Array,
				default:[]
			},
			rules:{
				type: Object,
				default:{}
			},
		},
		name: 'fc-list',
		data() {
			let paramForm = {};
			this.paramFormConfig.forEach(item=>{
				paramForm[item.bindingCode] = null;
			});
			let postForm = {};
			this.postFormConfig.forEach(item=>{
				postForm[item.bindingCode] = null;
			});
			return {
				paramForm,
				postForm,
				tableData:[],
				pageNum: 1,
				pageSize: 20,
				total: 0,
				dialogFormVisible: false,
				editid:null
			}
		},
		components,
		created(){
			this.getPageInfo()
		},
		methods:{
			async getPageInfo() {
				let params = {
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}
				Object.assign(params, this.$util.filterParams(this.paramForm));
				let result = await http.get(this.modelInfo.code+'/pagelist',params);
				this.tableData = result.list;
				this.total = result.total;
			},
			search(){
				this.getPageInfo();
			},
			handleAdd(){
				this.dialogFormVisible = true
			},
			async handleEdit(index,row){
				this.editid = row.id;
				this.dialogFormVisible = true;
				let result = await http.get(this.modelInfo.code+'/detail',{id:row.id});
				this.postForm = this.$util.OverrideObject(this.postForm,result);
			},
			cut(index,row){
				this.$confirm('此操作将永久删除'+this.modelInfo.name+'信息, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(async () => {
							let result = await http.post(this.modelInfo.code+'/cut',{id:row.id});
						  this.getPageInfo();
				        }).catch(() => {	
				          this.$message({
				            type: 'info',
				            message: '已取消删除'
				          });
						});
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
			add() {
				this.$refs["postForm"].validate(async (valid) => {
					if (valid) {
						let params = Object.assign({},this.postForm);
						let result = await http.post(this.modelInfo.code+'/add',params);
						this.dialogFormVisible = false;
						this.getPageInfo();
					}
				});
			},
			edit() {
				this.$refs["postForm"].validate(async (valid) => {
					if (valid) {
						let params = Object.assign({id:this.editid},this.postForm);
						let result = await http.post(this.modelInfo.code+'/edit',params);
						this.dialogFormVisible = false;
						this.getPageInfo();
					}
				});
			},
			close() {
				this.postFormConfig.forEach(item=>{
					this.postForm[item.bindingCode] = null;
				});
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
