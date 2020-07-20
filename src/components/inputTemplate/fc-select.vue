<template>
	<el-select clearable v-model="value">
		<el-option :label="options.label" :value="options.value" v-for="(options,index) in config.options" :key="index"></el-option>
	</el-select>
</template>

<script>
	export default {
		props: {
			pValue: [String, Number],
			config:{
				type:[Object],
				default:()=>{
					return {
						options:[]
					}
				}
			}
		},
		model: {
			prop: 'pValue',
			event: 'change'
		},
		name: 'fc-select',
		data() {
			let value = this.pValue;
			return {
				value
			}
		},
		watch: {
			value(val) {
				this.$emit('change', val);
			},
			pValue(val){
				this.value = val;
			}
		}
	}
</script>

<style>
</style>
