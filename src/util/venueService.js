import {apiClient} from "./restClient";
import amb from "@/util/amb";

class VenusService {
  async get(id){
    const resp = await apiClient.get(`venues/${id}`);
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
    venue.providerId = amb.config.user.userId;
    await apiClient.post('venues', venue);
  }

  async getMine() {
    const providerId = amb.config.user.userId;
    const resp = await apiClient.get('venues', {providerId});
    return resp.venues;
  }

  async update(venue) {
    venue = amb.cleanSetModel(venue);
    await apiClient.put(`venues/${venue.venueId}`, venue);
  }

  getAddress(venue) {
    const props = [
      venue.addr1,
      venue.addr2,
      venue.addr3,
      venue.city,
      venue.state,
      venue.country,
      venue.postcode
    ];
    return props.filter(x => x).join(' ');
  }
}

const venueService = new VenusService();
export default venueService;
