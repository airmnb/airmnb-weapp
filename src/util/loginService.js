import restClient from "./restClient";
import wepy from 'wepy';

class LoginService {
  async login() {
    try {
      // Always call API to get the profile
      // TOOD: Cache the profile in storage.
      throw "debug"; 
      await wepy.checkSession();
    }catch(e) {
      const user = await this.localLogin();
      const wechatUserInfo = await this.getWechatUserInfo();
      return Object.assign({
        nickName: wechatUserInfo.nickName,
        avatarUrl: wechatUserInfo.avatarUrl,
      }, user);
    }
  }

  async localLogin() {
    const resp = await wepy.login();
    const code = resp.code;
    const user = await restClient.get('/auth/wechat/login', {code});
    return user;
  }

  async getWechatUserInfo() {
    const res = await wepy.getUserInfo({withCredentials: true});
    return res.userInfo;
  }
}

const loginService = new LoginService();

export default loginService;
