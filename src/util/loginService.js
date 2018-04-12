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
      const userId = await this.localLogin();
      const wechatUserInfo = await this.getWechatUserInfo();
      return {
        userId,
        nickName: wechatUserInfo.nickName,
        avatarUrl: wechatUserInfo.avatarUrl,
      };
    }
  }

  async localLogin() {
    const resp = await wepy.login();
    const code = resp.code;
    const userId = await restClient.get('/auth/wechat/login', {code});
    return userId;
  }

  async getWechatUserInfo() {
    const res = await wepy.getUserInfo({withCredentials: true});
    return res.userInfo;
  }
}

const loginService = new LoginService();

export default loginService;
