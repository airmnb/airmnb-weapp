import wepy from 'wepy';

function setData(wepypage, key, value) {
	const keys = key.split('.');
	let prop = wepypage;
	keys.forEach((k, i) => {
		const m = /^(.+)\[([0-9]+)\]$/.exec(key);
		const isLast = (i === keys.length - 1);
		if(m) {
			// the key is an array & index format like 'arr[0]'.
			key = m[1];
			index = m[2];
			if(isLast) {
				// Leaf property
				prop[key][index] = value;
			}else{
				prop = prop[key][index];
			}
		} else {
			// the key is a property name
			if(isLast) {
				// Leaf property
				prop[k] = value;
			}else{
				prop = prop[k]
			}
		}
	});
}

function updateData(wepypage, obj) {
	Object.keys(obj).forEach(k => {
		setData(wepypage, k, obj[k]);
	});
}

const $initFunc = wepy.page.prototype.$init;
wepy.page.prototype.$init = function() {
  $initFunc.apply(this, arguments);

	const wepypage = this;
	// Add an updateDate method on wx.Page object
	this.$wxpage.updateData = function(obj) {
		updateData(wepypage, obj);
	}
}
