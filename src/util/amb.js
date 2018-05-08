import wepy from 'wepy';
import i18n from '@/util/i18n'
import UPNG from 'upng-js'

const amb = amb || {};

amb.config = { 
	app_url2: 'https://www.airmnb.com', 
	app_url: 'http://localhost:5000',
	api_version: '1.0',
	language: 'en',
	jwt: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzZXNzaW9uSWQiOiI0MmUwMDFhZS00NjQ5LTQ2MGItYjIzYy0zNjczNzRhY2YyMDUiLCJ1c2VySWQiOiJmZGFiYzk2Yi03MDQ0LTQyZWUtOTMwMC0zMjJiZjQ1ZDk0MzEiLCJleHRyYSI6eyJkYXRhIjoid2hhdGV2ZXIifX0.djCKSEpqWMTDP-CxN_Tam86I7X4R9fq6zRlToawiMn4'
};

console.log('amb.config', amb.config);

// Only supports three languages en, zh_CN, zh_TW
// https://developers.weixin.qq.com/miniprogram/dev/api/open.html
amb.i18nDic = i18n;

amb.data = {};

amb.getDate = function(offsetDays) {
	let today = new Date()
	today.setDate(today.getDate() + (offsetDays || 0));
	return today.toISOString().slice(0, 10);
}

amb.getTime = function(offsetMins) {
	let now = new Date();
	now = new Date(now.getTime() + (offsetMins || 0)*60000);
	return now.toLocaleTimeString().substring(0,5);
}

// Loading dialog
amb.loading = (seconds)=>{
	wepy.showLoading({
			mask: true
		});
	setTimeout(() => wepy.hideLoading(), 1000 * (seconds || 3));
}

function getCurrentPageUrl(){
	const pages = getCurrentPages();
	const currentPage = pages[pages.length-1];
	return currentPage.route;
}

amb.setLocale = (lang) => {
  if(lang && amb.config.language !== lang) {
		amb.config.language = lang;
  }
}

amb.cleanSetModel = (obj) => {
	Object.keys(obj).forEach(x => {
		const value = obj[x];
		if(value === '' || value === undefined) {
			obj[x] = null;
		}
	});
	return obj;
}


function translate(str) {
	const langKey = amb.config.language;
	const dic = amb.i18nDic[langKey];
	return dic[str] || dic['en'] || '$[' + str + ']';
}

Object.defineProperty(String.prototype, 'i', {
	get: function () { 
		return translate(this);
	},
});

const keys = Object.keys(i18n.en);

amb.pageI18nData = {};
Object.keys(i18n.en).forEach(k => {
	amb.pageI18nData[k] = translate(k);
	// Object.defineProperty(amb.pageI18nData, k, {
	// 	get: function () { 
	// 		return translate(k);
	// 	},
	// });
});

const isObject = function(x){
	return x && x.constructor.name === 'object';
}

Object.update = function(target, update) {
	if(!isObject(target) || !isObject(update)) return target;
	Object.keys(target).forEach(k => {
		if(update[k] !== undefined) {
			target[k] = update[k];
		}
	});
}

const drawCanvas = function(canvas) {
	return new Promise((res, rej) => {
		canvas.draw(false, () => {
			res();
		});
	});
}

function throwError(message, err) {
	if(err === undefined) {
		throw message;
	}
	const errDetails = err.toString();
	throw new Error(`${message}: ${errDetails}`);
}

export default amb;
