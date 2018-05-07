import {apiClient} from "./restClient";
import amb from "@/util/amb";

class BabyService {
  async get(id){
    return await apiClient.get(`babies/${id}`);
  }

  async add(baby) {
    baby = amb.cleanSetModel(baby);
    baby.creatorId = amb.data.user.userId;
    await apiClient.post('babies', baby);
  }

  async update(baby) {
    baby = amb.cleanSetModel(baby);
    await apiClient.put('babies', baby);
  }
}

const babyService = new BabyService();
export default babyService;
