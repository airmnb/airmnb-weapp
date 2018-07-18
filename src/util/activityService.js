import {apiClient} from "./restClient";
import amb from "@/util/amb";
import imageService from '@/util/imageService'
import cacheService from "@/util/cacheService";
import favoriteService from '@/util/favoriteService';

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
    this.cache.set(neo.activity.activityId, neo.activity);
  }

  async getWithinRadius(clat, clng, radius) {
    const resp = await apiClient.get('activities/search', {
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

  // isValid(activity) {
  //   let isStartValid = true;
  //   if(activity.startDate) {
  //     if(activity.startTime) {
  //       const sTime = new Date(activity.startDate + ' ' + activity.startTime)
  //       isStartValid = new Date().getTime() <= sTime.getTime();
  //     }else{
  //       const sTime = new Date(activity.startDate + ' ' + activity.startTime)
  //     }
  //   }
  //   let isEndValid = true;
  //   if(activity.endData) {
  //     if(activity.endTime) {
  //       // With end time
  //     }else {
  //       // No end time
  //     }
  //   }
  //   return isStartValid && isEndValid;
  // }

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

  async getPurchased(force = false) {
    if(!force) {
      const cached = cacheService.for('activity/purchased').get();
      if(cached) return cached;
    }

    const resp = await apiClient.get('activities/purchased');
    const activities = this.setAvatarImageUrl(resp.activities)

    // cache
    activities.forEach(x => this.cache.set(x.activityId, x));
    cacheService.for('activity/purchased').set(null, activities);

    return activities;
  }

  async getMyFavorites(force = false) {
    const favorites = await favoriteService.getMyFavorites(force);
    const tasks = favorites.map(f => this.get(f.activityId, force));
    let activities = await Promise.all(tasks);
    activities = this.setAvatarImageUrl(activities)
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

  async search(opt, force = false) {
    opt = opt || {};
    if(!force) {
      const cached = cacheService.for('search').get();
      if(cached) return cached;
    }

    const resp = await apiClient.get('activities/search', opt);
    const activities = this.setAvatarImageUrl(resp.activities)

    // cache
    activities.forEach(x => this.cache.set(x.activityId, x));
    cacheService.for('search').set(null, activities);

    return activities;
  }

  async getAvailabilities(activityId) {
    const resp = await apiClient.get(`activities/${activityId}/timeslots`);
    return resp.timeslots;
  }

  async update(activity) {
    activity = amb.cleanSetModel(activity);
    const saved = await apiClient.put(`activities/${activity.activityId}`, activity);
    this.cache.set(saved.activityId, saved)
  }

  setAvatarImageUrl(activities) {
    if(!Array.isArray(activities)) {
      const x = activities
      if(x.imageIds && x.imageIds.length) {
        x.avatarImageUrl = imageService.getSrcUrl(x.imageIds[0]);
      }
      return x;
    }
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

const activityService = new ActivityService();
export default activityService;
