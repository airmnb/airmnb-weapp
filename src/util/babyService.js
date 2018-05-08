import {apiClient} from "./restClient";
import amb from "@/util/amb";

class BabyService {
  async get(id){
    const resp = await apiClient.get(`babies/${id}`);
    if(resp.errorMessage) {
      throw new Error(resp.errorMessage);
    }
    return resp.baby;
  }

  async add(baby) {
    baby = amb.cleanSetModel(baby);
    baby.creatorId = amb.data.user.userId;
    await apiClient.post('babies', baby);
  }

  async getMine() {
    const creatorId = amb.data.user.userId;
    const resp = await apiClient.get('babies', {creatorId});
    if(!resp.errorCode) {
      return resp.babies;
    }
    throw new Error(resp.errorMessage);
  }

  async update(baby) {
    baby = amb.cleanSetModel(baby);
    await apiClient.put(`babies/${baby.babyId}`, baby);
  }
}

const babyService = new BabyService();
export default babyService;
