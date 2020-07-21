<template>
	<el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0">
	</el-switch>
</template>

<script>
	export default {
		props: {
			pValue: [Number,String]
		},
		model: {
			prop: 'pValue',
			event: 'change'
		},
		name: 'fc-switch',
		data() {
			let value = this.parseValue(this.pValue);
			return {
				value
			}
		},
		created(){
			if(this.pValue!==this.value){
				this.$emit('change', this.formatValue(this.value));
			}
		},
		methods:{
			parseValue(pValue){
				if(pValue==null){pValue=1}
				return typeof pValue == 'number'?pValue.toString():pValue;
			},
			formatValue(value){
				return value;
			}
		},
		watch: {
			value(val) {
				this.$emit('change', this.formatValue(val));
			},
			pValue(val){
				let value = this.parseValue(val);
				this.value = value;
			}
		}
	}
</script>

<style>
</style>
