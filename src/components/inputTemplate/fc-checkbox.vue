<template>
	<el-checkbox-group v-model="value">
		<el-checkbox :label="option.value" v-for="(option,index) in setting.options" :key="index" :border='setting.border'>{{option.label}}</el-checkbox>
	</el-checkbox-group>
</template>

<script>
	export default {
		props: {
			pValue: [Number, String, Array],
			config: [Object]
		},
		model: {
			prop: 'pValue',
			event: 'change'
		},
		name: 'fc-checkbox',
		data() {
			let def = {
				options: [],
				border: true
			}
			let setting = Object.assign(def, this.config);
			let value = this.parseValue(this.pValue);
			return {
				value,
				setting
			}
		},
		created() {
			if (this.pValue !== this.value) {
				this.$emit('change', this.formatValue(this.value));
			}
		},
		methods: {
			parseValue(pValue) {
				let value = [];
				if (!pValue) {
					value = [];
				} else if (typeof pValue == "string" || typeof pValue == "number") {
					value = pValue.toString().split(",");
				} else if (typeof pValue == "object") {
					value = pValue.map(item => {
						return item.toString();
					});
				}
				return value;
			},
			formatValue(value) {
				return value.join(",") || null
			}
		},
		watch: {
			value(val) {
				this.$emit('change', this.formatValue(val));
			},
			pValue(val) {
				let value = this.parseValue(val);
				this.value = value;
			}
		}
	}
</script>

<style>
</style>
