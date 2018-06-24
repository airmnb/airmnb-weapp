import {apiClient} from "./restClient";
import amb from '@/util/amb';

class ProviderService {
  async get(providerId){
    const resp = await apiClient.get(`providers/${providerId}`);
    if(resp.error) {
      throw new Error(resp.error);
    }
    return resp.provider;
  }

  async save(provider) {
    amb.cleanSetModel(provider);
    await apiClient.put(`/providers/${provider.providerId}`, provider);
  }
}

const providerService = new ProviderService();
export default providerService;
