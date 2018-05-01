import {apiClient} from "./restClient";

class BabyService {
  async get(id){
    return await apiClient.get(`babies/${id}`);
  }

  async save(baby) {
    await apiClient.post('babies', baby);
  }

  async update(baby) {
    await apiClient.put('babies', baby);
  }
}

const babyService = new BabyService();
export default babyService;
