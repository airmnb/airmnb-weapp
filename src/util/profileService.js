import {apiClient} from "./restClient";

class ProfileService {
  async get(userId){
    return await restClient.get(`users/${userId}`);
  }

  async save(profile) {
    await restClient.post(`users`, profile);
  }
}
const profileService = new ProfileService();
export default profileService;
