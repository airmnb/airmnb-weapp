import {apiClient} from "./restClient";
import amb from "@/util/amb";
import cacheService from "@/util/cacheService";

class BabyService {
  constructor(){
    this.cache = cacheService.for('baby');
  }

  async get(id, force = false){
    if(!force) {
      const cached = this.cache.get(id);
      if(cached) return cached;
    }

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
    this.cache.remove(id)    
  }
  async add(baby) {
    baby = amb.cleanSetModel(baby);
    baby.creatorId = amb.config.user.userId;
    const neo = await apiClient.post('babies', baby);
    this.cache.set(neo.babyId, neo);
  }

  async getMine(force = false) {
    if(!force) {
      const cached = cacheService.for('my_babies').get();
      if(cached) return cached;
    }

    const creatorId = amb.config.user.userId;
    const resp = await apiClient.get('babies', {creatorId});
    if(resp.error) {
      throw new Error(resp.error);
    }

    const babies = resp.babies;
    // cache
    babies.forEach(x => this.cache.set(x.babyId, x));
    cacheService.for('my_babies').set(null, babies);

    return babies;
  }

  async update(baby) {
    baby = amb.cleanSetModel(baby);
    const updated = await apiClient.put(`babies/${baby.babyId}`, baby);
    this.cache.set(updated.babyId, updated);
  }
}

const babyService = new BabyService();
export default babyService;
