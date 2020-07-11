<template>
	<el-tree :data="treelist" :props="defaultProps" node-key="id" default-expand-all @node-drag-start="handleDragStart"
	 @node-drag-enter="handleDragEnter" @node-drag-leave="handleDragLeave" @node-drag-over="handleDragOver" @node-drag-end="handleDragEnd"
	 @node-drop="handleDrop" draggable :allow-drop="allowDrop" :allow-drag="allowDrag">
		<div class="custom-tree-node" slot-scope="{ node, data }">
			<i :class="{'el-icon-folder':data.type===0,'el-icon-tickets':data.type==1,'el-icon-mouse':data.type==2}">{{data.resourceName}}</i>
			<span>
				<el-button type="text" size="mini" @click="() => append(data)">
					Append
				</el-button>
				<el-button type="text" size="mini" @click="() => remove(node, data)">
					Delete
				</el-button>
			</span>
		</div>
	</el-tree>
	<!-- el-icon-tickets
el-icon-document
el-icon-video-play
el-icon-mouse -->
</template>

<script>
	import {
		getSysResourceTreelist
	} from '~/request/api.js';
	export default {
		data() {
			return {
				treelist: [],
				defaultProps: {
					children: 'children',
					label: 'resourceName'
				}
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
			append(data) {
				const newChild = {
					id: id++,
					label: 'testtest',
					children: []
				};
				if (!data.children) {
					this.$set(data, 'children', []);
				}
				data.children.push(newChild);
			},

			remove(node, data) {
				const parent = node.parent;
				const children = parent.data.children || parent.data;
				const index = children.findIndex(d => d.id === data.id);
				children.splice(index, 1);
			},
			handleDragStart(node, ev) {
				console.log('drag start', node);
			},
			handleDragEnter(draggingNode, dropNode, ev) {
				console.log('tree drag enter: ', dropNode.label);
			},
			handleDragLeave(draggingNode, dropNode, ev) {
				console.log('tree drag leave: ', dropNode.label);
			},
			handleDragOver(draggingNode, dropNode, ev) {
				console.log('tree drag over: ', dropNode.label);
			},
			handleDragEnd(draggingNode, dropNode, dropType, ev) {
				console.log('tree drag end: ', dropNode && dropNode.label, dropType);
			},
			handleDrop(draggingNode, dropNode, dropType, ev) {
				console.log('tree drop: ', dropNode.label, dropType);
			},
			allowDrop(draggingNode, dropNode, type) {
				/* if (dropNode.data.label === '二级 3-1') {
					return type !== 'inner';
				} else {
					return true;
				} */
				return true;
			},
			allowDrag(draggingNode) {
				return true;
				// return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
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
