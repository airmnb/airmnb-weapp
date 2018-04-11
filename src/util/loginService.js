import restClient from "./restClient";
import wepy from 'wepy';

class LoginService {
  async login() {
		const resp = await wepy.login();
		const code = resp.code;
		console.log('login code: ', code);

    const profile = await restClient.get('/auth/wechat/login', {code});
		console.log('login profile: ', profile);
    
    return profile;
  }

  async getWechatUserInfo() {

  }
}

const loginService = new LoginService();

export default loginService;
