import {sysClient, apiClient} from "./restClient";
import wepy from 'wepy';
import amb from '@/util/amb';

class LoginService {
  async login() {
    const wechatUserInfo = await this.getWechatUserInfo();
    let jwt = null;
    try {
      // Always call API to get the profile
      // TOOD: Cache the profile in storage.
      throw "debug"; 
      await wepy.checkSession();
      jwt = this.getApiJwtFromLocalStorage();
    }catch(e) {
      const resp = await this.localLogin();
      jwt = resp.sessionToken;
      return Object.assign({
        nickName: wechatUserInfo.nickName,
        avatarUrl: wechatUserInfo.avatarUrl,
      }, resp);
    }finally{
      amb.config.jwt = jwt;
      this.saveApiJwtToLocalStorage(jwt);
      console.log('jwt', jwt);
    }
  }

  async getApiJwtFromLocalStorage(){
    const jwt = wx.getStorageSync('jwt') || null;
    if(!jet) {
      throw new Error('No jwt found in local storage')
    }
  }

  saveApiJwtToLocalStorage(jwt){
    wx.setStorageSync('jwt', jwt);
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
    let response = await sysClient.get('/login/weapp/', {code});

    console.log('/sys/login/weapp After', response);

    // apiClient.get('/users');
    // sysClient.get('/debug');
    return response;
  }

  async getWechatUserInfo() {
    const res = await wepy.getUserInfo({withCredentials: true});
    return res.userInfo;
  }
}

const loginService = new LoginService();

export default loginService;
