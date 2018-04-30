import {appClient} from "./restClient";
import wepy from 'wepy';
import amb from '@/util/amb';


class LoginService {
  async login() {
    const wechatUserInfo = await this.getWechatUserInfo();

    try {
      // Always call API to get the profile
      // TOOD: Cache the profile in storage.
      throw "debug"; 
      await wepy.checkSession();
    }catch(e) {
      const user = await this.localLogin();
      return Object.assign({
        nickName: wechatUserInfo.nickName,
        avatarUrl: wechatUserInfo.avatarUrl,
      }, user);
    }
  }

  async localLogin() {
    // TODO: Mock user here for debug
    return {
      id: '680ed7ac-6a3d-4b6c-b534-1008f1c9caf3',
      nickName: 'superopengl',
      fullName: 'Jun Shao',
      mobile: '0405581228',
      email: 'mr.shaojun@gmail.com'
    };

    const resp = await wepy.login();
    const code = resp.code;
    let user = await appClient.get('/api/1.0/auth/wechat/login', {code});

    console.log('/login/weapp', user);

    return user;
  }

  async getWechatUserInfo() {
    const res = await wepy.getUserInfo({withCredentials: true});
    return res.userInfo;
  }
}

const loginService = new LoginService();

export default loginService;
