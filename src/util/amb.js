import wepy from 'wepy';
import i18n from '@/util/i18n'

const amb = amb || {};

amb.config = { 
	app_url2: 'https://www.airmnb.com', 
	app_url: 'http://localhost:5000',
	api_path: '/api/1.0',
	language: 'en'
};

// Only supports three languages en, zh_CN, zh_TW
// https://developers.weixin.qq.com/miniprogram/dev/api/open.html
amb.i18nDic = i18n;

amb.data = {};

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

amb.blah = (key) => {
	return key.toUpperCase();
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

export default amb;
