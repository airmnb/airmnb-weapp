import {apiClient} from "./restClient";
import amb from "@/util/amb";
import cacheService from "@/util/cacheService";

class PurchaseService {
  constructor(){
    this.cache = cacheService.for('purchases');
  }

  async get(id, force = false){
    if(!force) {
      const cached = this.cache.get(id);
      if(cached) return cached;
    }

    const resp = await apiClient.get(`purchases/${id}`);
    const purchase = resp.purchase;
    this.cache.set(purchase.purchaseId, purchase);
    return purchase;
  }

  async getOngoing(force = false) {
    if(!force) {
      const cached = cacheService.for('purchase/ongoing').get();
      if(cached) return cached;
    }

    const resp = await apiClient.get('purchases', {closed: 0});
    const purchases = resp.purchases;

    // cache
    purchases.forEach(x => this.cache.set(x.purchaseId, x));
    cacheService.for('purchase/ongoing').set(null, purchases);

    return purchases;
  }

  async getClosed(force = false) {
    if(!force) {
      const cached = cacheService.for('purchase/closed').get();
      if(cached) return cached;
    }

    const resp = await apiClient.get('purchases', {closed: 0});
    const purchases = resp.purchases;

    // cache
    purchases.forEach(x => this.cache.set(x.purchaseId, x));
    cacheService.for('purchase/closed').set(null, purchases);

    return purchases;
  }
}

const purchaseService = new PurchaseService();
export default purchaseService;
