import {apiClient} from "./restClient";
import amb from "@/util/amb";

class ActivityService {
  async get(id){
    const resp = await apiClient.get(`activities/${id}`);
    return resp.activity;
  }
  async delete(id){
    const resp = await apiClient.delete(`activities/${id}`);
    if(resp.error) {
      throw new Error(resp.error);
    }
  }
  async add(activity) {
    activity = amb.cleanSetModel(activity);
    activity.providerId = amb.config.user.userId;
    await apiClient.post('activities', activity);
  }

  async queryMyActivities(query) {
    const providerId = amb.config.user.userId;
    const params = Object.assign({providerId}, query);
    const resp = await apiClient.get('activities', params);
    return resp.activities;
  }

  async getOngoing() {
    return await this.queryMyActivities({});
  }

  async getHistory() {
    return await this.queryMyActivities({});
  }

  async update(activity) {
    activity = amb.cleanSetModel(activity);
    await apiClient.put(`activities/${activity.venueId}`, activity);
  }
}

const venueService = new ActivityService();
export default venueService;
