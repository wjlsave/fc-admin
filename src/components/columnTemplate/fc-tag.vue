<template>
	<el-tag :type="value === 1 ? 'success' : 'danger'" disable-transitions>{{value === 1?'启用':'停用'}}</el-tag>
</template>

<script>
	export default {
		props: ["value"],
		name: 'fc-tag'
	}
</script>

<style>
</style>
