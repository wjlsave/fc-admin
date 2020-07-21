export default {
	filterParams : obj =>{
		let params = Object.assign({},obj);
		for (let key in params) {
			if (params[key] == null||params[key]=="") {
				delete params[key];
			}
		}
		return params;
	},
	OverrideObject:(target ,obj) =>{
		for (let key in target) {
			if(obj[key]!==undefined ){
				target[key] = obj[key];
			}
		}
		return target;
	}
}