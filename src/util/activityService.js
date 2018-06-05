import {apiClient} from "./restClient";
import amb from "@/util/amb";
import imageService from '@/util/imageService'
import cacheService from "@/util/cacheService";

class ActivityService {
  constructor(){
    this.cache = cacheService.for('activities');
  }

  async get(id, force = false){
    if(!force) {
      const cached = this.cache.get(id);
      if(cached) return cached;
    }

    const resp = await apiClient.get(`activities/${id}`);
    const activity = resp.activity;
    this.cache.set(activity.activityId, activity);
    return activity;
  }
  async delete(id){
    const resp = await apiClient.delete(`activities/${id}`);
    if(resp.error) {
      throw new Error(resp.error);
    }
    this.cache.remove(id)
  }
  async add(activity) {
    console.log('activity to save', activity);
    activity = amb.cleanSetModel(activity);
    activity.providerId = amb.config.user.userId;

    // cache
    const neo = await apiClient.post('activities', activity);
    this.cache.set(neo.activityId, neo);
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

  async getOngoing(force = false) {
    if(!force) {
      const cached = cacheService.for('activity/ongoing').get();
      if(cached) return cached;
    }

    const resp = await apiClient.get('activities/ongoing');
    const activities = this.setAvatarImageUrl(resp.activities)

    // cache
    activities.forEach(x => this.cache.set(x.activityId, x));
    cacheService.for('activity/ongoing').set(null, activities);

    return activities;
  }

  async getClosed(force = false) {
    if(!force) {
      const cached = cacheService.for('activity/closed').get();
      if(cached) return cached;
    }

    const resp = await apiClient.get('activities/closed');
    const activities = this.setAvatarImageUrl(resp.activities)

    // cache
    activities.forEach(x => this.cache.set(x.activityId, x));
    cacheService.for('activity/closed').set(null, activities);

    return activities;
  }

  async getRecommended(force = false){
    if(!force) {
      const cached = cacheService.for('activity_recommended').get();
      if(cached) return cached;
    }

    const resp = await apiClient.get('activities/recommended');
    const activities = this.setAvatarImageUrl(resp.activities)

    // cache
    activities.forEach(x => this.cache.set(x.activityId, x));
    cacheService.for('activity_recommended').set(null, activities);

    return activities;  
  }

  async update(activity) {
    activity = amb.cleanSetModel(activity);
    const saved = await apiClient.put(`activities/${activity.activityId}`, activity);
    this.cache.set(saved.activityId, saved)
  }

  setAvatarImageUrl(activities) {
    activities.forEach(x => {
      if(x.imageIds && x.imageIds.length) {
        x.avatarImageUrl = imageService.getSrcUrl(x.imageIds[0]);
      }
    });
    return activities;
  }

  getImageUrls(activity) {
    const ids = activity.imageIds;
    if(!ids) return [];
    return ids.map(id => imageService.getSrcUrl(id));
  }
}

const venueService = new ActivityService();
export default venueService;
