import wepy from 'wepy';

const amb = amb || {};

amb.config = { 
	app_url2: 'https://www.airmnb.com', 
	app_url: 'http://localhost:5000',
	api_path: '/api/1.0',
	language: 'en'
};

// Only supports three languages en, zh_CN, zh_TW
// https://developers.weixin.qq.com/miniprogram/dev/api/open.html
amb.i18nDic = {
	"en": {
		"map_search_bar": "Search"
	},
	"zh_CN": {
		"map_search_bar": "搜  索"
  },
  "zh_TW": {

  }
}

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

amb.i18n = function(key, lang) {
	const langKey = lang || amb.config.language;
	const dic = amb.i18nDic[langKey];
	return dic[key] || key;
}

String.prototype.i18n = function(lang) {
  return amb.i18n(this, lang);
}

export default amb;
