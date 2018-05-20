import {apiClient, publicClient, urlBase} from "./restClient";
import wepy from 'wepy';
import amb from '@/util/amb';

class ImageService {
  getSrcUrl(imageId){
    // GET https;//.../public/images/{id}
    return publicClient.path2Url('/images') + `/${imageId}`;
  }

  async chooseImage(count) {
    const res = await wepy.chooseImage({
      count: count || 1,
      sizeType: ['compressed'],
    });
    wepy.showLoading({mask: true});
    const tasks = res.tempFilePaths.map(f => this.uploadSingleFilePromise(f));
    const resps = await Promise.all(tasks);
    console.log(resps);
    wepy.hideLoading();
    const ids = resps.map(r => {
      if(r.statusCode === 200) {
        const json = JSON.parse(r.data);
        return json.image.imageId;
      }
      return null;
    })
    if(ids.filter(id => !id).length){
      throw new Error('Unable to upload image: ' + JSON.stringify(apiResp));
    }
    return ids;
  }

  uploadSingleFilePromise(localPath) {
    return wepy.uploadFile({
      url: apiClient.path2Url('/images'),
      header: apiClient.getRequestHeaders(),
      filePath: localPath,
      name: 'dataFile'}
    )
  }
}
const imageService = new ImageService();
export default imageService;
