import {apiClient, publicClient, urlBase} from "./restClient";
import wepy from 'wepy';
import amb from '@/util/amb';

class ImageService {
  getSrcUrl(imageId){
    // GET https;//.../public/images/{id}
    return publicClient.path2Url('/images') + `/${imageId}`;
  }

  async chooseImage() {
    const res = await wepy.chooseImage({
      count: 1,
      sizeType: ['compressed'],
    });
    const localPath = res.tempFilePaths[0]
    wepy.showLoading({mask: true});
    const apiResp = await wepy.uploadFile({
      url: apiClient.path2Url('/images'),
      header: apiClient.getRequestHeaders(),
      filePath: localPath,
      name: 'dataFile'}
    )
    wepy.hideLoading();
    if(apiResp.statusCode === 200) {
      const json = JSON.parse(apiResp.data);
      return json.image.imageId;
    }
    throw new Error('Unable to upload image: ' + JSON.stringify(apiResp));
  }
}
const imageService = new ImageService();
export default imageService;
