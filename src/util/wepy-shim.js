import wepy from 'wepy';
import amb from "@/util/amb";

function setData(wepypage, key, value) {
	const keys = key.split('.');
	let prop = wepypage;
	// console.log('setData', key, value, keys);
	keys.forEach((k, i) => {
		// console.log('iteration', k);
		const m = /^(.+)\[([0-9]+)\]$/.exec(key);
		const isLast = (i === keys.length - 1);
		if(m) {
			// the key is an array & index format like 'arr[0]'.
			key = m[1];
			index = m[2];
			if(prop[key] === undefined || prop[key] === null){
				prop[key] = [];
			}
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
				if(prop[k] === undefined || prop[k] === null) {
					prop[k] = {};
				}
				prop = prop[k];
			}
		}

		if(prop === undefined) {
			prop = {};
		}
	});
}

function updateDataFunc(wepypage, obj) {
	Object.keys(obj).forEach(k => {
		setData(wepypage, k, obj[k]);
	});
	// Has to update $wxpage as well, otherwise the real mobile doesn't update the UI.
	wepypage.$wxpage.setData(obj);
	wepypage.$apply();
}

const $initFunc = wepy.page.prototype.$init;
wepy.page.prototype.$init = function() {
	// Call parent's $init
  $initFunc.apply(this, arguments);

	const wepypage = this;
	// Add an updateDate method on wx.Page object
	this.$wxpage.updateData = function(obj) {
		updateDataFunc(wepypage, obj);
	}
}

wepy.page.prototype.updateData = function(obj) {
	updateDataFunc(this, obj);
}

wepy.page.prototype.cleanClone = function(obj) {
	const ret = {};
	Object.keys(obj).forEach(x => {
		const value = obj[x];
		ret[x] = value === undefined || value === null ? '' : value;
	});
	return ret;
}

wepy.page.prototype.updateLangData = function() {
	const wepyPage = this;
	const i = wepyPage.data.i;
	const data = {};
	Object.keys(i).forEach(k => {
		const key = `i.${k}`;
		data[key] = k.i18n;
	});
	wepyPage.updateData(data);
}

wepy.page.prototype.setPageUx = function(titleKey) {
	const wepyPage = this;
	wepy.setNavigationBarTitle({
		title: titleKey.i18n
	});
	wepyPage.updateData({
		i: amb.pageI18nData
	});
}
