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

// Loading dialog
amb.loading = (seconds)=>{
	wepy.showLoading({
			mask: true
		});
	setTimeout(() => wepy.hideLoading(), 1000 * (seconds || 3));
}

amb.setLocale = (lang) => {
  if(lang) {
    amb.config.language = lang;
  }
}

amb.blah = (key) => {
	return key.toUpperCase();
}

Object.defineProperty(String.prototype, 'i', {
	get: function () { 
		const langKey = amb.config.language;
		const dic = amb.i18nDic[langKey];
		return dic[this] || dic['en'] || this;
	},
});

export default amb;
