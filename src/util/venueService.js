import {apiClient} from "./restClient";
import amb from "@/util/amb";
import mapService from "@/util/mapService";
import cacheService from "@/util/cacheService";

class VenusService {
  constructor(){
    this.cache = cacheService.for('venue');
  }

  async get(id, force = false){
    if(!force) {
      const cached = this.cache.get(id);
      if(cached) return cached;
    }
    
    const resp = await apiClient.get(`venues/${id}`);
    return resp.venue;
  }
  async delete(id){
    const resp = await apiClient.delete(`venues/${id}`);
    if(resp.error) {
      throw new Error(resp.error);
    }
    this.cache.remove(id)
  }
  async add(venue) {
    venue = amb.cleanSetModel(venue);
    venue.providerId = amb.config.user.userId;
    // console.log('venue before', venue);
    await this.tryAttachGeoCoordinate(venue);
    // console.log('venue after', venue);
    const neo = await apiClient.post('venues', venue);
    this.cache.set(neo.venueId, neo);
  }

  async getMine(force = false) {
    if(!force) {
      const cached = cacheService.for('my_venues').get();
      if(cached) return cached;
    }

    const providerId = amb.config.user.userId;
    const resp = await apiClient.get('venues', {providerId});
    const venues = resp.venues;

    // cache
    venues.forEach(x => this.cache.set(x.venueId, x));
    cacheService.for('my_venues').set(null, venues);

    return venues;
  }

  async update(venue) {
    venue = amb.cleanSetModel(venue);
    await this.tryAttachGeoCoordinate(venue);
    const updated = await apiClient.put(`venues/${venue.venueId}`, venue);
    this.cache.set(updated.venueId, updated);
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
