import wepy from 'wepy';

let url_base = 'https://www.airmnb.com/api/1.0'
url_base = 'http://localhost:5000/api/1.0'
console.log('API URL base', url_base);

class RestClient {
  path2Url(path) {
    return url_base + splitter + path;
  }

  async httpRequest(opt) {
    return await wepy.request(opt);
  }

  async http(method, path, data) {
    const splitter = path.charAt(0) === '/' ? '' : '/';
    const url = url_base + splitter + path;
    const opt = {
      url,
      method,
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

const restClient = new RestClient();

export default restClient;
