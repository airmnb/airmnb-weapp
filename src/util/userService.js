import {apiClient} from "./restClient";

class UserService {
  async get(id){
    return await apiClient.get(`users/${id}`);
  }

  async save(user) {
    //await apiClient.post('users', user);
  }
}
const userService = new UserService();
export default userService;
