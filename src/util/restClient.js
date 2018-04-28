import wepy from 'wepy';
import amb from './amb';

class RestClient {
  path2Url(path) {
    const splitter = path.charAt(0) === '/' ? '' : '/';
    return amb.config.app_url + splitter + path;
  }

  async httpRequest(opt) {
    return await wepy.request(opt);
  }

  async http(method, path, data) {
    const url = this.path2Url(path);
    const opt = {
      url,
      method,
      headers: {
        'Accept-language': wepy.config.language
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

export const restClient = new RestClient();

