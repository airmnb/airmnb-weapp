import {apiClient} from "./restClient";
import amb from "@/util/amb";
import imageService from '@/util/imageService'
import cacheService from "@/util/cacheService";

class FavoriteService {
  constructor(){
    this.cache = cacheService.for('favorites');
  }

  async delete(id){
    const resp = await apiClient.delete(`favorites/${id}`);
    if(resp.error) {
      throw new Error(resp.error);
    }
    this.cache.remove(id)
  }

  async add(activity) {
    activity.providerId = amb.config.user.userId;
    const payload = {
      activityId: activity.activityId,
      providerId: activity.providerId,
      consumerId: amb.config.user.userId,
    }
    // cache
    const neo = await apiClient.post('favorites', payload);
    this.cache.set(neo.favorite.favoriteId, neo.favorite);
    return neo.favorite;
  }

  async getMyFavorites(force = false) {
    if(!force) {
      const cached = cacheService.for('favorites').get();
      if(cached) return cached;
    }

    const resp = await apiClient.get('favorites');
    const favorites = resp.favorites

    // cache
    favorites.forEach(x => this.cache.set(x.favoriteId, x));
    cacheService.for('favorites').set(null, favorites);

    return favorites;
  }
}

const favoriteService = new FavoriteService();
export default favoriteService;
