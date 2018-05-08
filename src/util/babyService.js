import {apiClient} from "./restClient";
import amb from "@/util/amb";

class BabyService {
  async get(id){
    const resp = await apiClient.get(`babies/${id}`);
    if(resp.error) {
      throw new Error(resp.error);
    }
    return resp.baby;
  }
  async delete(id){
    const resp = await apiClient.delete(`babies/${id}`);
    if(resp.error) {
      throw new Error(resp.error);
    }
  }
  async add(baby) {
    baby = amb.cleanSetModel(baby);
    baby.creatorId = amb.data.user.userId;
    await apiClient.post('babies', baby);
  }

  async getMine() {
    const creatorId = amb.data.user.userId;
    const resp = await apiClient.get('babies', {creatorId});
    if(!resp.error) {
      return resp.babies;
    }
    throw new Error(resp.error);
  }

  async update(baby) {
    baby = amb.cleanSetModel(baby);
    await apiClient.put(`babies/${baby.babyId}`, baby);
  }
}

const babyService = new BabyService();
export default babyService;
