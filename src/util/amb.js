import wepy from 'wepy';
import i18n from '@/util/i18n'
import UPNG from 'upng-js'

const amb = amb || {};

amb.config = { 
	app_url: 'https://www.airmnb.com', 
	app_url2: 'http://localhost:5000',
	api_path: '/api/1.0',
	language: 'en',
	jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ0b3B0YWwuY29tIiwiZXhwIjoxNDI2NDIwODAwLCJodHRwOi8vdG9wdGFsLmNvbS9qd3RfY2xhaW1zL2lzX2FkbWluIjp0cnVlLCJjb21wYW55IjoiVG9wdGFsIiwiYXdlc29tZSI6dHJ1ZX0.yRQYnWzskCZUxPwaQupWkiUzKELZ49eM7oWxAQK_ZXw'
};

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

const drawCanvas = function(canvas) {
	return new Promise((res, rej) => {
		canvas.draw(false, () => {
			res();
		});
	});
}

amb.chooseImageBase64Src = async (canvasId, imgWidth, imgHeight) => {
	const canvas = wx.createCanvasContext(canvasId)
	const res = await wepy.chooseImage({
		count: 1,
		sizeType: ['compressed'],
	});
	// 1. 绘制图片至canvas
	canvas.drawImage(res.tempFilePaths[0], 0, 0, imgWidth, imgHeight)
	await drawCanvas(canvas);
	// 绘制完成后执行回调，API 1.7.0
	// 2. 获取图像数据， API 1.9.0
	const imageData = await wepy.canvasGetImageData({
			canvasId: canvasId,
			x: 0,
			y: 0,
			width: imgWidth,
			height: imgHeight,
	});
	// 3. png编码
	const pngData = UPNG.encode([imageData.data.buffer], imageData.width, imageData.height)
	// 4. base64编码
	const base64 = wx.arrayBufferToBase64(pngData)
	return `data:image/png;base64,${base64}`;
}

export default amb;
