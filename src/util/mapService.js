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
        fail: res => {
          ng(res);
        }
      });
    });
  }

  async getCurrentCoordinate() {
    const resp = await wepy.getLocation({
      type: 'gcj02',
      altitude: false
    });
    return {
      latitude: resp.latitude,
      longitude: resp.longitude
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
