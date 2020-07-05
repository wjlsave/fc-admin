import axios from 'axios'
import qs from 'qs'
import cookie from 'vue-cookie'

axios.defaults.baseURL = 'http://localhost:666/fcserver';

export function get(url, params) {
	return new Promise((resolve, reject) => {
		axios.get(url, {
			params: params,
			headers: {'Authorization': cookie.get('token')}
		}).then(res => {
			resolve(res.data);
		}).catch(err => {
			reject(err.data)
		})
	});
}

export function post(url, params) {
	return new Promise((resolve, reject) => {
		axios.post(url, qs.stringify(params))
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err.data)
			})
	});
}
