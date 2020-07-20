<template>
	<el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0">
	</el-switch>
</template>

<script>
	export default {
		props: {
			pValue: {
				type: Number,
				default:1
			}
		},
		model: {
			prop: 'pValue',
			event: 'change'
		},
		name: 'fc-switch',
		data() {
			let value;
			if(this.pValue ==null){
				value = "1";
			}else{
				value = this.pValue.toString();
			}
			return {
				value
			}
		},
		watch: {
			value(val) {
				this.$emit('change', parseInt(val));
			},
			pValue(val){
				if(val ==null){
					value = "1";
				}else{
					this.value = val.toString();
				}
			}
		}
	}
</script>

<style>
</style>
