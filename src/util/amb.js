import wepy from 'wepy';
import i18n from '@/util/i18n'

const amb = amb || {};
const defaultLanguage = 'zh_CN';
const now = new Date();
const timezoneOffsetHours = - now.getTimezoneOffset()/60;
const timezone = timezoneOffsetHours >= 0 ? '+' + timezoneOffsetHours : '' + timezoneOffsetHours;
// const defaultLanguage = 'en';
amb.config = { 
	app_url2: 'https://www.airmnb.com', 
	app_url: 'http://localhost:5000',
	api_version: '1.0',
	language: defaultLanguage,
	timezone: timezone,
	jwt: null,
	user: null,
	ibsAppKey: 'E2FBZ-OTQ3O-I5AWR-SWLTV-4I5FV-ZTBSQ', // Tencent Map Service http://lbs.qq.com/qqmap_wx_jssdk/method-geocoder.html
};

amb.chooseLanguage = function (lang) {
	amb.config.language = lang || defaultLanguage;
	refreshDic();
}

console.log('amb.config', amb.config);

amb.i18nDic = i18n;

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
		if(obj[x] === '' || obj[x] === undefined) {
			obj[x] = null;
		}
	});
	return obj;
}


function translate(str) {
	const langKey = amb.config.language;
	const dic = amb.i18nDic[langKey] || amb.i18nDic[defaultLanguage];
	const ret = dic[str] || '$[' + str + ']';
	return ret;
}

Object.defineProperty(String.prototype, 'i', {
	get: function () { 
		return translate(this);
	},
});

// const keys = Object.keys(i18n.en);
amb.pageI18nData = {};

function refreshDic(){
	Object.keys(i18n.en).forEach(k => {
		amb.pageI18nData[k] = translate(k);
		// Object.defineProperty(amb.pageI18nData, k, {
		// 	get: function () { 
		// 		return translate(k);
		// 	},
		// });
	});
}
refreshDic();


Object.defineProperty(String.prototype, 'i18n', {
  get: function(){
		return translate(this);
	}
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
