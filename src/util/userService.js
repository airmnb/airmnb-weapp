import {apiClient} from "./restClient";
import amb from '@/util/amb';

class UserService {
  async get(userId){
    return await apiClient.get(`users/${userId}`);
  }

  async save(user) {
    amb.cleanSetModel(user);
    console.log('save user', user)
    await apiClient.put(`/users/${user.userId}`, user);
  }
}
const userService = new UserService();
export default userService;
