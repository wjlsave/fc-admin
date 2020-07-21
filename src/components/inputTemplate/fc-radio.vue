<template>
	<div>
		<el-radio v-model="value" :label="option.value"  v-for="(option,index) in setting.options" :key="index">{{option.label}}</el-radio>
	</div>
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
		name: 'fc-radio',
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
