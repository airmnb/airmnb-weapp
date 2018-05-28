import {apiClient, publicClient, urlBase} from "./restClient";
import wepy from 'wepy';
import amb from '@/util/amb';
import QQMapWX from '@/util/qqmap-wx-jssdk.min';

const qqMap = new QQMapWX({
  key: amb.config.ibsAppKey
});

class MapService {
  // http://lbs.qq.com/qqmap_wx_jssdk/method-geocoder.html
  async sanitize(address) {
    return new Promise((ok, ng) => {
      qqMap.geocoder({
        address: address,
        success: res => {
          if(res.status == 0) {
            ok(res.result);
            return;
          }
          ng(res);
        },
        fail: ng
      });
    });
  }

  async getAddress(lng, lat) {
    return new Promise((ok, ng)=>{
      qqMap.reverseGeocoder(
        {
          location: {
            longitude: lng,
            latitude: lat
          },
          coord_type: 5, // Tencent, Google, Gaode
          success: res => {
            if(res.status == 0) {
              const venue = {
                name: res.result.formatted_addresses.recommend,
                latitude: lat,
                longitude: lng,
                addr1: res.result.address,
                state: res.result.address_component.province,
                city: res.result.address_component.city,
                country: res.result.ad_info.nation,
              };
              ok(venue);
              return;
            }
            ng(res);
          },
          fail: ng
        }
      );
    });
  }

  async getCurrentCoordinate() {
    const resp = await wepy.getLocation({
      type: 'gcj02',
      altitude: false
    });
    console.log('getCurrentCoordinate', resp);
    const addr = await this.getAddress(resp.longitude, resp.latitude);
    return {
      latitude: addr.latitude,
      longitude: addr.longitude,
      addr1: addr.addr1,
      city: addr.city,
      state: addr.state,
      country: addr.country,
    }
  }

  async chooseLocation() {
    const resp = await wepy.chooseLocation();
    return {
      name: resp.name,
      address: resp.address,
      latitude: resp.latitude,
      longitude: resp.longitude
    }
  }
}
const mapService = new MapService();
export default mapService;
