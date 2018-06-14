import {sysClient, apiClient} from "./restClient";
import wepy from 'wepy';
import amb from '@/util/amb';

class LoginService {
  async checkSession(){
    try{
      await wepy.checkSession();
      console.log('wx session is available');
      return true;
    }catch(e){
      return false;
    }
  }

  async login() {
    const wechatUserInfo = await this.getWechatUserInfo();
    console.log('wechatUserInfo', wechatUserInfo);
    const wechatNickName = wechatUserInfo.nickName;
    amb.chooseLanguage(wechatUserInfo.language);
    console.log('amb', amb)
    let jwt = null;
    let user = null;
    try {
      // Always call API to get the profile
      // TOOD: Cache the profile in storage.
      // throw "force to do wxlogin for debugging"; 
      // 
      // If both wx session is available and airmnb jwt token exists, don't relogin
      await wepy.checkSession();
      // console.log('wx session is available');
      jwt = this.getApiJwtFromLocalStorage();
      this.setJwtToken(jwt);
      console.log('airmnb jwt found in local storage', jwt);
      user = await this.getUserFromWhoAmI();
    }catch(e) {
      console.log('starting relogin due to', e);
      const resp = await this.localLogin(wechatNickName);
      jwt = resp.sessionToken;
      this.setJwtToken(jwt);
      user = resp.user;
      user.avatarUrl = wechatUserInfo.avatarUrl;
      user.nickName = user.nickName || wechatNickName;
      console.log('internal user', user);
      return user;
    }finally{
      amb.config.user = user;
      amb.chooseLanguage(user.language);
      console.log('login info done', jwt, user, amb.config.language);
    }
  }

  getApiJwtFromLocalStorage(){
    const jwt = wx.getStorageSync('jwt');
    if(!jwt) {
      throw new Error('No jwt found in local storage')
    }
    return jwt;
  }

  setJwtToken(jwt){
    if(!jwt) throw new Error('Empty jwt is invalid.')
    wx.setStorageSync('jwt', jwt);
    amb.config.jwt = jwt;
  }


  async localLogin(wechatNickName) {
    const wxResp = await wepy.login();
    console.log('wx resp', wxResp);
    const code = wxResp.code;
    const response = await sysClient.get('/login/weapp', {code, wechatNickName});
    console.log('/sys/login/weapp After', response);
    return response;
  }

  async getWechatUserInfo() {
    const res = await wepy.getUserInfo({withCredentials: true});
    return res.userInfo;
  }

  async getUserFromWhoAmI(){
    const resp = await sysClient.get('/whoami');
    console.log('/whoami response', resp);
    return resp.user;
  }
}

const loginService = new LoginService();

export default loginService;
