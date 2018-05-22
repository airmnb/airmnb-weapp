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
    console.log('activity to save', activity);
    activity = amb.cleanSetModel(activity);
    activity.providerId = amb.config.user.userId;
    await apiClient.post('activities', activity);
  }

  async getOngoing() {
    const resp = await apiClient.get('activities/ongoing');
    return resp.activities;
  }

  async getHistory() {
    const resp = await apiClient.get('activities/closed');
    return resp.activities;
  }

  async update(activity) {
    activity = amb.cleanSetModel(activity);
    await apiClient.put(`activities/${activity.activityId}`, activity);
  }
}

const venueService = new ActivityService();
export default venueService;
