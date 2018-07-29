import {apiClient, publicClient, urlBase} from "./restClient";
import wepy from 'wepy';
import uuid from 'uuid-v4';
import amb from '@/util/amb';
import cacheService from "@/util/cacheService";

class ImageService {
  constructor(){
    this.cache = cacheService.for('images')
  }

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
    const map = new Map()
    res.tempFilePaths.forEach(p => map.set(uuid(), p));
    return map;
    // wepy.showLoading({mask: true});
    // const tasks = res.tempFilePaths
    //   .map(f => this.compressImageWithCanvas(f, 'imageCompressCanvas'))
    //   .map(p => this.uploadSingleImage(p));
    // const resps = await Promise.all(tasks);
    // console.log(resps);
    // wepy.hideLoading();
    // const ids = resps.map(r => {
    //   if(r.statusCode === 200) {
    //     const json = JSON.parse(r.data);
    //     return json.image.imageId;
    //   }
    //   return null;
    // })
    // if(ids.filter(id => !id).length){
    //   throw new Error('Unable to upload image: ' + JSON.stringify(apiResp));
    // }
    // return ids;
  }

  async uploadImages(newImageIds) {
    try{
      wepy.showLoading({mask: true});
      const tasks = newImageIds.map(x => {
        const tempPath = this.cache.get(x)
        if(!tempPath) throw new Exception('Cannot find local image path for ' + x)
        return this.uploadSingleImage(tempPath, x)
      });
      const resps = await Promise.all(tasks);
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
    }catch(e){
      amb.showError(e)
    }finally{
      wepy.hideLoading();
    }
  }

  // async compressImageWithCanvas(bigImagePath, canvasId) {
  //   const width = 360;
  //   const height = 240;
  //   const info = await wepy.getImageInfo({
  //     src: bigImagePath
  //   })
    
  //   // TODO: Always return the big image for now
  //   // until we know why image uploading/downloading is so slow on prod.
  //   return bigImagePath;


  //   if(info.width <= width && info.height <= height) {
  //     // Return if the image is small enough.
  //     return bigImagePath;
  //   }

  //   const ctx = wx.createCanvasContext(canvasId);
  //   ctx.drawImage(bigImagePath, 0, 0, width, height);
  //   return new Promise((res, rej) => {
  //     ctx.draw(true, async (e) => {
  //       try{
  //         const result = await wepy.canvasToTempFilePath({
  //           canvasId
  //         });
  //         const smallPath = result.tempFilePath;
  //         res(smallPath);
  //       }catch(e) {
  //         rej(e);
  //       }
  //     });
  //   });
  // }

  async uploadSingleImage(tempFilePath, imageUuid) {
    if(!imageUuid) throw new Error("imageUuid isn't specified")
    const authHeader = apiClient.getRequestHeaders();
    const header = Object.assign(authHeader, {
      'Content-Type': 'multipart/form-data'
    });
    return await wepy.uploadFile({
      url: apiClient.path2Url(`/images/${imageUuid}`),
      header: header,
      filePath: tempFilePath,
      name: 'dataFile'}
    )
  }
}

const imageService = new ImageService();
export default imageService;
