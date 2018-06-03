import {apiClient} from "./restClient";
import amb from "@/util/amb";
import mapService from "@/util/mapService";
import wepy from "wepy";

class CacheStore {
  constructor(name) {
    this.prefix = name + ':';
  }

  get(key) {
    if(key === undefined || key === null) key = '';
    try{
      return wepy.getStorageSync(this.prefix + key);
    }catch(e){
      return null;
    }
  }

  set(key, value) {
    if(key === undefined || key === null) key = '';
    try{
      wepy.setStorageSync(this.prefix + key, value);
    }catch(e){
    }
  }

  remove(key) {
    if(key === undefined || key === null) key = '';
    try{
      wepy.removeStorageSync(this.prefix + key);
    }catch(e){
    }
  }
}

class CacheService {
  constructor(){
    this.pool = {};
  }

  for(type) {
    if(type === undefined || type === null) throw new Error("Cache type isn't specified");
    
    let store = this.pool[type];
    if(!store) {
      store = new CacheStore(type);
      this.pool[type] = store;
    }
    return store;
  }
}

const cacheService = new CacheService();
export default cacheService;
