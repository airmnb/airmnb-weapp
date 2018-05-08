import {sysClient, apiClient} from "./restClient";
import wepy from 'wepy';
import amb from '@/util/amb';

class LoginService {
  async login() {
    const wechatUserInfo = await this.getWechatUserInfo();
    console.log('wechatUserInfo', wechatUserInfo);
    let jwt = null;
    let user = null;
    try {
      // Always call API to get the profile
      // TOOD: Cache the profile in storage.
      // throw "force to do wxlogin for debugging"; 
      // 
      // If both wx session is available and airmnb jwt token exists, don't relogin
      await wepy.checkSession();
      console.log('wx session is available');
      jwt = this.getApiJwtFromLocalStorage();
      this.setJwtToken(jwt);
      console.log('airmnb jwt found in local storage', jwt);
      user = await this.getUserFromWhoAmI();
    }catch(e) {
      console.log('starting relogin due to', e);
      const resp = await this.localLogin();
      jwt = resp.sessionToken;
      this.setJwtToken(jwt);
      user = resp.user;
      user.avatarUrl = wechatUserInfo.avatarUrl;
      user.nickName = user.nickName || wechatUserInfo.nickName;
      console.log('internal user', user);
      return user;
    }finally{
      amb.config.user = user;
      console.log('login info done', jwt, user);
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


  async localLogin() {
    // TODO: Mock user here for debug
    // return {
    //   id: '680ed7ac-6a3d-4b6c-b534-1008f1c9caf3',
    //   nickName: 'superopengl',
    //   fullName: 'Jun Shao',
    //   mobile: '0405581228',
    //   email: 'mr.shaojun@gmail.com'
    // };

    const wxResp = await wepy.login();
    const code = wxResp.code;
    let response = await sysClient.get('/login/weapp', {code});

    console.log('/sys/login/weapp After', response);

    // apiClient.get('/users');
    // sysClient.get('/debug');
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
