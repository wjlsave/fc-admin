import axios from 'axios'
import router from '~/router/index'
import cookie from 'vue-cookie'
import qs from 'qs'

import {
	Message
} from 'element-ui';
import {
	Loading
} from 'element-ui';
import {
	Notification
} from 'element-ui';

const http = {}
const baseURL = 'http://localhost:666/fcserver';

let instance = axios.create({
	timeout: 5000,
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded'
	},
	baseURL,
	validateStatus(status) {
		switch (status) {
			case 400:
				Message({
					showClose: true,
					message: '请求错误(' + status + ')',
					type: 'error'
				});
				break;
			case 401:
				Message({
					showClose: true,
					message: '授权失败，请重新登录(' + status + ')',
					type: 'error'
				});
				router.push({
					path: "/login"
				});
				break;
			case 403:
				Message({
					showClose: true,
					message: '拒绝访问(' + status + ')',
					type: 'error'
				});
				break
			case 404:
				Message({
					showClose: true,
					message: '请求错误,未找到该资源(' + status + ')',
					type: 'error'
				});
				break
			case 500:
				Message({
					showClose: true,
					message: '服务端错误(' + status + ')',
					type: 'error'
				});
				break
		}
		return status >= 200 && status < 300
	}
})

// 添加请求拦截器
instance.interceptors.request.use(
	function(config) {
		config.headers.Authorization = cookie.get('token');
		return config;
	},
	function(error) {
		return Promise.reject(error);
	}
)

// 响应拦截器即异常处理
instance.interceptors.response.use(
	response => {
		return response.data;
	},
	err => {
		if (err && err.response) {

		} else {
			err.response = '连接服务器失败';
		}
		return Promise.reject(err.response);
	}
)

http.post = function(url, data, options = {
	isShowLoading: true,
	successMessage: "操作成功"
}, errorMethod) {
	let loadinginstance;
	if (options.isShowLoading !== false) {
		loadinginstance = Loading.service({
			fullscreen: true,
			background: 'rgba(0, 0, 0, 0.7)',
			text: "加载中..."
		});
	}
	return new Promise((resolve, reject) => {
		instance
			.post(url, qs.stringify(data), options)
			.then(response => {
				if (options.isShowLoading !== false) {
					loadinginstance.close();
				}
				if (response.code == 0) {
					if (options.successMessage) {
						Notification({
							title: '成功',
							message: options.successMessage,
							type: 'success'
						});
					}
					resolve(response.data);
				} else {
					if (typeof errorMethod == "function") {
						errorMethod();
					}
					Notification.error({
						title: '错误',
						message: response.msg + "(errorcode:" + response.code + ")"
					});
					reject(response.msg);
				}
			})
			.catch(e => {
				if (options.isShowLoading !== false) {
					loadinginstance.close();
				}
				reject(e);
			});
	})
}

http.get = function(url, data, options = {
	isShowLoading: true
}) {
	let loadinginstance;
	if (options.isShowLoading !== false) {
		loadinginstance = Loading.service({
			fullscreen: true,
			background: 'rgba(0, 0, 0, 0.7)',
			text: "加载中..."
		});
	}
	return new Promise((resolve, reject) => {
		instance
			.get(url, {params:data}, options)
			.then(response => {
				if (options.isShowLoading !== false) {
					loadinginstance.close();
				}
				if (response.code == 0) {
					resolve(response.data);
				} else {
					Notification.error({
						title: '错误',
						message: response.msg + "(errorcode:" + response.code + ")"
					});
					reject(response.msg);
				}
			})
			.catch(e => {
				if (options.isShowLoading !== false) {
					loadinginstance.close();
				}
				reject(e);
			})
	})
}

export default http
