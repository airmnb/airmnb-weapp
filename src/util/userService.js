import {apiClient} from "./restClient";

class UserService {
  async get(userId){
    return await apiClient.get(`users/${userId}/`);
  }

  async save(user) {
    await apiClient.put(`/users/${user.userId}`, user);
  }
}
const userService = new UserService();
export default userService;
