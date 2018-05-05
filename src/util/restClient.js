import wepy from 'wepy';
import amb from './amb';

class RestClient {
  constructor(urlRoot, tokenFunc) {
    this.urlRoot = urlRoot.replace(/\/*$/, '');
    this.tokenFunc = tokenFunc;
  }

  path2Url(path) {
    const splitter = path.charAt(0) === '/' ? '' : '/';
    return this.urlRoot + splitter + path;
  }

  async httpRequest(opt) {
    return await wepy.request(opt);
  }

  async http(method, path, data) {
    const url = this.path2Url(path);
    const header = {
      'Accept-language': amb.config.language,
    }
    if(this.tokenFunc) {
      header['Authorization'] = this.tokenFunc();//`bearer ${amb.config.jwt}`
    }
    const opt = {
      url,
      method,
      header: header,
      data
    };
    const res = await this.httpRequest(opt);
    if(res.statusCode == 200) {
      return res.data;
    }
    throw new Error(res); 
  }

  async get(path, data) {
    return await this.http('GET', path, data);
  }

  async post(path, data) {
    return await this.http('POST', path, data);
  }

  async put(path, data) {
    return await this.http('PUT', path, data);
  }

  async delete(path) {
    return await this.http('DELETE', path);
  }
}

// https://www.airmnb.com/sys
const urlBase = amb.config.app_url.replace(/\/*$/, '')

const sysUrl = urlBase + '/sys';
export const sysClient = new RestClient(sysUrl); 

// https://www.airmnb.com/api/1.0
const apiUrl = urlBase + '/api/' + amb.config.api_version;
export const apiClient = new RestClient(apiUrl, () => `bearer ${amb.config.jwt}`); 

