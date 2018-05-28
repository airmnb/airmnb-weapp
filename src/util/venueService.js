import {apiClient} from "./restClient";
import amb from "@/util/amb";
import mapService from "@/util/mapService";

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
    // console.log('venue before', venue);
    await this.tryAttachGeoCoordinate(venue);
    // console.log('venue after', venue);
    await apiClient.post('venues', venue);
  }

  async getMine() {
    const providerId = amb.config.user.userId;
    const resp = await apiClient.get('venues', {providerId});
    return resp.venues;
  }

  async update(venue) {
    venue = amb.cleanSetModel(venue);
    await this.tryAttachGeoCoordinate(venue);
    await apiClient.put(`venues/${venue.venueId}`, venue);
  }

  async tryAttachGeoCoordinate(venue) {
    if(venue.latitude !== null && venue.longitude !== null) return;
    console.log('No coordinate info, attaching it');
    const address = this.getAddressForQqMap(venue);
    const mapResult = await mapService.sanitize(address);
    venue.latitude = mapResult.location.lat;
    venue.longitude = mapResult.location.lng;
    venue.state = mapResult.address_components.province;
    venue.city = mapResult.address_components.city;
    venue.mapService = 'tencent';
  }

  getAddressForQqMap(venue) {
    return [venue.state, '省', venue.city, '市', venue.addr3, venue.addr2, venue.addr1].filter(x => !!x).join('');
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
