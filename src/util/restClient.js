import wepy from 'wepy';
import amb from './amb';

class RestClient {
  constructor(urlRoot) {
    this.urlRoot = urlRoot.replace(/\/*$/, '');
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
    const opt = {
      url,
      method,
      header: {
        'Accept-language': amb.config.language,
        'Authorization': `bearer ${amb.config.jwt}`
      },
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
const urlBase = amb.config.app_url.replace(/\/*$/, '') + '/'

const sysUrl = urlBase + 'sys';
export const sysClient = new RestClient(sysUrl); 

// https://www.airmnb.com/api/1.0
const apiUrl = urlBase + amb.config.api_path.replace(/^\/*/, '');
export const apiClient = new RestClient(apiUrl); 

