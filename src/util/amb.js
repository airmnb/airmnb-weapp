import wepy from 'wepy';
import i18n from '@/util/i18n'

let isProd = true;
// isProd = false;
const amb = amb || {};
const defaultLanguage = 'zh_CN';
const now = new Date();
const timezoneOffsetMinutes = - now.getTimezoneOffset();
const timeOffset = timezoneOffsetMinutes >= 0 ? '+' + timezoneOffsetMinutes : '' + timezoneOffsetMinutes;
const color_secondary = '#03a9f4';

// const defaultLanguage = 'en';
amb.config = {
	// app_url: isProd ? 'https://www.airmnb.com' : 'https://52.221.237.198', //'http://localhost:5000',
	app_url: isProd ? 'https://www.airmnb.com' : 'http://localhost:5000',
	api_version: '1.0',
	language: defaultLanguage,
	timeOffset: timeOffset,
	jwt: null,
	user: null,
	ibsAppKey: 'E2FBZ-OTQ3O-I5AWR-SWLTV-4I5FV-ZTBSQ', // Tencent Map Service http://lbs.qq.com/qqmap_wx_jssdk/method-geocoder.html
	tabbars: [
		{
			index:0,
			pagePath: 'pages/search/map',
			iconPath: 'images/search-light.png',
			selectedIconPath: 'images/search.png',
			text: 'tabbar_search'
		},
		{
			index:1,
			pagePath: 'pages/mine/mine',
			iconPath: 'images/shop-light.png',
			selectedIconPath: 'images/shop.png',
			text: 'tabbar_me'
		},
		{
			index:2,
			pagePath: 'pages/provider/provider',
			iconPath: 'images/provider-light.png',
			selectedIconPath: 'images/provider.png',
			text: 'tabbar_provider'
		},
		{
			index:3,
			pagePath: 'pages/setting/setting',
			// iconPath: 'images/cog.png',
			iconPath: 'images/cog-light.png',
			selectedIconPath: 'images/cog.png',
			text: 'tabbar_settings'
		}
	]
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

amb.parseDateTime = function(strDate, strTime){
	// strDate: yyyy-MM-dd
	// strTime: HH:mm
	strDate = strDate || '1900-01-01';
	strTime = strTime || '00:00';
	return new Date(strDate + ' ' + strTime);
}

Date.prototype.toYMD = function() {
	const year = this.getFullYear().toString();
	const month = (this.getMonth() + 101).toString().substring(1);
	const day = (this.getDate() + 100).toString().substring(1);
	return year + "-" + month + "-" + day;
}

Date.prototype.toYMDHM = function() {
	const year = this.getFullYear().toString();
	const month = (this.getMonth() + 101).toString().substring(1);
	const day = (this.getDate() + 100).toString().substring(1);
	const hour = this.getHours();
	const minute = this.getMinutes();
	return `${year}/${month}/${day} ${hour}:${minute}`;
}

amb.showError = function(e, title) {
	wepy.hideLoading();
	console.log('amb.showError', e)
	wepy.showModal({
		title: (!title && title !== '') ? amb.pageI18nData.dialog_title_error : title,
		content: e.message || e.errMsg || e.name ||  e.toString(),
		showCancel: false,
		confirmColor: color_secondary,
		confirmText: amb.pageI18nData.button_ok
	})
}

amb.showConfirm = function(msg, title) {
	wepy.hideLoading();
	return wepy.showModal({
		title: title || '',
		content: msg,
		cancelText: amb.pageI18nData.button_cancel,
		confirmColor: color_secondary,
		confirmText: amb.pageI18nData.button_ok
	})
}

amb.i18nTabbar = function(){
	const list = amb.config.tabbars;
	list.forEach(x => {
		const opt = Object.assign({}, x)
		opt.text = x.text.i18n
		wepy.setTabBarItem(opt)
	});
}

amb.checkRequired = function(obj, propAndLabelDic) {
	const invalids = [];
	Object.keys(propAndLabelDic).forEach(k => {
		const v = obj[k];
		if (!v && v !==0) {
			invalids.push(propAndLabelDic[k])
		}
	})
	if(invalids.length) {
		const msg = invalids.join(', ')
		amb.showError(msg, amb.pageI18nData.dialog_title_missing_required_fields)
		return false;
	}
	return true;
}

export default amb;
