<template>
	<el-time-select
		v-model="value"
	   :placeholder="setting.placeholder">
	</el-time-select>
</template>

<script>
	export default {
		props: {
			pValue: [Number,String],
			config:[Object]
		},
		model: {
			prop: 'pValue',
			event: 'change'
		},
		name: 'fc-time-select',
		data() {
			let def = {
				placeholder: null
			}
			let setting = Object.assign(def, this.config);
			let value = this.parseValue(this.pValue);
			return {
				value,
				setting
			}
		},
		created(){
			if(this.pValue!==this.value){
				this.$emit('change', this.formatValue(this.value));
			}
		},
		methods:{
			parseValue(pValue){
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
