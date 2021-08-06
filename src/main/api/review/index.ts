import { reviewURL } from '../../constants/url';
import httpClient from '../httpClient';

/**
 * 获取插件最新的审批
 * @param data
 * @returns
 */
function lastestReview(pluginId: string): Promise<any> {
  return httpClient.get(`${reviewURL}/pluginId/${pluginId}`);
}

export { lastestReview };
