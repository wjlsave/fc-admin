<template>
	<fc-list 
	:modelInfo = "modelInfo"
	:paramFormConfig = "paramFormConfig"
	:tableConfig = "tableConfig"
	:postFormConfig="postFormConfig"
	:rules="rules"></fc-list>
</template>

<script>
	import fcList from '~/components/pageTemplate/fc-list.vue'
	import config from './config.js'
	export default {
		data() {
			return config
		},
		components:{
			"fc-list":fcList
		}
	}
	
</script>

<style>
</style>
