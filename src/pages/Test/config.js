export default {
	modelInfo: {
		name: "用户",
		code: "SysUser"
	},
	module:[false,false,true,true,false],
	paramFormConfig: [{
			component: "el-input",
			bindingCode: "account",
			placeholder: "填写账户"
		},
		{
			component: "el-input",
			bindingCode: "userName",
			placeholder: "填写姓名"
		},
		{
			component: "fc-select",
			bindingCode: "state",
			config: {
				options: [{
					label: "启用",
					value: 1
				}, {
					label: "禁用",
					value: 0
				}]
			}
		},
	],
	tableConfig: [{
			bindingCode: "account",
			label: "账户",
			width: 180,
			align: "left"
		},
		{
			bindingCode: "userName",
			label: "姓名",
			width: 180,
			align: "left"
		}, {
			bindingCode: "state",
			label: "状态",
			width: 120,
			align: "center",
			component: "fc-tag"
		}, {
			bindingCode: "createTime",
			label: "创建时间",
			width: 180,
			align: "center"
		}, {
			bindingCode: "lastLoginTime",
			label: "最后登录时间",
			minWidth: 180,
			align: "center"
		}
	],
	postFormConfig: [{
			label: "账户名称",
			component: "el-input",
			bindingCode: "account"
		},
		{
			label: "用户姓名",
			component: "fc-textinput",
			bindingCode: "userName"
		},
		{
			label: "启用状态",
			component: "fc-switch",
			bindingCode: "state",
		},
		{
			label: "创建时间",
			component: "fc-time-select",
			bindingCode: "createTime3"
		},
		{
			label: "创建时间",
			component: "fc-time-picker",
			bindingCode: "createTime2"
		},
		{
			label: "创建时间",
			component: "fc-date-picker",
			bindingCode: "createTime"
		},
		{
			component: "fc-checkbox",
			bindingCode: "state",
			config: {
				options: [{
					label: "启用",
					value: "1"
				}, {
					label: "禁用",
					value: "0"
				}]
			}
		},
		{
			component: "fc-select",
			bindingCode: "state",
			config: {
				options: [{
					label: "启用",
					value: "1"
				}, {
					label: "禁用",
					value: "0"
				}]
			}
		},
		{
			component: "fc-radio",
			bindingCode: "radio3",
			config: {
				options: [{
					label: "选项A",
					value: "1"
				}, {
					label: "选项B",
					value: "2"
				}, {
					label: "选项C",
					value: "3"
				}]
			}
		},
		{
			label: "角色选择",
			component: "fc-transfer",
			bindingCode: "roleids",
			config: {
				titles: ['待选角色', '已选角色'],
				ajaxUrl: "SysRole/pagelist",
				ajaxParams: {
					pageNum: 1,
					pageSize: 0
				},
				ajaxParseData: (result) => {
					let rolelist = [];
					for (let i = 0; i < result.list.length; i++) {
						rolelist.push({
							key: result.list[i].id.toString(),
							label: result.list[i].roleName
						});
					}
					return rolelist;
				}
			}
		}
	],
	rules: {
		account: [{
				required: true,
				message: '请输入账户名称',
				trigger: 'blur'
			},
			{
				pattern: /^[a-zA-Z0-9_-]{4,16}$/,
				message: '4到16位（字母，数字，下划线，减号）',
				trigger: 'blur'
			}
		],
		userName: [{
				required: true,
				message: '请输入用户姓名',
				trigger: 'blur'
			},
			{
				pattern: /^[\u4E00-\u9FA5A-Za-z\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$/,
				message: '用户姓名不合法',
				trigger: 'blur'
			}
		],
	}
}
