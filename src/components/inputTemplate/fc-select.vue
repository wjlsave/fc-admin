<template>
	<el-select clearable v-model="value">
		<el-option :label="option.label" :value="option.value" v-for="(option,index) in setting.options" :key="index"></el-option>
	</el-select>
</template>

<script>
	export default {
		props: {
			pValue: [String, Number],
			config:[Object]
		},
		model: {
			prop: 'pValue',
			event: 'change'
		},
		name: 'fc-select',
		data() {
			let def = {
				options: []
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
