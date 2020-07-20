<template>
	<el-transfer v-model="value" :data="datalist" :titles="config.titles"></el-transfer>
</template>

<script>
	import http from '~/request/httpConfig'
	export default {
		props:{
			pValue: {
				default:()=>{
					return []
				}
			},
			config:{
				type: Object,
				default:()=>{
					return {
						titles:['候选区','已选区'],
						datalist:[],
						ajax:{
							url:null,
							params:{},
							parseData:(data)=>{return data}
						}
					}
				}
			}
		},
		model: {
			prop: 'pValue',
			event: 'change'
		},
		name: 'fc-switch',
		data() {
			let datalist = this.config.datalist;
			let value = this.pValue||[];
			return {
				value,
				datalist
			}
		},
		created(){
			this.getDatalist();
		},
		methods:{
			async getDatalist(){
				if(this.config.ajax.url!=null){
					let result = await http.get(this.config.ajax.url,this.config.ajax.params);
					this.datalist = this.config.ajax.parseData(result);
				}
			}
		},
		watch: {
			value(val) {
				this.$emit('change',val.join(","));
			},
			pValue(val){
				if(typeof val != 'string'){
					this.value = val||[];
				}
			}
		}
	}
</script>

<style>
	
</style>
