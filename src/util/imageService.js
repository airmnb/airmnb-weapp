import {apiClient, publicClient, urlBase} from "./restClient";
import wepy from 'wepy';
import amb from '@/util/amb';

class ImageService {
  getSrcUrl(imageId){
    // GET https;//.../public/images/{id}
    return publicClient.path2Url('/images') + `/${imageId}`;
  }

  async chooseImage(count) {
    console.log('choose');
    const res = await wepy.chooseImage({
      count: count || 1,
      sizeType: ['compressed'],
    });
    wepy.showLoading({mask: true});
    const tasks = res.tempFilePaths
      .map(f => this.compressImageWithCanvas(f, 'imageCompressCanvas'))
      .map(p => this.uploadSingleFilePromise(p));
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

  async compressImageWithCanvas(bigImagePath, canvasId) {
    const width = 360;
    const height = 240;
    const info = await wepy.getImageInfo({
      src: bigImagePath
    })
    // return bigImagePath;
    if(info.width <= width && info.height <= height) {
      // Return if the image is small enough.
      return bigImagePath;
    }

    const ctx = wx.createCanvasContext(canvasId);
    ctx.drawImage(bigImagePath, 0, 0, width, height);
    return new Promise((res, rej) => {
      ctx.draw(true, async (e) => {
        try{
          const result = await wepy.canvasToTempFilePath({
            canvasId
          });
          const smallPath = result.tempFilePath;
          res(smallPath);
        }catch(e) {
          rej(e);
        }
      });
    });
  }

  async uploadSingleFilePromise(smallPathPromise) {
    const authHeader = apiClient.getRequestHeaders();
    const header = Object.assign(authHeader, {
      'Content-Type': 'multipart/form-data'
    });
    const path = await smallPathPromise;
    console.log('small iamge', path);
    return await wepy.uploadFile({
      url: apiClient.path2Url('/images'),
      header: header,
      filePath: path,
      name: 'dataFile'}
    )
  }
}

const imageService = new ImageService();
export default imageService;
