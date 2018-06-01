import {apiClient} from "./restClient";
import amb from "@/util/amb";
import imageService from '@/util/imageService'

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

  async getWithinRadius(clat, clng, radius) {
    const resp = await apiClient.get('activities/map', {
      clat,
      clng,
      radius,
    });
    const activities = this.setAvatarImageUrl(resp.activities)
    return activities;
  }

  async getOngoing() {
    const resp = await apiClient.get('activities/ongoing');
    const activities = this.setAvatarImageUrl(resp.activities)
    return activities;
  }

  async getClosed() {
    const resp = await apiClient.get('activities/closed');
    const activities = this.setAvatarImageUrl(resp.activities)
    return activities;
  }

  async getRecommended(){
    const resp = await apiClient.get('activities/recommended');
    const activities = this.setAvatarImageUrl(resp.activities)
    return activities;  
  }

  async update(activity) {
    activity = amb.cleanSetModel(activity);
    await apiClient.put(`activities/${activity.activityId}`, activity);
  }

  setAvatarImageUrl(activities) {
    activities.forEach(x => {
      if(x.imageIds && x.imageIds.length) {
        x.avatarImageUrl = imageService.getSrcUrl(x.imageIds[0]);
      }
    });
    return activities;
  }
}

const venueService = new ActivityService();
export default venueService;
