import {apiClient} from "./restClient";
import amb from '@/util/amb';

class UserService {
  async get(userId){
    const resp = await apiClient.get(`users/${userId}`);
    if(resp.errorMessage) {
      throw new Error(resp.errorMessage);
    }
    return resp.user;
  }

  async save(user) {
    amb.cleanSetModel(user);
    console.log('save user', user)
    await apiClient.put(`/users/${user.userId}`, user);
  }
}
const userService = new UserService();
export default userService;
