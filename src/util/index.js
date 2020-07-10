export default {
	filterParams : obj =>{
		let params = Object.assign({},obj);
		for (let key in params) {
			if (params[key] == null || params[key] == "") {
				delete params[key];
			}
		}
		return params;
	}
}