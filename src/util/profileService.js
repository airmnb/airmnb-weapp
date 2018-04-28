import {apiClient} from "./restClient";

class ProfileService {
  async get(userId){
    return await apiClient.get(`users/${userId}`);
  }

  async save(profile) {
    await apiClient.post(`users`, profile);
  }
}
const profileService = new ProfileService();
export default profileService;
