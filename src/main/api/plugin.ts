import { baseURL } from '../constants/url';
import httpClient from './httpClient';

const pluginListURL = `${baseURL}/plugin/list`;

function getPluginList(): Promise<any> {
  return httpClient.get(pluginListURL);
}

export { getPluginList };
