import {apiClient} from "./restClient";
import amb from "@/util/amb";

class VenusService {
  async get(id){
    const resp = await apiClient.get(`venues/${id}`);
    if(resp.error) {
      throw new Error(resp.error);
    }
    return resp.venue;
  }
  async delete(id){
    const resp = await apiClient.delete(`venues/${id}`);
    if(resp.error) {
      throw new Error(resp.error);
    }
  }
  async add(venue) {
    venue = amb.cleanSetModel(venue);
    venue.providerId = amb.data.user.userId;
    await apiClient.post('venues', venue);
  }

  async getMine() {
    console.log('amb.data.user', amb.data.user);
    const providerId = amb.data.user.userId;
    const resp = await apiClient.get('venues', {providerId});
    if(!resp.error) {
      return resp.venues;
    }
    throw new Error(resp.error);
  }

  async update(venue) {
    venue = amb.cleanSetModel(venue);
    await apiClient.put(`venues/${venue.venueId}`, venue);
  }
}

const venueService = new VenusService();
export default venueService;
