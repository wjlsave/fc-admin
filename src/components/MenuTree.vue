<template>
    <div>
        <template v-for="value in this.menuData">
            <el-submenu :index="value.path" v-if="value.children&&value.children.length>0">
                <template slot="title">
                    <i :class="value.iconClass||iconClass[value.type]"></i>
                    <span slot="title">{{value.resourceName}}</span>
                </template>
                <MenuTree :menuData="value.children"></MenuTree>
            </el-submenu>
            <el-menu-item :index="value.path" v-else>
                <i :class="value.iconClass||iconClass[value.type]"></i>
                <span slot="title">{{value.resourceName}}</span>
            </el-menu-item>
        </template>
    </div>
</template>

<script>
  export default {
    props: ['menuData'],
    name: 'MenuTree',
	data(){
		return {
			iconClass: ['el-icon-folder', 'el-icon-tickets', 'el-icon-mouse']
		}
	}
  }
</script>
