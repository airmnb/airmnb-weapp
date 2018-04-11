import wepy from 'wepy';

let url_base = 'https://www.airmnb.com/api/1.0'
// url_base = 'http://localhost:5000/api/1.0'

class RestClient {
  path2Url(path) {
    return url_base + splitter + path;
  }

  async request(method, path, data) {
    const splitter = path.charAt(0) === '/' ? '' : '/';
    const url = url_base + splitter + path;
    const opt = {
      url,
      method,
      data
    };
    return await wepy.request(opt);
  }

  async get(path, data) {
    return await this.request('GET', path, data);
  }

  async post(path, data) {
    return await this.request('POST', path, data);
  }

  async put(path, data) {
    return await this.request('PUT', path, data);
  }

  async delete(path) {
    return await this.request('DELETE', path);
  }
}

const restClient = new RestClient();

export default restClient;
