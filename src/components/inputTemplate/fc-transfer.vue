<template>
	<el-transfer v-model="value" :data="setting.datalist" :titles="setting.titles"></el-transfer>
</template>

<script>
	import http from '~/request/httpConfig'
	export default {
		props: {
			pValue: [Number, String, Array],
			config: [Object]
		},
		model: {
			prop: 'pValue',
			event: 'change'
		},
		name: 'fc-switch',
		data() {
			let def = {
				titles: ['候选区', '已选区'],
				datalist: [],
				ajaxUrl: null,
				ajaxParams: {},
				ajaxParseData: (data) => {
					return data
				}
			}
			let setting = Object.assign(def, this.config);
			let value = this.parseValue(this.pValue);
			return {
				value,
				setting
			}
		},
		created() {
			if (this.setting.ajaxUrl != null) {
				this.getDatalist();
			}
			if (this.pValue !== this.value) {
				this.$emit('change', this.formatValue(this.value));
			}
		},
		methods: {
			async getDatalist() {
				let result = await http.get(this.setting.ajaxUrl, this.setting.ajaxParams);
				this.setting.datalist = this.setting.ajaxParseData(result);
			},
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
