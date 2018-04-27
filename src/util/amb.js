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
		"map_search_bar": "Search",
		"stat_refresh": "Refresh",
		"stat_users": "Users",
		"stat_babies": "Babies",
		"stat_providers": "Providers",
		"stat_activities": "Activities",
		"stat_bookings": "Bookings",
		"stat_transactions": "Transactions",
		"stat_title": "Statistic",
		"map_title": "Air Mom & Baby"
	},
	"zh_CN": {
		"map_search_bar": "搜  索",
		"stat_refresh": "刷  新",
		"stat_users": "登录用户",
		"stat_babies": "登录的孩子",
		"stat_providers": "活动提供者（团体或个人）",
		"stat_activities": "创建的活动",
		"stat_bookings": "预约的活动",
		"stat_transactions": "成交的活动",
		"stat_title": "爱彼儿 - 统计数据",
		"map_title": "爱彼儿"
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
